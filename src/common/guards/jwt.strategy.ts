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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
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
