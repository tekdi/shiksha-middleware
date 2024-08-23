import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError } from 'typeorm';
import APIResponse from "src/common/response/response";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = (exception as any).message.message;
        let code = 'HttpException';
        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                break;
            case UnauthorizedException:
                status = (exception as HttpException).getStatus();
                message = (exception as UnauthorizedException).message;
                code = (exception as any).code;
                break;
            case QueryFailedError:  // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                code = (exception as any).code;
                break;
            case EntityNotFoundError:  // this is another TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message;
                code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message;
                code = (exception as any).code;
                break;
            default:
                console.log('defaulr');
                status = (exception as any).response.status || HttpStatus.INTERNAL_SERVER_ERROR;
                code = (exception as any).code;
                message = (exception as any).message;
        }
       console.log('api.middleware', code, message, status);
        return APIResponse.error(response, 'api.middleware', code, message, status);

        /*if (exception instanceof HttpException) {
            console.log('HttpException')
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            responseBody = {
                statusCode: status,
                ...(typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse),
            };
        } else if (exception && typeof (exception as any).response === 'object') {
            console.log('object')

            const exceptionResponse = (exception as any).response.data || {};
            responseBody = {
                statusCode: (exception as any).response.status || HttpStatus.INTERNAL_SERVER_ERROR,
                ...exceptionResponse,
            };
        }
        response.status(responseBody.statusCode).json(responseBody);*/
    }
}
