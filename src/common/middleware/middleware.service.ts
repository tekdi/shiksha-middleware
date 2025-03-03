import { Request, Response, NextFunction } from 'express';
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
import * as multer from 'multer';
import * as FormData from 'form-data';
// Set up Multer with file size limit (e.g., 2 MB)
const upload = multer({
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB limit
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
      //check for academic year
      if (apiListForAcademicYear.includes(reqUrl)) {
        if (!req.headers['academicyearid']) {
          throw new BadRequestException('Academic year id not found');
        }
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
        const response = await this.forwardRequest(req, res);
        return res.json(response);
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
      const payload = req.headers['authorization'].split('.')[1]; // Get the payload part
      const decodedPayload = atob(payload); // Decode the base64 payload
      const parsedPayload = JSON.parse(decodedPayload);
      let userId = parsedPayload.sub;
      if (userId) {
        console.log('in if ', userId);
        fullUrl =
          fullUrl +
          (fullUrl.includes('?') ? `&userId=${userId}` : `?userId=${userId}`);
      }
    }
    console.log('fullUrl', fullUrl);
    //console.log('req: ', req);
    console.log(
      "req.is('multipart/form-data'): ",
      req.is('multipart/form-data'),
    );
    // Handle multipart/form-data
    if (req.is('multipart/form-data')) {
      const reqObject = await this.processMultipartForm(req, res);
      if (reqObject) {
        const formData = this.prepareFormData(reqObject);
        return await this.gatewayService.handleRequestForMultipartData(
          res,
          fullUrl,
          req.method,
          formData,
          token,
        );
      }
    } else {
      return await this.gatewayService.handleRequest(
        req.method,
        fullUrl,
        req.body,
        req.headers,
        apiList[reqUrl].changeResponse,
        res,
      );
    }
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
}
