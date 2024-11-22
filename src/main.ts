import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';

async function bootstrap() {
  dotenv.config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  //app.use(LoggingMiddleware);
  const configService = app.get(ConfigService);

  const corsOriginList = configService
    .get<string>('CORS_ORIGIN_LIST')
    ?.split(',');

  if (!corsOriginList || corsOriginList.length === 0) {
    throw new Error('CORS_ORIGIN_LIST is not defined or empty');
  }

  if (corsOriginList[0] !== '*' && !validateCorsOriginList(corsOriginList)) {
    throw new Error('Invalid CORS_ORIGIN_LIST');
  }

  const corsOptions = {
    origin: (origin, callback) => {
      if (corsOriginList.includes(origin) || corsOriginList[0] === '*') {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Origin not allowed'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  };

  const config = new DocumentBuilder()
    .setTitle('Middleware  APIs')
    .setDescription('The Middleware service')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger-docs', app, document);

  app.enableCors(corsOptions);
  app.use(helmet());

  await app.listen(4000, () => {
    console.log(`Server middleware on port - 4000`);
  });
}

function validateCorsOriginList(corsOriginList: string[]): boolean {
  return corsOriginList.every((origin) => {
    try {
      new URL(origin);
      return true;
    } catch (error) {
      return false;
    }
  });
}

bootstrap();
