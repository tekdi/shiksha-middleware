import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MiddlewareLogger } from 'src/common/loggers/logger.service';
import { Response } from 'express';

function maskAuthHeader(headerValue: any): string {
  if (!headerValue || typeof headerValue !== 'string') return String(headerValue);
  const token = headerValue.replace(/^Bearer\s+/i, '');
  if (token.length <= 16) return 'Bearer ***';
  return `Bearer ${token.slice(0, 8)}...${token.slice(-8)}`;
}

function buildCurl(method: string, url: string, headers: any, body?: any): string {
  const headerFlags = Object.entries(headers || {})
    .map(([key, value]) => {
      const displayValue =
        key.toLowerCase() === 'authorization' ? maskAuthHeader(value) : value;
      return `-H '${key}: ${displayValue}'`;
    })
    .join(' ');
  const dataFlag = body ? `-d '${JSON.stringify(body)}'` : '';
  return `curl -X ${method?.toUpperCase()} '${url}' ${headerFlags} ${dataFlag}`.trim();
}

@Injectable()
export class GatewayService {
  constructor(private readonly middlewareLogger: MiddlewareLogger) {}

  async handleRequest(
    method: string,
    url: string,
    body: Object,
    oheaders: any,
    changeResponse: boolean,
    res: Response,
  ) {
    let newheaders = {
      tenantId: oheaders['tenantid'],
      academicyearid: oheaders['academicyearid'],
      'content-type': 'application/json',
      authorization: oheaders['authorization'],
    };
    if (oheaders['x-channel-id']) {
      newheaders['x-channel-id'] = oheaders['x-channel-id'];
    }
    if (oheaders['x-signature']) {
      newheaders['x-signature'] = oheaders['x-signature'];
    }
    if (oheaders['x-erp-secret']) {
      newheaders['x-erp-secret'] = oheaders['x-erp-secret'];
    }
    this.middlewareLogger.log(
      `[GatewayService] Outbound request: ${buildCurl(method, url, newheaders, body)}`,
    );
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: newheaders,
      });
      this.middlewareLogger.log(
        `[GatewayService] Outbound response: status=${response.status} for ${method?.toUpperCase()} ${url}`,
      );
      res.status(response.status);
      res.locals.responseBody = response.data;
      res.json(response.data);
    } catch (error) {
      if (error.response) {
        this.middlewareLogger.error(
          `[GatewayService] Outbound request failed: status=${error.response.status} for ${method?.toUpperCase()} ${url}`,
          JSON.stringify(error.response.data),
        );
        if (changeResponse) {
          if (
            error.response.data.params.err === 'ERR_YOUTUBE_LICENSE_VALIDATION'
          ) {
            error.response.data.responseCode = 200;
            error.response.data.result = {
              license: {
                valid: false,
                value: 'youtube',
              },
            };
            error.response.status = 200;
          }
        }
        res.status(error.response.status);
        res.locals.responseBody = error.response.data;
        res.json(error.response.data);
      } else if (error.request) {
        this.middlewareLogger.error(
          `[GatewayService] Outbound request got no response for ${method?.toUpperCase()} ${url}`,
          error.message,
        );
        // No response was received
        res.status(500);
        return {
          result: {},
          params: {
            err: 'Internal server error',
            errmsg: 'Internal server error',
            status: 'failed',
          },
          responseCode: 500,
        };
      } else {
        this.middlewareLogger.error(
          `[GatewayService] Failed to set up outbound request for ${method?.toUpperCase()} ${url}`,
          error.message,
        );
        res.status(500);
        // Error occurred in setting up the request
        return error.message;
      }
    }
  }
  async handleRequestForMultipartData(
    res: Response,
    url: string,
    method: string,
    formData: any,
    token?: string,
  ) {
    try {
      let response: any;
      const headers = {
        ...formData.getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      this.middlewareLogger.log(
        `[GatewayService] Outbound multipart request: ${buildCurl(method, url, headers)}`,
      );
      response = await axios({
        method: method.toLowerCase(),
        url,
        data: formData,
        headers,
      });
      this.middlewareLogger.log(
        `[GatewayService] Outbound multipart response: status=${response.status} for ${method?.toUpperCase()} ${url}`,
      );

      res.locals.responseBody = response.data;
      res.status(response.status);
      return response.data;
    } catch (error) {
      if (error.response) {
        this.middlewareLogger.error(
          `[GatewayService] Outbound multipart request failed: status=${error.response.status} for ${method?.toUpperCase()} ${url}`,
          JSON.stringify(error.response.data),
        );
        res.locals.responseBody = error.data;
        res.status(error.response.status);
        return error.response.data;
      } else if (error.request) {
        this.middlewareLogger.error(
          `[GatewayService] Outbound multipart request got no response for ${method?.toUpperCase()} ${url}`,
          error.message,
        );
        // No response was received
        res.status(500);
        return {
          result: {},
          params: {
            err: 'Internal server error',
            errmsg: 'Internal server error',
            status: 'failed',
          },
        };
      } else {
        this.middlewareLogger.error(
          `[GatewayService] Failed to set up outbound multipart request for ${method?.toUpperCase()} ${url}`,
          error.message,
        );
        // Error occurred in setting up the request
        return error.message;
      }
    }
  }
}
