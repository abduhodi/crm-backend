import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // ----------------------------------LOGIN-----------------------------////////
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully login',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    return this.authService.login(loginUserDto, req);
  }

  // ----------------------------------LOGOUT-----------------------------////////
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully logout',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is invalid or not found',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return this.authService.logout(req);
  }
}
