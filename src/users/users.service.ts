import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { uploadFile } from '../utils/file-upload';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async uploadImage(image: Express.Multer.File) {
    try {
      const filename = await uploadFile(image);
      return filename;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  async getProfileInfo(req: any) {
    const id = req?.user?.id;
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.userModel.findById(id).select('-password -token');
    if (!user) {
      throw new BadRequestException('User is not found');
    }
    return user;
  }
}
