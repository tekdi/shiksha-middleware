import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiddlewareModule } from './middleware/middleware.module';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [MiddlewareModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
