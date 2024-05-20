import { Request, Response, NextFunction } from 'express';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { apiMappings } from './apiConfig';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { GatewayService } from 'src/middleware/gateway.service';

@Injectable()
export class MiddlewareServices {
  constructor(
    private readonly reflector: Reflector,
    private gatewayService: GatewayService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const originalUrl = req.originalUrl;
      let dynamicParam: string | undefined;

      // const user = req.user; // Access payload attached by the guard

      // Extract dynamicParam from the request URL
      const urlParts = originalUrl.split('/');
      dynamicParam = urlParts[urlParts.length - 1];

      // Find the matching API mapping

      const apiIdentifier = this.getAPIConfig(dynamicParam, originalUrl, req);

      if (!apiIdentifier || !dynamicParam) {
        throw new Error('Invalid Url');
      }

      const { microservice, permission, endpoint } = apiMappings[apiIdentifier];
      console.log(permission, 'permission-apiTd');

      req['requiredPermissions'] = permission;

      if (permission) {
        // Create an ExecutionContext
        const context = new ExecutionContextHost([req, res, next]);

        // Create an instance of the JwtAuthGuard
        const guard = new JwtAuthGuard(this.reflector);
        const canActivate = await guard.canActivate(context);

        console.log(canActivate, 'canActive');

        // if (!canActivate) {
        //   return res.status(403).send({ message: 'Forbidden' });
        // }
      }

      const dynamicEndpoint = endpoint.replace('{dynamicParam}', dynamicParam);
      const microserviceUrl = `${microservice}/${dynamicEndpoint}`;

      //   const response: AxiosResponse = await axios();

      const response: AxiosResponse = await this.gatewayService.handleRequest(
        req.method,
        microserviceUrl,
        req.body,
        req.headers,
      );

      res.status(response.status).send(response.data);
    } catch (e) {
      //   console.log(e, 'errr');
      if (e.status === 401) {
        return res.status(401).send(e.response);
      }
      if (e.response.status === 404) {
        return res.status(404).send({ message: e.response.data });
      } else {
        return res.status(500).send({ message: 'Internal server error' });
      }
    }
  }

  getAPIConfig(dynamicParam, originalUrl, req) {
    for (const key in apiMappings) {
      const mapping = apiMappings[key];
      const endpointWithParam = mapping.endpoint.replace(
        '{dynamicParam}',
        dynamicParam,
      );
      if (
        originalUrl.includes(endpointWithParam) &&
        mapping.method === req.method
      ) {
        return key;
      }
    }
  }
}
