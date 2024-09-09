import { CacheModule } from '@nestjs/cache-manager';
import { MemoryStore } from 'cache-manager-memory-store';
import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { UserTenantMapping } from './common/entities/UserTenantMapping.entity'
import { PermissionsService } from './common/service/permissions.service';
import { GatewayService } from './middleware/gateway.service';
import { MiddlewareLoggerModule } from './common/loggers/logger.module';
import { DataValidationService } from './common/service/dataValidation.service';
import { CohortMembers } from './common/entities/CohortMembers.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, store: MemoryStore }),
    TypeOrmModule.forFeature([UserRolesMapping,UserTenantMapping,CohortMembers]),
    HttpModule,
    DatabaseModule,
    JwtModule,
    MiddlewareLoggerModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MiddlewareServices,
    JwtStrategy,
    PermissionsService,
    GatewayService,
    DataValidationService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareServices)
      .forRoutes('*');
  }
}
