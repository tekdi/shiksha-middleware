import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareLogger } from './logger.service';

@Injectable()
export class LoggingMiddleware {
  constructor(private loggerService: MiddlewareLogger) {}
  use(req: Request, res: Response, next: NextFunction): void {
    // Log request details
    const { method, originalUrl, body, query } = req;
    this.loggerService.log(`[Request] ${method} ${originalUrl}`);
    this.loggerService.log('Request Body: ' + JSON.stringify(body));
    +this.loggerService.log('Request Query:' + JSON.stringify(query || {}));

    // Listen for the response and log it after the response is sent
    res.on('finish', () => {
      const { method, originalUrl } = req;
      this.loggerService.log(`[Response] ${method} ${originalUrl}`);
      this.loggerService.log(`Response Status:  ${res.statusCode}`);
      this.loggerService.log(`Response Body: ${res.locals.responseBody}`);
    });

    // Proceed to the next middleware or route handler
    next();
  }
}
