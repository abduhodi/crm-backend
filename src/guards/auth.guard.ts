import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token is not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_KEY,
      });
      const user = await this.userService.findOne(payload?.id);
      if (!user || !user.token || !user.status) {
        throw new UnauthorizedException('Forbidden action');
      }
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}