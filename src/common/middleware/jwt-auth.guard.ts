// jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization'];
        if (!token) {
            return false;
        }

        // pass sub get from token as user id from get userRole API
        const Role = ['student', 'admin', 'teacher']
        // After get Roles get privilage of role
        const privillage = ['event.create', 'event.read', 'event.delete', 'event.update'];

        const method = request.method;
        const isEventOrAttendeesRoute = this.extractEventKeyword(request.url);
        if (method === 'GET') {
            const privilegeToCheck = `${isEventOrAttendeesRoute}.read`;
            if (privillage.includes(privilegeToCheck)) {
                console.log(`${privilegeToCheck} is present in privillage array`);
                return true;
            } else {
                console.log(`${privilegeToCheck} is not present in privillage array`);
                return false;
            }
        }
        else if (method === 'POST') {
            const privilegeToCheck = `${isEventOrAttendeesRoute}.create`;
            if (privillage.includes(privilegeToCheck)) {
                console.log(`${privilegeToCheck} is present in privillage array`);
                return true;
            } else {
                console.log(`${privilegeToCheck} is not present in privillage array`);
                return false;
            }
        } else if (method === 'PUT') {
            const privilegeToCheck = `${isEventOrAttendeesRoute}.update`;
            if (privillage.includes(privilegeToCheck)) {
                console.log(`${privilegeToCheck} is present in privillage array`);
                return true;
            } else {
                console.log(`${privilegeToCheck} is not present in privillage array`);
                return false;
            }
        } else if (method === 'DELETE') {
            const privilegeToCheck = `${isEventOrAttendeesRoute}.delete`;
            if (privillage.includes(privilegeToCheck)) {
                console.log(`${privilegeToCheck} is present in privillage array`);
                return true;
            } else {
                console.log(`${privilegeToCheck} is not present in privillage array`);
                return false;
            }
        }
        return true;
    }
    public extractEventKeyword(url: string): string | null {
        const urlSegments = url.split('/');
        const keywordIndex = urlSegments.findIndex((segment, index) => index > 0 && segment !== '' && segment !== '/');
        if (keywordIndex !== -1 && keywordIndex < urlSegments.length - 1) {
            return `${urlSegments[keywordIndex]}`;
            // return `/${urlSegments[keywordIndex]}`;
        }
        return null;
    }
}
