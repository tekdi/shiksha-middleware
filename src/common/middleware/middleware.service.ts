import { Request, Response, NextFunction } from 'express';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { apiList, regexPatterns, urlPatterns} from './apiConfig';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { GatewayService } from 'src/middleware/gateway.service';
import { MiddlewareLogger } from '../loggers/logger.service';
import { PermissionsService } from '../service/permissions.service';
import APIResponse from "src/common/response/response";
import { ConfigService } from '@nestjs/config';
import { DataValidationService } from '../service/dataValidation.service';

@Injectable()
export class MiddlewareServices {
  constructor(
    private readonly reflector: Reflector,
    private gatewayService: GatewayService,
    private readonly middlewareLogger: MiddlewareLogger,
    private permissionService: PermissionsService,
    private configService: ConfigService,
    private dataValidationervice: DataValidationService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Basic check if user is a valid keyCloack user, if tenant ID present in the request
      const context = new ExecutionContextHost([req, res, next]);
      // Create an instance of the JwtAuthGuard
      const guard = new JwtAuthGuard(this.reflector);
      // custom jwt.strategy will get executed 
      await guard.canActivate(context);
      const originalUrl = req.originalUrl;
      let reqUrl = originalUrl.split('?')[0];
      const withPattern = this.matchUrl(reqUrl)
      reqUrl = (withPattern) || reqUrl;
      // check API is whitelisted 
      if (apiList[reqUrl]) {
        let checksToExecute = [];
        // Iterate for checks defined for API and push to array
        apiList[reqUrl].checksNeeded?.forEach(CHECK => {
          checksToExecute.push(new Promise((res, rej) => {
            if (apiList[reqUrl][CHECK] && typeof this.urlChecks[CHECK] === 'function') {
              this.urlChecks[CHECK](res, rej, req, apiList[reqUrl][CHECK], reqUrl);
            }
          }));
        });
        this.executeChecks(req, res, next, checksToExecute);
      } else {
        //If API is not whitelisted
        this.middlewareLogger.log(
          `msg: 'SHIKSHA_API_WHITELIST: URL not whitelisted',
          reqPath: ${req.path},
          reqOriginalUrl: ${req.originalUrl},
          method: ${req.method}`
        );
        throw new HttpException('SHIKSHA_API_WHITELIST: URL not whitelisted', HttpStatus.FORBIDDEN);      
      }
    } catch (error) {
      console.log('error', error.response.data);
      return APIResponse.error(res, 'api.middleware', null, error.message,error.response?.status || 500);
    }        
  }

  async forwardRequest(req: Request, res: Response) {
    const microserviceUrl = this.getMicroserviceUrl(req.originalUrl);
    const config = {
        method: req.method,
        url:`${microserviceUrl}${req.originalUrl}`,
        headers: req.headers ,
        data: req.body
    };
    return await this.gatewayService.handleRequest(config.method,config.url,config.data,config.headers);
  }

  getMicroserviceUrl(url: string): string {
    // Determine the microservice URL based on the requested endpoint
    if (url.startsWith('/user')) {
      return this.configService.get('USER_SERVICE');
    }
    if(url.startsWith('/event-service')){
      return this.configService.get('EVENT_SERVICE')
    }
    if(url.startsWith('/notification-templates') || url.startsWith('/notification') || url.startsWith('/queue')){
      return this.configService.get('NOTIFICATION_SERVICE')
    }
    if(url.startsWith('/v1/tracking')){
      return this.configService.get('TRACKING_SERVICE')
    }
    if(url.startsWith('/api/v1/attendance')){
      return this.configService.get('ATTENDANCE_SERVICE')
    }
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

  PRIVILEGE_CHECK: async (resolve, reject, req, privilegesForURL, REQ_URL) => {
    const privilegeOfTenant: any = await this.permissionService.getUserPrivilegesForTenant(req.userId,req.headers['tenantid']);
    //check for admin
    if(privilegeOfTenant.includes('all')){
      return resolve(true)
    }else{
        const isAuthorized = privilegesForURL.some((permission: string) =>
                              privilegeOfTenant.includes(permission));
        if (isAuthorized) {
          return resolve(true);
        }
    }
    return reject('User doesn\'t have appropriate roles');
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

    const rolesOfTenant: any = await this.permissionService.getUserRolesForTenant(req.userId,req.headers['tenantid']);
  
    const isAuthorized = rolesOfTenant?.includes('admin') ? 
                         true :
                          rolesForURL.filter((role: string) =>
                              rolesOfTenant.includes(role)
                          ).length > 0
                          
    if (isAuthorized) {
      return resolve(true);
    }
    return reject('User doesn\'t have appropriate roles');
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
    const isValidUserTenantRelation =await this.dataValidationervice.checkUserTenantValidation(req.body.userId,req.headers['tenantid']);
    if(isValidUserTenantRelation){
      return resolve(true)
    }
    return reject('Data requested for processing is not valid, please insure you have passesd correct userId and related tenantId, contextId');
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

    const isValidUserContextRelation =await this.dataValidationervice.checkUserCohortValidation(req.body.userId,req.body.contextId);
    if(isValidUserContextRelation){
      return resolve(true)
    }
    return reject('Data requested for processing is not valid, please insure you have passesd correct userId and related tenantId, contextId');
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

    const isValidUserContextRelation =await this.dataValidationervice.checkUserCohortValidation(req.body.userId,req.body.contextId);
    if(isValidUserContextRelation){
      return resolve(true)
    }
    return reject('Data requested for processing is not valid, please insure you have passesd correct userId and related tenantId, contextId');
  }
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
    if(checksToExecute.length == 0){
            const response = await this.forwardRequest(req, res);
            console.log('response in middleware', response);
            return res.json(response);
    }
    await Promise.allSettled(checksToExecute)
      .then(async (promiseRes:any) => {
        if (promiseRes) {
          let _isRejected = promiseRes.find(o => o.status === 'rejected');
          if (_isRejected) {
            this.middlewareLogger.log(
              `msg: ${_isRejected.reason},
              reqPath: ${req.path},
              reqOriginalUrl: ${req.originalUrl},
              method: ${req.method}`
            );
            return APIResponse.error(res, 'api.middleware', null, _isRejected.reason, HttpStatus.FORBIDDEN);
          } else {
            const response = await this.forwardRequest(req, res);
            console.log('response in middleware', response);
            return res.json(response);
          }
        }
      })
  } catch (error) {
    //If API is not whitelisted
    this.middlewareLogger.log(
      `msg: 'SHIKSHA_API_WHITELIST: URL not whitelisted',
      reqPath: ${req.path},
      reqOriginalUrl: ${req.originalUrl},
      method: ${req.method}`
    );
    return APIResponse.error(res, 'api.middleware', null, error.message, HttpStatus.FORBIDDEN);
  }
};
}

