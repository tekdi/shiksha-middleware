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
    if (oheaders['organisationid']) {
      newheaders['organisationid'] = oheaders['organisationid'];
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
    oheaders: any,
    token?: string,
  ) {
    try {
      let response;
      const headers = {
        ...formData.getHeaders(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      if (oheaders?.tenantid) headers.tenantid = oheaders.tenantid;
      if (oheaders?.academicyearid)
        headers.academicyearid = oheaders.academicyearid;
      if (oheaders?.organisationid)
        headers.organisationid = oheaders.organisationid;
      response = await axios({
        method: method.toLowerCase(),
        url,
        data: formData,
        headers,
      });

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
  // For handling PDF responses
  async handlePDFRequest(
    method: string,
    url: string,
    body: Object,
    oheaders: any,
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
    if (oheaders['organisationid']) {
      newheaders['organisationid'] = oheaders['organisationid'];
    }

    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: newheaders,
        responseType: 'arraybuffer', // Handle binary responses
      });

      res.status(response.status);

      // Set PDF-specific headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        response.headers['content-disposition'] ||
          'attachment; filename="certificate.pdf"',
      );
      res.setHeader('Content-Length', response.data.length);

      // Send the PDF buffer directly
      res.end(response.data);
    } catch (error) {
      this.middlewareLogger.error('PDF request error:', error);

      if (error.response) {
        res.status(error.response.status);

        // If the error response is also a PDF, handle it
        if (
          error.response.headers['content-type']?.includes('application/pdf')
        ) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader(
            'Content-Disposition',
            error.response.headers['content-disposition'] ||
              'attachment; filename="error-certificate.pdf"',
          );
          res.setHeader('Content-Length', error.response.data.length);
          res.end(error.response.data);
        } else {
          // Handle JSON error responses
          res.locals.responseBody = error.response.data;
          res.json(error.response.data);
        }
      } else if (error.request) {
        // No response was received
        res.status(500);
        res.json({
          result: {},
          params: {
            err: 'Internal server error',
            errmsg: 'Internal server error',
            status: 'failed',
          },
          responseCode: 500,
        });
      } else {
        // Error occurred in setting up the request
        res.status(500);
        res.json({
          result: {},
          params: {
            err: 'Request setup error',
            errmsg: error.message,
            status: 'failed',
          },
          responseCode: 500,
        });
      }
    }
  }
}
