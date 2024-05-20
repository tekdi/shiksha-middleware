import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  jwt_expires_In: any;
  jwt_secret: any;
  constructor(
    private configService: ConfigService,
    private permissionService: PermissionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    const tenantId = request.headers['tenant-id'];

    if (!tenantId.trim()) {
      throw new UnauthorizedException();
    }

    const requiredPermissions = request.requiredPermissions;
    const userPrivileges = await this.permissionService.getUserPrivileges(
      payload.sub,
    );

    // console.log(
    //   requiredPermissions,
    //   'requiredPermissions',
    //   userPrivileges,
    //   'userPrivileges',
    // );

    const privilegeOfTenant = userPrivileges[tenantId];
    // console.log(privilegeOfTenant, 'privilegeOfTenant');
    const userData = {
      userId: payload.sub,
      username: payload.preferred_username,
      name: payload.name,
      userPrivileges,
    };

    // get tenantid
    const isAuthorized = requiredPermissions.every((permission: string) =>
      privilegeOfTenant.includes(permission),
    );

    // console.log(isAuthorized, 'isauth');

    if (isAuthorized) {
      request.user = payload; // Attach payload to request object

      return userData;
    }
    throw new UnauthorizedException();
  }
}
