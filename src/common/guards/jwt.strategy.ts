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
    const jwtSecret = configService.get('JWT_SECRET');
    middlewareLogger.log(
      `[JwtStrategy] JWT_SECRET loaded: isDefined=${!!jwtSecret}, length=${jwtSecret?.length ?? 0}, hasLiteralBackslashN=${jwtSecret?.includes('\\n') ?? false}, hasRealNewline=${jwtSecret?.includes('\n') ?? false}`,
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    let userPrivileges;
    this.middlewareLogger.log(
      `user : ${payload.sub - payload.username} userPrivileges: ${userPrivileges}`,
    );
    return true;
  }
}
