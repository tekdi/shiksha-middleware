import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/rolePermissionMapping';
import { RolePermissionMappingController } from './role-permission-mapping.controller';
import { RolePermissionService } from './role-permission-mapping.service';
import { MiddlewareLogger } from 'src/common/loggers/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  controllers: [RolePermissionMappingController],
  providers: [RolePermissionService, MiddlewareLogger],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
