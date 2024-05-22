import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  jwt_expires_In: any;
  jwt_secret: any;
  constructor(
    private configService: ConfigService,
    private permissionService: PermissionsService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
    const ttl = 60 * 60 * 1000 * 2; // millisec

    const cachedData = await this.cacheService.get(payload.sub);

    console.log(cachedData,"cached")

    let userPrivileges;
    if (!cachedData) {
      userPrivileges = await this.permissionService.getUserPrivileges(
        payload.sub,
      );
      console.log('setting cache');
      await this.cacheService.set(payload.sub, userPrivileges, ttl);
    }

    userPrivileges = cachedData;
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
