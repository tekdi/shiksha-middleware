import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { webhookEndpoints } from './common/middleware/apiConfig';

async function bootstrap() {
  dotenv.config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  
  // Middleware to capture raw body for webhook endpoints before JSON parsing
  app.use((req: any, res, next) => {
    // Check if the request path matches a webhook endpoint exactly or starts with it
    const isWebhookEndpoint = webhookEndpoints.some(endpoint => 
      req.path === endpoint || req.path.startsWith(endpoint + '/')
    );
    
    if (isWebhookEndpoint) {
      // For webhook endpoints, use raw parser to preserve exact body
      bodyParser.raw({ type: 'application/json', limit: '20mb' })(req, res, (err) => {
        if (err) return next(err);
        // Store raw body (Buffer) for forwarding
        req.rawBody = req.body;
        // Also parse JSON for compatibility with existing code
        try {
          req.body = JSON.parse(req.body.toString());
        } catch (e) {
          // If parsing fails, set body to empty object
          req.body = {};
        }
        next();
      });
    } else {
      // For other endpoints, use regular JSON parser with verify to optionally capture raw
      bodyParser.json({ 
        limit: '20mb',
        verify: (req: any, res, buf) => {
          // Optionally store raw body for other endpoints too (not required)
          req.rawBody = buf;
        }
      })(req, res, next);
    }
  });
  
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
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

  await app.listen(configService.get('port') || 4000, () => {});
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
