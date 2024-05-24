import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MiddlewareLogger } from '../loggers/logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  jwt_expires_In: any;
  jwt_secret: any;
  constructor(
    private configService: ConfigService,
    private permissionService: PermissionsService,
    private readonly middlewareLogger: MiddlewareLogger,
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
    let userPrivileges;
    const ttl = this.configService.get('TTL');
    try {
      const tenantId = request.headers['tenant-id'];
      if (!tenantId?.trim()) {
        throw new BadRequestException('Tenant id not found');
      }
      const requiredPermissions = request.requiredPermissions;

      const cachedData = await this.cacheService.get(payload.sub);

      if (!cachedData) {
        userPrivileges = await this.permissionService.getUserPrivileges(
          payload.sub,
        );
        await this.cacheService.set(payload.sub, userPrivileges, ttl);
      } else {
        userPrivileges = cachedData;
      }

      const privilegeOfTenant = userPrivileges[tenantId];
      if (!privilegeOfTenant) {
        throw new UnauthorizedException('Invalid Tenant or User');
      }
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
      if (isAuthorized) {
        request.user = payload; // Attach payload to request object
        this.middlewareLogger.log(
          `user : ${payload.sub - payload.username} userPrivileges: ${userPrivileges}`,
        );
        return userData;
      }
      throw new UnauthorizedException();
    } catch (e) {
      this.middlewareLogger.error(
        `user : ${payload.sub - payload.username} userPrivileges: ${userPrivileges}`,
        JSON.stringify(e),
      );
      throw e;
    }
  }
}
