import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../users/schemas/user.schema';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginUserDto, req: Request) {
    const user = await this.userModel.findOne({
      phone: loginUserDto.phone,
    });
    if (!user) {
      throw new BadRequestException('username or password is incorrect');
    }
    const isMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isMatched) {
      throw new BadRequestException('username or password is incorrect');
    }
    if (!user.status) {
      throw new ForbiddenException(
        'Sorry! Currently you are not active please contact to administration',
      );
    }
    const tokens = await this.generateToken(user._id.toString(), req);

    user.token = bcrypt.hashSync(tokens.refresh_token, 7);
    await user.save();
    return {
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        image: user.image,
      },
      tokens,
    };
  }

  private async generateToken(id: string, req: Request) {
    const payload = {
      id,
      agent: bcrypt.hashSync(req.headers['user-agent'], 7),
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_KEY,
      expiresIn: process.env.ACCESS_TIME,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_KEY,
      expiresIn: process.env.REFRESH_TIME,
    });
    return { access_token, refresh_token };
  }

  async logout(req: Request) {
    const user = req['user'];
    const token = req['token'];
    if (!user) {
      throw new ForbiddenException('User is not found');
    }
    if (bcrypt.compareSync(token, user?.token)) {
      throw new UnauthorizedException('Invalid token');
    }
    user.token = '';
    await user.save();
    return { message: 'Logged out success' };
  }
}
