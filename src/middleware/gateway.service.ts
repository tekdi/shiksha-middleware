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
    headers: any,
  ){
    const options = {
      method, // HTTP method (GET, POST, PUT, DELETE, etc.)
      url, // URL of the API endpoint,
      data: body, // Request body object,
      headers: headers,
      timeout: 10000
    };
      try {
        console.log("options: ",options)
        console.log("typeOf", typeof options.data)
        const response = await axios(options);
        return response.data
      } catch (error) {
        if (error.response) {
          
          return error.response.data;
        } else if (error.request) {
          // No response was received
          return {
            result : {},
            params : {
              "err": "Internal server error",
              "errmsg": "Internal server error",
              "status": "failed"
            }
          }
        } else {
          // Error occurred in setting up the request
          return error.message;
        }
      }
  }
}
