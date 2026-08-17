import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      const req = context.switchToHttp().getRequest();
      this.logger.error(
        `[JwtAuthGuard] Auth failed for ${req.method} ${req.originalUrl} - err=${err?.message ?? err} info=${info?.name ?? ''}:${info?.message ?? info}`,
      );
    }
    return super.handleRequest(err, user, info, context);
  }
}
