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
import { createPublicKey } from 'crypto';
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
    const rawJwtSecret = configService.get('JWT_SECRET');
    let jwtSecret = rawJwtSecret;

    try {
      // Step 1: check the key exactly as received from the environment - no modification.
      createPublicKey(rawJwtSecret);
      middlewareLogger.log(
        '[JwtStrategy] JWT_SECRET as received from env parses OK as a public key - it was configured correctly, no fix needed.',
      );
    } catch (rawErr) {
      middlewareLogger.error(
        `[JwtStrategy] JWT_SECRET as received from env FAILED to parse as a public key (length=${rawJwtSecret?.length ?? 0}, hasLiteralBackslashN=${rawJwtSecret?.includes('\\n') ?? false}). Without a fix this silently falls back to being treated as an HMAC secret, which rejects RS256 tokens with "invalid algorithm".`,
        rawErr.message,
      );

      // Step 2: only now attempt the \n normalization fix, and verify it actually works.
      const normalized = rawJwtSecret?.replace(/\\n/g, '\n');
      try {
        createPublicKey(normalized);
        middlewareLogger.log(
          '[JwtStrategy] Normalizing literal \\n to real newlines fixed JWT_SECRET - using the normalized key.',
        );
        jwtSecret = normalized;
      } catch (normalizedErr) {
        middlewareLogger.error(
          '[JwtStrategy] JWT_SECRET still fails to parse even after \\n normalization - the key value itself is wrong/corrupt, not just a newline-escaping issue.',
          normalizedErr.message,
        );
      }
    }

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
