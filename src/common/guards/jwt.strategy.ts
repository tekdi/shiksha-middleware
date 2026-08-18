import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';
import { MiddlewareLogger } from '../loggers/logger.service';
import { UserPrivilegeRoleDto } from '../service/dto/user-privileges';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  jwt_expires_In: any;
  jwt_secret: any;
  constructor(
    configService: ConfigService,
    private permissionService: PermissionsService,
    private readonly middlewareLogger: MiddlewareLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    const tenantId = request.headers['tenantid'];
    if (!tenantId?.trim()) {
      throw new BadRequestException('Tenant id not found');
    }
    request.userId = payload.sub;

    // Uses the shared tenant-scoped loader, so this call warms exactly the
    // cache entry that PRIVILEGE_CHECK / ROLE_CHECK will read later in the
    // same request.
    const cachedData = await this.permissionService.getCachedPrivilegesAndRoles(
      payload.sub,
      tenantId,
    );
    if (cachedData instanceof UnauthorizedException) {
      throw cachedData;
    }

    const userPrivileges: string[] =
      (cachedData as UserPrivilegeRoleDto).privileges?.[tenantId] ?? [];

    // Most routes are still ROLE_CHECK-only, so a user holding roles and no
    // privilege rows is legitimate today; kept non-fatal until PRIVILEGE_CHECK
    // is enforcing everywhere.
    if (userPrivileges.length === 0) {
      this.middlewareLogger.warn(
        `user ${payload.sub} has roles but no privileges in tenant ${tenantId}`,
      );
    }

    this.middlewareLogger.log(
      `user: ${payload.sub} username: ${payload.username} userPrivileges: ${userPrivileges}`,
    );
    return true;
  }
}
