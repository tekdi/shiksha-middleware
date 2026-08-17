import { Request, Response, NextFunction } from 'express';
import * as https from 'node:https';
import * as http from 'node:http';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  apiList,
  regexPatterns,
  urlPatterns,
  publicAPI,
  apiListForAcademicYear,
  webhookEndpoints,
} from './apiConfig';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { GatewayService } from 'src/middleware/gateway.service';
import { MiddlewareLogger } from '../loggers/logger.service';
import { PermissionsService } from '../service/permissions.service';
import APIResponse from 'src/common/response/response';
import { ConfigService } from '@nestjs/config';
import { DataValidationService } from '../service/dataValidation.service';
import { isRbacV2Enabled } from '../config/rbac.config';
import { RBAC_CACHE_INVALIDATE_PATH } from '../rbac/rbac-cache.controller';
import * as multer from 'multer';
import * as FormData from 'form-data';
const upload = multer({
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB for general multipart
  },
});

// Endpoints where the middleware pipes raw bytes directly to the service.
// The service owns parsing, disk storage, and size validation — no buffering here.
const RAW_PIPE_ENDPOINTS = new Set(['/assessment/v1/file/upload']);

/** Paths that return binary (arraybuffer + res.end in gateway, not res.json). */
const ENDPOINT_FILE_TYPE_DEFAULTS: Record<string, string> = {
  '/aspirespecific/certificate/render-PDF': 'pdf',
};

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
        // (AuthGuard('jwt') takes no constructor args — the Reflector previously
        // passed here was silently discarded.)
        const guard = new JwtAuthGuard();
        // custom jwt.strategy will get executed
        await guard.canActivate(context);
      }
      //check for academic year
      if (apiListForAcademicYear.includes(reqUrl)) {
        if (!req.headers['academicyearid']) {
          throw new BadRequestException('Academic year id not found');
        }
      }
      // Skip whitelist check for local endpoints like /metrics
      const localEndpoints = ['/metrics', '/api/swagger-docs', '/health', '/health/live', '/health/ready', RBAC_CACHE_INVALIDATE_PATH];
      if (localEndpoints.includes(reqUrl)) {
        // Allow local endpoints to proceed without forwarding
        return next();
      }

      if (apiList[reqUrl]) {
        // check API is whitelisted
        if (!apiList[reqUrl][req.method.toLowerCase()]) {
          throw new HttpException(
            'SHIKSHA_API_WHITELIST: URL not whitelisted',
            HttpStatus.FORBIDDEN,
          );
        }
        this.middlewareLogger.log(
          reqUrl + ': ' + apiList[reqUrl][req.method.toLowerCase()],
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

        // Awaited so a downstream failure surfaces in this try/catch rather than
        // escaping as an unhandled rejection with no response sent.
        await this.executeChecks(req, res, next, checksToExecute);
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
        error.response?.status || error.status || 500,
      );
    }
  }

  async forwardRequest(req: Request, res: Response) {
    const microserviceUrl = this.getMicroserviceUrl(req.originalUrl);
    const originalUrl = req.originalUrl.split('?');
    const reqUrl = this.matchUrl(originalUrl[0]) || originalUrl[0];
    let forwardUrl = this.constructForwardUrl(reqUrl, originalUrl, apiList);

    let fullUrl = `${microserviceUrl}${forwardUrl}`;
    const token = req.headers['authorization']
      ? req.headers['authorization'].replace('Bearer ', '').trim()
      : '';
    //get userId
    if (req.method.toLowerCase() != 'get' && req?.headers['authorization']) {
      let userId: string | undefined;
      if (isRbacV2Enabled(this.configService)) {
        // Trust only the `sub` that JwtStrategy set after verifying the signature.
        // Public routes skip the guard entirely, so this is correctly undefined
        // there and nothing is injected.
        userId = (req as any).userId;
      } else {
        // Legacy: base64-decodes the token payload WITHOUT verifying it. Kept
        // behind the flag for backward compatibility only — on publicAPI routes
        // the guard never ran, so a forged token reaches the upstream service.
        const payload = req.headers['authorization'].split('.')[1]; // Get the payload part
        const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8'); // Decode the base64 payload with proper Unicode support
        const parsedPayload = JSON.parse(decodedPayload);
        userId = parsedPayload.sub;
      }
      if (userId) {
        fullUrl =
          fullUrl +
          (fullUrl.includes('?') ? `&userId=${userId}` : `?userId=${userId}`);
      }
    }
    this.middlewareLogger.debug(`forwarding to: ${fullUrl}`);

    // Check if this is a file request
    const fileType = this.detectFileType(reqUrl);

    // Log file request detection for debugging
    if (fileType) {
      this.middlewareLogger.log(
        `File request detected: ${fileType} for endpoint: ${reqUrl}`,
      );
    }

    // For endpoints in RAW_PIPE_ENDPOINTS: pipe raw bytes directly to the service.
    // No multer parsing in middleware — zero memory buffering, service owns everything.
    if (req.is('multipart/form-data') && RAW_PIPE_ENDPOINTS.has(reqUrl)) {
      return await this.streamRawToService(req, fullUrl);
    }

    // Handle multipart/form-data first (file uploads)
    if (req.is('multipart/form-data')) {
      this.middlewareLogger.log(
        `Multipart request detected for endpoint: ${reqUrl}`,
      );
      const reqObject = await this.processMultipartForm(req, res);
      if (reqObject) {
        const formData = this.prepareFormData(reqObject);

        // If this endpoint also returns a file, use file handler
        if (fileType) {
          this.middlewareLogger.log(
            `Multipart + File response detected: ${fileType} for endpoint: ${reqUrl}`,
          );
          return await this.gatewayService.handleFileRequestWithMultipart(
            req.method,
            fullUrl,
            formData,
            req.headers,
            res,
            fileType,
          );
        }

        // Otherwise use regular multipart handler
        return await this.gatewayService.handleRequestForMultipartData(
          res,
          fullUrl,
          req.method,
          formData,
          req.headers,
          token,
        );
      }
    }

    // Handle file requests (non-multipart)
    if (fileType) {
      return await this.gatewayService.handleFileRequest(
        req.method,
        fullUrl,
        req.body,
        req.headers,
        res,
        fileType,
      );
    }

    // Check if this is a webhook endpoint that needs raw body preservation
    const isWebhookEndpoint = webhookEndpoints.includes(reqUrl);
    
    // For webhook endpoints, use raw body if available to preserve exact formatting
    const bodyToForward = isWebhookEndpoint && (req as any).rawBody 
      ? (req as any).rawBody 
      : req.body;

    // Handle regular JSON requests
    return await this.gatewayService.handleRequest(
      req.method,
      fullUrl,
      bodyToForward,
      req.headers,
      apiList[reqUrl].changeResponse,
      res,
    );
  }

  // Construct forward URL based on redirect or original URL
  constructForwardUrl(
    reqUrl: string,
    originalUrlParts: string[],
    apiList: any,
  ): string {
    const queryString = originalUrlParts[1] ? `?${originalUrlParts[1]}` : '';
    const redirectUrl = apiList[reqUrl]?.redirectUrl;

    if (redirectUrl) {
      return (
        this.getDynamicRedirectUrl(originalUrlParts[0], reqUrl, redirectUrl) +
        queryString
      );
    }

    return originalUrlParts[0] + queryString;
  }

  // Handle dynamic URLs with placeholders
  getDynamicRedirectUrl(
    originalUrlBase,
    reqUrl: string,
    redirectUrl: string,
  ): string {
    if (reqUrl.includes(':')) {
      const reqUrlParts = originalUrlBase.split('/');
      const dynamicId = reqUrlParts[reqUrlParts.length - 1];
      const redirectUrlParts = redirectUrl.split('/');
      redirectUrlParts[redirectUrlParts.length - 1] = dynamicId;
      return redirectUrlParts.join('/');
    }
    return redirectUrl;
  }

  // Pipe raw multipart bytes directly to the target service using Node's built-in http/https.
  // req is a Readable stream — bytes flow client → middleware → service with zero RAM buffering.
  streamRawToService(req: Request, fullUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const targetUrl = new URL(fullUrl);
      const isHttps = targetUrl.protocol === 'https:';
      const transport = isHttps ? https : http;

      const headers = { ...req.headers };
      headers['host'] = targetUrl.host;
      delete headers['connection'];

      const proxyReq = transport.request(
        {
          hostname: targetUrl.hostname,
          port: targetUrl.port || (isHttps ? 443 : 80),
          path: targetUrl.pathname + targetUrl.search,
          method: req.method,
          headers,
        },
        (proxyRes: any) => {
          const chunks: Uint8Array[] = [];
          proxyRes.on('data', (chunk: Uint8Array) => chunks.push(chunk));
          proxyRes.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve(body);
            }
          });
          proxyRes.on('error', reject);
        },
      );

      proxyReq.on('error', reject);
      req.pipe(proxyReq);
    });
  }

  // Handle multipart/form-data
  async processMultipartForm(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      upload.any()(req, res, (err) => {
        if (err) {
          const errorMessage =
            err instanceof multer.MulterError
              ? `File too large: ${err.message}`
              : `Error processing form data: ${err.message}`;
          return reject(new BadRequestException(errorMessage));
        }

        resolve({ files: req.files, data: req.body });
      });
    });
  }

  // Prepare FormData for Axios call
  prepareFormData(reqObject: any): FormData {
    const formData = new FormData();

    // Check if there are files to process
    if (reqObject.files && reqObject.files.length > 0) {
      reqObject.files.forEach((file: any) => {
        // Append each file to the formData, using the fieldname and file details
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });
    }

    // Append other form data (e.g., text fields)
    if (reqObject.data) {
      Object.keys(reqObject.data).forEach((key) => {
        formData.append(key, reqObject.data[key]);
      });
    }

    return formData;
  }

  // Detect file type based on endpoint configuration
  private detectFileType(reqUrl: string): string | null {
    const fromDefaults = ENDPOINT_FILE_TYPE_DEFAULTS[reqUrl];
    if (fromDefaults) {
      return fromDefaults;
    }
    const endpointConfig =
      this.configService.get<string>('FILE_TYPE_ENDPOINTS') || '';
    const endpointMap = this.parseEndpointConfig(endpointConfig);

    return endpointMap[reqUrl] || null;
  }

  // Parse endpoint configuration string
  private parseEndpointConfig(configString: string) {
    const endpoints = {};
    if (!configString.trim()) return endpoints;

    configString.split(',').forEach((mapping) => {
      const parts = mapping.split(':');
      if (parts.length >= 2) {
        const [type, endpoint] = parts;
        endpoints[endpoint.trim()] = type.trim();
      }
    });
    return endpoints;
  }

  getMicroserviceUrl(url: string): string | undefined {
    // Mapping of URL prefixes to their corresponding service configuration keys
    const serviceMapping: { [key: string]: string } = {
      '/user': 'USER_SERVICE',
      '/event-service': 'EVENT_SERVICE',
      '/todo': 'TODO_SERVICE',
      '/notification-templates': 'NOTIFICATION_SERVICE',
      '/notification': 'NOTIFICATION_SERVICE',
      '/queue': 'NOTIFICATION_SERVICE',
      '/v1/tracking': 'TRACKING_SERVICE',
      '/api/v1/attendance': 'ATTENDANCE_SERVICE',
      '/prathamservice/v1': 'PRATHAM_SERVICE',
      '/opportunity-service': 'OPPORTUNITY_SERVICE',
      '/lms-service/v1': 'LMS_SERVICE',
      '/assessment/v1': 'SHIKSHA_ASSESSMENT_SERVICE',
      '/aspirespecific': 'USER_SPECIFIC_SERVICE',

      //sunbird knowlg and inquiry
      '/api/question': 'ASSESSMENT_SERVICE',
      '/action/question': 'ASSESSMENT_SERVICE',
      '/action/questionset': 'ASSESSMENT_SERVICE',
      '/api/channel': 'CONTENT_SERVICE',
      '/api/framework': 'TAXONOMY_SERVICE',
      '/action/composite': 'SEARCH_SERVICE',
      '/action/object': 'TAXONOMY_SERVICE',
      '/api/object': 'TAXONOMY_SERVICE',
      '/action/asset': 'CONTENT_SERVICE',
      '/action/content': 'CONTENT_SERVICE',
      '/api/content': 'CONTENT_SERVICE',
      '/action/license': 'CONTENT_SERVICE',
      '/action/collection': 'CONTENT_SERVICE',
      '/api/course/': 'CONTENT_SERVICE',
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

      if (privilegeOfTenant == undefined || privilegeOfTenant == null) {
        return reject("User doesn't have appropriate privilege");
      }

      if (privilegeOfTenant.name == 'UnauthorizedException') {
        return reject("User doesn't have appropriate privilege");
      }
      const isAuthorized = privilegesForURL.some((permission: string) =>
        privilegeOfTenant?.includes(permission),
      );
      if (isAuthorized) {
        return resolve(true);
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
      if (rolesOfTenant == undefined || rolesOfTenant == null) {
        return reject("User doesn't have appropriate privilege");
      }
      if (rolesOfTenant.name == 'UnauthorizedException') {
        return reject("User doesn't have appropriate privilege");
      }

      const isAuthorized =
        rolesForURL.filter((role: string) => rolesOfTenant?.includes(role))
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
      // Was a copy of DATA_CONTEXT and called checkUserCohortValidation, making it
      // indistinguishable from that check. Now validates what its name says: that
      // the requested context belongs to the requested tenant. No route currently
      // declares this check, so correcting it cannot regress live traffic.
      const isValidUserContextRelation =
        await this.dataValidationService.checkCohortTenantValidation(
          req.body.contextId,
          req.headers['tenantid'],
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
