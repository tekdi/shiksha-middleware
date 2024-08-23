import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { MiddlewareLogger } from 'src/common/loggers/logger.service';


@Injectable()
export class GatewayService {
  constructor(private readonly middlewareLogger: MiddlewareLogger) {}

  async handleRequest(
    method: string,
    url: string,
    body: any,
    headers: any,
  ){
    url = url 
    const options = {
      method, // HTTP method (GET, POST, PUT, DELETE, etc.)
      url, // URL of the API endpoint,
      data: body, // Request body object,
      headers: headers
    };
    
    const response = await axios(options);
    this.middlewareLogger.log(
      `method: ${method} url: ${url} body: ${body ? body : ''} headers: ${headers ? headers : ''}`,
    );
   // Return Axios response
    return response.data;
  }
}
