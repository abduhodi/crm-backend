import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = request.params.id;
    const hasAccess = user?._id.toString() === id;
    if (!hasAccess) {
      throw new ForbiddenException("You don't have an access");
    }
    return true;
  }
}
