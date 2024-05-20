import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class GatewayService {
  constructor() {}

  async handleRequest(
    method: string,
    url: string,
    body: any,
    headers: any,
  ): Promise<AxiosResponse<any, any>> {
    const options = {
      method, // HTTP method (GET, POST, PUT, DELETE, etc.)
      url, // URL of the API endpoint
      data: body, // Request body object
      // Add any other Axios request options here
    };

    try {
      const response = await axios(options);
      return response; // Return Axios response
    } catch (e) {
      throw e;
    }
  }
}
