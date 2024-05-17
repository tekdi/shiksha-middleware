import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRolesMapping } from "src/entities/UserRoleMapping.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  jwt_expires_In: any;
  jwt_secret: any;
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(UserRolesMapping)
    private readonly userRolesMapping: Repository<UserRolesMapping>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
      passReqToCallback: true,
    });
    this.jwt_expires_In = this.configService.get("RBAC_JWT_EXPIRES_IN");
    this.jwt_secret = this.configService.get<string>("RBAC_JWT_SECRET");
  }

  async generateToken(payload) {
    const plainObject = JSON.parse(JSON.stringify(payload));
    const token = await this.jwtService.signAsync(plainObject, {
      secret: this.jwt_secret,
      expiresIn: this.jwt_expires_In,
    });
    return token;
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

    const result = await this.userRolesMapping.query(query);
    const userPermissions = ['event.create', 'event.read', 'event.delete', 'event.update']

    const roles = ['student']
    let userData = {}
    userData["privileges"] = userPermissions
    userData["roles"] = roles;
    userData = {
      ...userData,
      userId: payload.sub,
      username: payload.preferred_username,
      name: payload.name
    }

    const pay = {
      userData
    }

    const generated_token = await this.generateToken(pay);
    console.log(generated_token, "generated_token");
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
