import { Module } from '@nestjs/common';
import { EventMiddlewareService } from './event.service';
import { EventController } from './event.controller';
import { HttpModule } from '@nestjs/axios';
import { EventService } from 'src/services/event/event.service';
import { JwtStrategy } from 'src/common/middleware/jwt.strategy';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [HttpModule],
  providers: [EventMiddlewareService, EventService, JwtStrategy, ConfigService],
  controllers: [EventController]
})
export class EventModule { }
