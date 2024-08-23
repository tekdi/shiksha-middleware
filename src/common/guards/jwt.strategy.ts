import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MiddlewareLogger } from '../loggers/logger.service';
import { UserPrivilegeRoleDto } from '../service/dto/user-privileges';

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
      const tenantId = request.headers['tenantid'];
      if (!tenantId?.trim()) {
        throw new BadRequestException('Tenant id not found');
      }
      request.userId = payload.sub;
      const requiredPermissions = request.requiredPermissions;

      const cachedData : UserPrivilegeRoleDto = await this.cacheService.get(payload.sub);
      if (!cachedData) {
        const userPrivilegesAndRoles = await this.permissionService.getUserPrivilegesAndRoles(
          payload.sub,
        );
        userPrivileges = userPrivilegesAndRoles['privileges'][tenantId];
        this.cacheService.set(payload.sub, userPrivilegesAndRoles, ttl);
      } else {
        userPrivileges = cachedData.privileges[tenantId];
      }
      if (!userPrivileges) {
        throw new UnauthorizedException('User does not have any privileges in the Tenant');
      }
      this.middlewareLogger.log(
        `user : ${payload.sub - payload.username} userPrivileges: ${userPrivileges}`,
      );
      return true;
    } catch (e) {    
      console.log('strategy', e)  
      this.middlewareLogger.error(
        `user : ${payload.sub - payload.username} userPrivileges: ${userPrivileges}`,
        JSON.stringify(e),
      );
    }
  }
}
