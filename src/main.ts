import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  dotenv.config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOptions = {
    // origin: configService.get<string>('CORS_ORIGIN'),
    // methods: configService.get<string>('CORS_METHODS') || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: configService.get<string>('CORS_ALLOWED_HEADERS') || 'Content-Type, Accept',
    // credentials: configService.get<boolean>('CORS_CREDENTIALS') || true,
  };
  
  app.enableCors(corsOptions);
  app.use(helmet());
  app.use(helmet.hidePoweredBy());
  const config = new DocumentBuilder()
    .setTitle('Middleware  APIs')
    .setDescription('The Middlware service')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger-docs', app, document);
  await app.listen(4000, () => {
    console.log(`Server middleware on port - 4000`);
  });
}
bootstrap();
