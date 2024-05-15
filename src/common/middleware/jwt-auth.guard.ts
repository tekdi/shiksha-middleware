import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.get<string[]>(
            "permissions",
            context.getHandler()
        );

        const payload = super.getRequest(context);
        if (!requiredPermissions) {
            payload.requiredPermissions = [];
            return super.canActivate(context);

        }
        payload.requiredPermissions = requiredPermissions;
        // const request = context.switchToHttp().getRequest();
        // request.requiredPermissions = requiredPermissions;
        return super.canActivate(context);

    }
}
