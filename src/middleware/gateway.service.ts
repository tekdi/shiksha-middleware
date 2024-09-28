import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MiddlewareLogger } from 'src/common/loggers/logger.service';

@Injectable()
export class GatewayService {
  constructor(private readonly middlewareLogger: MiddlewareLogger) {}

  async handleRequest(
    method: string,
    url: string,
    body: Object,
    oheaders: any,
  ) {
    let newheaders = {
      tenantId: oheaders['tenantid'],
      'content-type': 'application/json',
      authorization: oheaders['authorization'],
    };
    if (oheaders['x-channel-id'])
      newheaders['x-channel-id'] = oheaders['x-channel-id'];
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: newheaders,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        // No response was received
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
