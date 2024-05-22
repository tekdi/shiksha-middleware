import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status =
            HttpStatus.INTERNAL_SERVER_ERROR;

        let responseBody: any = {
            statusCode: status,
            message: 'Internal server error',
        };

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            responseBody = {
                statusCode: status,
                ...(typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse),
            };
        } else if (exception && typeof (exception as any).response === 'object') {
            const exceptionResponse = (exception as any).response.data || {};
            responseBody = {
                statusCode: (exception as any).response.status || HttpStatus.INTERNAL_SERVER_ERROR,
                ...exceptionResponse,
            };
        }
        response.status(responseBody.statusCode).json(responseBody);
    }
}
