import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { uploadFile } from '../utils/file-upload';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class DirectorService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async activateAdmin(id: string) {
    const user = await this.userModel.findById(id).select('-password -token');
    if (!user) throw new BadRequestException('Staff is not found');

    user.status = !user.status;
    await user.save();
    return { user };
  }

  async findAllStaffs(page: number, limit: number) {
    let page1: number;
    let limit1: number;
    page1 = +page > 0 ? +page : 1;
    limit1 = +limit > 0 ? +limit : null;

    const staffs = await this.userModel
      .find({
        role: { $not: { $in: ['student', 'director'] } },
      })
      .skip((page1 - 1) * limit1)
      .limit(limit1);

    return { staffs };
  }
}
