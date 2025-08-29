import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MiddlewareLogger } from 'src/common/loggers/logger.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayService {
  constructor(
    private readonly middlewareLogger: MiddlewareLogger,
    private readonly configService: ConfigService,
  ) {}

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
  async handleFileRequest(
    method: string,
    url: string,
    body: Object,
    oheaders: any,
    res: Response,
    fileType: string,
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

      // Get file type configuration
      const fileConfig = this.getFileTypeConfig(fileType);

      // Set file-specific headers
      res.setHeader('Content-Type', fileConfig.contentType);
      res.setHeader(
        'Content-Disposition',
        `${fileConfig.disposition}; filename="${fileConfig.filename}"`,
      );
      res.setHeader('Content-Length', response.data.length);

      // Send the file buffer directly
      res.end(response.data);
    } catch (error) {
      this.middlewareLogger.error(`${fileType} request error:`, error);

      if (error.response) {
        res.status(error.response.status);

        // If the error response is also a file, handle it
        const errorFileConfig = this.getFileTypeConfig(fileType);
        if (
          error.response.headers['content-type']?.includes(
            errorFileConfig.contentType.split('/')[0],
          )
        ) {
          res.setHeader('Content-Type', errorFileConfig.contentType);
          res.setHeader(
            'Content-Disposition',
            `${errorFileConfig.disposition}; filename="error-${errorFileConfig.filename}"`,
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

  private getFileTypeConfig(fileType: string) {
    const configs = this.configService.get<string>('FILE_TYPE_CONFIG') || '';
    const configMap = this.parseFileTypeConfig(configs);

    return (
      configMap[fileType] || {
        contentType: 'application/octet-stream',
        disposition: 'attachment',
        filename: `${fileType}.bin`,
      }
    );
  }

  private parseFileTypeConfig(configString: string) {
    const configs = {};
    if (!configString.trim()) return configs;

    configString.split(',').forEach((config) => {
      const parts = config.split(':');
      if (parts.length >= 3) {
        const [type, contentType, disposition] = parts;
        configs[type.trim()] = {
          contentType: contentType.trim(),
          disposition: disposition.trim(),
          filename: `${type.trim()}.${this.getFileExtension(contentType.trim())}`,
        };
      }
    });
    return configs;
  }

  private getFileExtension(contentType: string): string {
    const extensionMap = {
      'application/pdf': 'pdf',
    };

    return extensionMap[contentType] || 'bin';
  }

  // Handle file requests that also accept multipart data (file uploads that return files)
  async handleFileRequestWithMultipart(
    method: string,
    url: string,
    formData: any,
    oheaders: any,
    res: Response,
    fileType: string,
  ) {
    try {
      let response;
      const headers = {
        ...formData.getHeaders(),
        ...(oheaders.authorization
          ? { Authorization: oheaders.authorization }
          : {}),
      };
      if (oheaders?.tenantid) headers.tenantid = oheaders.tenantid;
      if (oheaders?.academicyearid)
        headers.academicyearid = oheaders.academicyearid;
      if (oheaders?.organisationid)
        headers.organisationid = oheaders.organisationid;
      if (oheaders['x-channel-id'])
        headers['x-channel-id'] = oheaders['x-channel-id'];

      response = await axios({
        method: method.toLowerCase(),
        url,
        data: formData,
        headers,
        responseType: 'arraybuffer', // Handle binary responses
      });

      res.status(response.status);

      // Get file type configuration
      const fileConfig = this.getFileTypeConfig(fileType);

      // Set file-specific headers
      res.setHeader('Content-Type', fileConfig.contentType);
      res.setHeader(
        'Content-Disposition',
        `${fileConfig.disposition}; filename="${fileConfig.filename}"`,
      );
      res.setHeader('Content-Length', response.data.length);

      // Send the file buffer directly
      res.end(response.data);
    } catch (error) {
      this.middlewareLogger.error(
        `${fileType} multipart request error:`,
        error,
      );

      if (error.response) {
        res.status(error.response.status);

        // If the error response is also a file, handle it
        const errorFileConfig = this.getFileTypeConfig(fileType);
        if (
          error.response.headers['content-type']?.includes(
            errorFileConfig.contentType.split('/')[0],
          )
        ) {
          res.setHeader('Content-Type', errorFileConfig.contentType);
          res.setHeader(
            'Content-Disposition',
            `${errorFileConfig.disposition}; filename="error-${errorFileConfig.filename}"`,
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

  // Keep the old method for backward compatibility
  async handlePDFRequest(
    method: string,
    url: string,
    body: Object,
    oheaders: any,
    res: Response,
  ) {
    return this.handleFileRequest(method, url, body, oheaders, res, 'pdf');
  }
}
