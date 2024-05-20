import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './common/database.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareServices } from './common/middleware/middleware.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesMapping } from './common/entities/UserRoleMapping.entity';
import { PermissionsService } from './common/service/permissions.service';
import { GatewayService } from './middleware/gateway.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserRolesMapping]),
    HttpModule,
    DatabaseModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MiddlewareServices,
    JwtStrategy,
    PermissionsService,
    GatewayService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareServices)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
