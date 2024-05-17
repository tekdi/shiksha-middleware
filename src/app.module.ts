import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './common/database.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareServices } from './common/middleware/middleware.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, DatabaseModule,],
  controllers: [AppController],
  providers: [AppService, MiddlewareServices],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareServices)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
