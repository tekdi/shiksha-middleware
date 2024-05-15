import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    const requiredPermissions = request.requiredPermissions;
    const query = `SELECT "UserRolesMapping"."userId","UserRolesMapping"."roleId","UserRolesMapping"."tenantId",
    "RolePrivilegesMapping"."privilegeId", 
    "Privileges"."name" AS p_name,"Privileges"."code" AS p_code,
    "Roles"."code" As Role_code ,"Roles"."name" As Role_name
    FROM "UserRolesMapping"
    LEFT JOIN "RolePrivilegesMapping" ON "RolePrivilegesMapping"."roleId"="UserRolesMapping"."roleId"
      LEFT JOIN "Privileges" ON "Privileges"."privilegeId" = "RolePrivilegesMapping"."privilegeId"
    LEFT JOIN "Roles" ON "Roles"."roleId" = "UserRolesMapping"."roleId"
    where "userId"='38cb0c7e-0d4b-47ba-a379-1a60251ddad3' 
    AND "Roles"."tenantId"='ef99949b-7f3a-4a5f-806a-e67e683e38f3'`

    const userPermissions = ['event.create', 'event.read', 'event.delete', 'event.update']
    // const roles = payload.userData.roles;
    // if (roles.includes("admin")) {
    //   return payload;
    // }

    const isAuthorized = requiredPermissions.every((permission: string) =>
      userPermissions.includes(permission)
    );

    if (isAuthorized) {
      return payload;
    }

    throw new UnauthorizedException();
    // return {
    //   userId: payload.sub,
    //   name: payload.name,
    //   username: payload.preferred_username,
    // };
  }
}
