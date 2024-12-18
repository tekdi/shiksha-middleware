import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MiddlewareLogger } from 'src/common/loggers/logger.service';
import { Response } from 'express';

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
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: newheaders,
      });
      res.status(response.status);
      res.locals.responseBody = response.data;
      res.json(response.data);
    } catch (error) {
      if (error.response) {
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
        res.status(500);
        // Error occurred in setting up the request
        return error.message;
      }
    }
  }
  async handleRequestForMultipartData(
    res,
    url: string,
    method,
    formData: any,
    token?: string,
  ) {    
    try {   
      let response;
      if(method == 'POST'){
        response = await axios.post(url, formData, {
          headers: {
            ...formData.getHeaders(),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }
      if(method == 'PATCH'){
        response = await axios.patch(url, formData, {
          headers: {
            ...formData.getHeaders(),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }

      res.locals.responseBody = response.data;
      res.status(response.status);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.locals.responseBody = error.data;
        res.status(error.response.status);
        return error.response.data;
      } else if (error.request) {
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
        // Error occurred in setting up the request
        return error.message;
      }
    }
  }
}
