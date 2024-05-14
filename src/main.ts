import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Middleware  APIs')
    .setDescription('The Middlware service')
    .setVersion('1.0')
    .addServer('http://localhost:3001/', 'Local environment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger-docs', app, document);
  await app.listen(3001);
}
bootstrap();
