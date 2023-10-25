import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { uploadFile } from '../utils/file-upload';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async uploadImage(image: any) {
    try {
      const filename = await uploadFile(image);
      return { image: filename };
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

  //----------------------- GET PROFILE INFO -----------------------------//

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

  //----------------------- CHANGE PASSWORD -----------------------------//

  async changePassword(req: any, changePasswordDto: ChangePasswordDto) {
    const { old_password, new_password, confirm_password } = changePasswordDto;
    if (new_password !== confirm_password) {
      throw new BadRequestException("Confiem password didn't match");
    }
    const id = req?.user?.id;
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User is not found');
    }
    const isMatch = bcrypt.compareSync(old_password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Password didn't match");
    }
    const hashedPassword = bcrypt.hashSync(new_password, 7);
    const update = await this.userModel.updateOne(
      { _id: id },
      { password: hashedPassword },
    );
    return { update: update.modifiedCount ? 'success' : 'failed' };
  }

  //----------------------- UPDATE USER -----------------------------//

  async updateProfile(req: any, updateUserDto: UpdateProfileDto) {
    Object.defineProperties(updateUserDto, {
      _id: { enumerable: false },
      token: { enumerable: false },
      password: { enumerable: false },
      role: { enumerable: false },
      start_date: { enumerable: false },
      status: { enumerable: false },
    });
    const id = req?.user?.id;
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User is not found');
    }
    const exist = await this.userModel.findOne({ phone: updateUserDto?.phone });
    if (exist && user?.id !== exist?.id) {
      throw new BadRequestException('Phone number is already registered');
    }
    await user.updateOne(updateUserDto);
    const updatedUser = await this.userModel
      .findById(id)
      .select('-password -token');
    return { updated: updatedUser };
  }
}
