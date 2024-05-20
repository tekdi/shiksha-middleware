import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRolesMapping } from '../entities/UserRoleMapping.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserRolesMapping)
    private readonly userRolesMapping: Repository<UserRolesMapping>,
  ) {}

  async getUserPrivileges(userId: string) {
    const query = `SELECT "UserRolesMapping"."userId", "UserRolesMapping"."roleId", "UserRolesMapping"."tenantId" AS tenant_id,
        "RolePrivilegesMapping"."privilegeId", 
        "Privileges"."name" AS privilege_name, "Privileges"."code" AS privilege_code,
        "Roles"."code" AS Role_code, "Roles"."name" AS Role_name
      FROM "UserRolesMapping"
      LEFT JOIN "RolePrivilegesMapping" ON "RolePrivilegesMapping"."roleId"="UserRolesMapping"."roleId"
      LEFT JOIN "Privileges" ON "Privileges"."privilegeId" = "RolePrivilegesMapping"."privilegeId"
      LEFT JOIN "Roles" ON "Roles"."roleId" = "UserRolesMapping"."roleId"
      WHERE "UserRolesMapping"."userId" = $1`;
    const result = await this.userRolesMapping.query(query, [userId]);

    // If role is 'admin' then add 'all' to privilege
    const privilegesPerTenant = result.reduce(
      (acc, { privilege_code, role_code, tenant_id }) => {
        if (role_code === 'admin') {
          acc[tenant_id] = ['all'];
        } else if (acc[tenant_id]) {
          acc[tenant_id].push(privilege_code);
        } else {
          acc[tenant_id] = [privilege_code];
        }
        return acc;
      },
      {},
    );

    privilegesPerTenant['userId'] = userId;
    return privilegesPerTenant;
  }
}
