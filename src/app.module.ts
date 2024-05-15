import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [EventModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
