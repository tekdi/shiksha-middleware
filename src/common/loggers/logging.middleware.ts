import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Log request details
    const { method, originalUrl, body, query } = req;
    console.log(`[Request] ${method} ${originalUrl}`);
    console.log('Request Body:', body);
    console.log('Request Query:', query);

    // Listen for the response and log it after the response is sent
    res.on('finish', () => {
      const { method, originalUrl } = req;
      console.log(`[Response] ${method} ${originalUrl}`);
      console.log('Response Status:', res.statusCode);
      console.log('Response Body:', res.locals.responseBody); // If you want to log the response body, you will need to capture it (next step).
    });

    // Proceed to the next middleware or route handler
    next();
  }
}
