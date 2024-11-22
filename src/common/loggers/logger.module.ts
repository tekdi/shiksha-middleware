import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MiddlewareLogger } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { LoggingMiddleware } from './logging.middleware';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({}),
    }),
  ],
  providers: [
    MiddlewareLogger,
    LoggingMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: MiddlewareLogger,
    },
  ],
  exports: [MiddlewareLogger],
})
export class MiddlewareLoggerModule {}
