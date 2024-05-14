import { Module } from '@nestjs/common';
import { MiddlewareService } from './middleware.service';
import { MiddlewareController } from './middleware.controller';
import { HttpModule } from '@nestjs/axios';
import { EventService } from 'src/services/event/event.service';
import { JwtStrategy } from 'src/common/middleware/jwt.strategy';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [HttpModule],
  providers: [MiddlewareService, EventService, JwtStrategy, ConfigService],
  controllers: [MiddlewareController]
})
export class MiddlewareModule { }
