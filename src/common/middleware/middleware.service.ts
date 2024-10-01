import { Request, Response, NextFunction } from 'express';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { apiList, regexPatterns, urlPatterns, publicAPI } from './apiConfig';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { GatewayService } from 'src/middleware/gateway.service';
import { MiddlewareLogger } from '../loggers/logger.service';
import { PermissionsService } from '../service/permissions.service';
import APIResponse from 'src/common/response/response';
import { ConfigService } from '@nestjs/config';
import { DataValidationService } from '../service/dataValidation.service';
import * as multer from 'multer';
import * as FormData from 'form-data';
// Set up Multer with file size limit (e.g., 2 MB)
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
});

@Injectable()
export class MiddlewareServices {
  constructor(
    private readonly reflector: Reflector,
    private gatewayService: GatewayService,
    private readonly middlewareLogger: MiddlewareLogger,
    private permissionService: PermissionsService,
    private configService: ConfigService,
    private dataValidationService: DataValidationService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const originalUrl = req.originalUrl;
      let reqUrl = originalUrl.split('?')[0];
      const withPattern = this.matchUrl(reqUrl);
      reqUrl = withPattern || reqUrl;
      //check for public api
      if (!publicAPI.includes(reqUrl)) {
        //check for tenantId
        const tenantId: any = req.headers['tenantid'];
        if (!tenantId?.trim()) {
          throw new BadRequestException('Tenant id not found');
        }
        // Basic check if user is a valid keyCloack user, if tenant ID present in the request
        const context = new ExecutionContextHost([req, res, next]);
        // Create an instance of the JwtAuthGuard
        const guard = new JwtAuthGuard(this.reflector);
        // custom jwt.strategy will get executed
        await guard.canActivate(context);
      }
      // check API is whitelisted
      if (apiList[reqUrl]) {
        if (!apiList[reqUrl][req.method.toLowerCase()]) {
          throw new HttpException(
            'SHIKSHA_API_WHITELIST: URL not whitelisted',
            HttpStatus.FORBIDDEN,
          );
        }
        console.log(
          'List[reqUrl][req.method.toLowerCase()]: ',
          apiList[reqUrl][req.method.toLowerCase()],
        );
        let checksToExecute = [];
        // Iterate for checks defined for API and push to array
        apiList[reqUrl][req.method.toLowerCase()].checksNeeded?.forEach(
          (CHECK) => {
            checksToExecute.push(
              new Promise((res, rej) => {
                if (
                  apiList[reqUrl][req.method.toLowerCase()][CHECK] &&
                  typeof this.urlChecks[CHECK] === 'function'
                ) {
                  this.urlChecks[CHECK](
                    res,
                    rej,
                    req,
                    apiList[reqUrl][req.method.toLowerCase()][CHECK],
                    reqUrl,
                  );
                }
              }),
            );
          },
        );
        this.executeChecks(req, res, next, checksToExecute);
      } else {
        //If API is not whitelisted
        this.middlewareLogger.log(
          `msg: 'SHIKSHA_API_WHITELIST: URL not whitelisted',
          reqPath: ${req.path},
          reqOriginalUrl: ${req.originalUrl},
          method: ${req.method}`,
        );
        throw new HttpException(
          'SHIKSHA_API_WHITELIST: URL not whitelisted',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      this.middlewareLogger.error(
        `Error in middleware: ${error.message}`,
        error,
      );
      return APIResponse.error(
        res,
        'api.middleware',
        null,
        error.message,
        error.response?.status || 500,
      );
    }
  }

  async forwardRequest(req: Request, res: Response) {
    const microserviceUrl = this.getMicroserviceUrl(req.originalUrl);
    let forwardUrl = req.originalUrl.split('?')[0];
    //replace forwardUrl if redirectUrl present
    //check for dynamic url
    const originalUrl = req.originalUrl;
    let temp = originalUrl.split('?');
    let reqUrl = temp[0];
    const withPattern = this.matchUrl(reqUrl);
    reqUrl = withPattern || reqUrl;
    if (apiList[reqUrl]?.redirectUrl) {
      if (reqUrl.includes(':')) {
        const forwardUrlParts = forwardUrl.split('/');
        const dynamicId = forwardUrlParts[forwardUrlParts.length - 1];
        const redirectUrlParts = apiList[reqUrl].redirectUrl.split('/');
        // Replace the last endpoint with the new string
        redirectUrlParts[redirectUrlParts.length - 1] = dynamicId;
        forwardUrl = redirectUrlParts.join('/');
      } else {
        forwardUrl = apiList[reqUrl].redirectUrl;
      }
      if (temp[1]) {
        forwardUrl = forwardUrl + '?' + temp[1];
      }
    }

    const url = `${microserviceUrl}${forwardUrl}`;
    //check for multipart/formdata
    if (req.is('multipart/form-data')) {
      // Wrap the Multer upload in a Promise
      const uploadFiles = () => {
        return new Promise((resolve, reject) => {
          upload.any()(req, res, (err) => {
            if (err) {
              // Check if the error is due to file size limit
              if (err instanceof multer.MulterError) {
                return reject(
                  new BadRequestException(`File too large: ${err.message}`),
                );
              }
              return reject(
                new BadRequestException(
                  'Error processing form data: ' + err.message,
                ),
              );
            }
            resolve(req.files);
          });
        });
      };
      // Await the file upload
      const files: any = await uploadFiles();

      // Check if files are present
      if (files && files.length > 0) {
        const file = files[0]; // first file

        // Prepare FormData for Axios call
        const formData = new FormData();
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });

        return await this.gatewayService.handleRequestForMultipartData(
          url,
          formData,
        );
      }
    } else {
      return await this.gatewayService.handleRequest(
        req.method,
        url,
        req.body,
        req.headers,
      );
    }
  }

  getMicroserviceUrl(url: string): string | undefined {
    // Mapping of URL prefixes to their corresponding service configuration keys
    const serviceMapping: { [key: string]: string } = {
      '/user': 'USER_SERVICE',
      '/event-service': 'EVENT_SERVICE',
      '/notification-templates': 'NOTIFICATION_SERVICE',
      '/notification': 'NOTIFICATION_SERVICE',
      '/queue': 'NOTIFICATION_SERVICE',
      '/v1/tracking': 'TRACKING_SERVICE',
      '/api/v1/attendance': 'ATTENDANCE_SERVICE',

      //sunbird knowlg and inquiry
      '/api/question': 'ASSESSMENT_SERVICE',
      '/action/question': 'ASSESSMENT_SERVICE',
      '/action/questionset': 'ASSESSMENT_SERVICE',
      '/api/channel': 'CONTENT_SERVICE',
      '/api/framework': 'TAXONOMY_SERVICE',
      '/action/composite': 'SEARCH_SERVICE',
      '/action/object': 'TAXONOMY_SERVICE',
      '/action/asset': 'CONTENT_SERVICE',
      '/action/content': 'CONTENT_SERVICE',
    };

    // Iterate over the mapping to find the correct service based on the URL prefix
    for (const [prefix, serviceKey] of Object.entries(serviceMapping)) {
      if (url.startsWith(prefix)) {
        return this.configService.get(serviceKey);
      }
    }

    // Return undefined if no matching service is found
    return undefined;
  }

  matchUrl(url) {
    for (let i = 0; i < regexPatterns.length; i++) {
      if (regexPatterns[i].test(url)) {
        return urlPatterns[i];
      }
    }
    return null;
  }

  /**
   * @description
   * Set of methods which checks for certain condition on URL
   * @since release-3.1.0
   */
  urlChecks = {
    PRIVILEGE_CHECK: async (
      resolve,
      reject,
      req,
      privilegesForURL,
      REQ_URL,
    ) => {
      const privilegeOfTenant: any =
        await this.permissionService.getUserPrivilegesForTenant(
          req.userId,
          req.headers['tenantid'],
        );
      //check for admin
      if (privilegeOfTenant?.includes('all')) {
        return resolve(true);
      } else {
        const isAuthorized = privilegesForURL.some((permission: string) =>
          privilegeOfTenant?.includes(permission),
        );
        if (isAuthorized) {
          return resolve(true);
        }
      }
      return reject("User doesn't have appropriate privilege");
    },

    /**
     * @param  {Callback} resolve     - Callback to `isAllowed` function promise object
     * @param  {Callback} reject      - Callback to `isAllowed` function promise object
     * @param  {Object} req           - API request object
     * @param  {Array} rolesForURL    - Array of roles defined for incoming API
     * @access Private
     * @description - Function to check session roles and defined roles are having one in common
     * @since - release-3.1.0
     */
    ROLE_CHECK: async (resolve, reject, req, rolesForURL, REQ_URL) => {
      const rolesOfTenant: any =
        await this.permissionService.getUserRolesForTenant(
          req.userId,
          req.headers['tenantid'],
        );

      const isAuthorized = rolesOfTenant?.includes('admin')
        ? true
        : rolesForURL.filter((role: string) => rolesOfTenant?.includes(role))
            .length > 0;

      if (isAuthorized) {
        return resolve(true);
      }
      return reject("User doesn't have appropriate roles");
    },
    /**
     * @param  {Callback} resolve     - Callback to `isAllowed` function promise object
     * @param  {Callback} reject      - Callback to `isAllowed` function promise object
     * @param  {Object} req           - API request object
     * @access Private
     * @description - Function to check user belongs to the requested tenant.
     * @since - release-3.1.0
     */
    DATA_TENANT: async (resolve, reject, req) => {
      const isValidUserTenantRelation =
        await this.dataValidationService.checkUserTenantValidation(
          req.body.userId,
          req.headers['tenantid'],
        );
      if (isValidUserTenantRelation) {
        return resolve(true);
      }
      return reject(
        'Data requested for processing is not valid, please insure you have passesd correct userId and related tenantId, contextId',
      );
    },
    /**
     * @param  {Callback} resolve     - Callback to `isAllowed` function promise object
     * @param  {Callback} reject      - Callback to `isAllowed` function promise object
     * @param  {Object} req           - API request object
     * @access Private
     * @description - Function to check user is member of requested context.
     * @since - release-3.1.0
     */
    DATA_CONTEXT: async (resolve, reject, req) => {
      const isValidUserContextRelation =
        await this.dataValidationService.checkUserCohortValidation(
          req.body.userId,
          req.body.contextId,
        );
      if (isValidUserContextRelation) {
        return resolve(true);
      }
      return reject(
        'Data requested for processing is not valid, please insure you have passesd correct userId and related tenantId, contextId',
      );
    },
    /**
     * @param  {Callback} resolve     - Callback to `isAllowed` function promise object
     * @param  {Callback} reject      - Callback to `isAllowed` function promise object
     * @param  {Object} req           - API request object
     * @access Private
     * @description - Function to check requested context is in the requested tenant.
     * @since - release-3.1.0
     */
    DATA_TENANT_CONTEXT: async (resolve, reject, req) => {
      const isValidUserContextRelation =
        await this.dataValidationService.checkUserCohortValidation(
          req.body.userId,
          req.body.contextId,
        );
      if (isValidUserContextRelation) {
        return resolve(true);
      }
      return reject(
        'Data requested for processing is not valid, please insure you have passesd correct userId and related tenantId, contextId',
      );
    },
  };

  /**
   * @param  {Object} req             - Request Object
   * @param  {Object} res             - Response Object
   * @param  {Function} next          - Function for next middleware
   * @param  {Array} checksToExecute  - Array of methods (checks; defined in urlChecks object)
   * @description
   * 1. Array of methods executed by promise
   * 2. On success; API is allowed
   * 3. On error; 403 Forbidden response is sent
   * @since release-4.1.0
   */
  executeChecks = async (req, res, next, checksToExecute) => {
    try {
      if (checksToExecute.length == 0) {
        const response = await this.forwardRequest(req, res);
        return res.json(response);
      }
      await Promise.allSettled(checksToExecute).then(
        async (promiseRes: any) => {
          if (promiseRes) {
            let _isRejected = promiseRes.find((o) => o.status === 'rejected');
            if (_isRejected) {
              this.middlewareLogger.log(
                `msg: ${_isRejected.reason},
              reqPath: ${req.path},
              reqOriginalUrl: ${req.originalUrl},
              method: ${req.method}`,
              );
              return APIResponse.error(
                res,
                'api.middleware',
                null,
                _isRejected.reason,
                HttpStatus.FORBIDDEN,
              );
            } else {
              const response = await this.forwardRequest(req, res);
              console.log('response in middleware', response);
              return res.json(response);
            }
          }
        },
      );
    } catch (error) {
      //If API is not whitelisted
      this.middlewareLogger.log(
        `msg: 'SHIKSHA_API_WHITELIST: URL not whitelisted',
      reqPath: ${req.path},
      reqOriginalUrl: ${req.originalUrl},
      method: ${req.method}`,
      );
      return APIResponse.error(
        res,
        'api.middleware',
        null,
        error.message,
        HttpStatus.FORBIDDEN,
      );
    }
  };
}
