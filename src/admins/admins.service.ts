import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { uploadFile } from '../utils/file-upload';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Response } from 'express';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //----------------------- ADD NEW STUDENT -----------------------------//

  async createStudent(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');

    // const lastId: number[] = await this.userModel
    //   .aggregate()
    //   .group({ _id: null, last: { $max: '$id' } })
    //   .project(['-_id last'])
    //   .exec();

    // console.log(lastId);
    // if (!lastId.length) {
    //   lastId[0] = 1;
    // }

    const newUser = await this.userModel.create({
      // id: lastId[0] + 1,
      ...createUserDto,
      role: 'student',
      image: '',
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
    return {
      message: 'Success',
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        payment_status: '',
      },
    };
  }

  async findAllStudents(page: number, limit: number, res: Response) {
    try {
      let limit_1: number;
      let page_1: number;
      page_1 = +page > 1 ? +page : 1;
      limit_1 = +limit > 0 ? +limit : 10;
      console.log(page_1);
      console.log(limit_1);
      const users = await this.userModel
        .find({ role: 'student' })
        .skip((page_1 - 1) * limit_1)
        .limit(limit_1);
      if (!users.length) {
        res.status(HttpStatus.NO_CONTENT);
      }
      const count = await this.userModel.count({ role: 'student' });
      return { students: users, count };
    } catch (error) {
      throw new BadRequestException('Bad request from client');
    }
  }

  async findAllTeachers() {
    const users = await this.userModel.find({ role: 'teacher' });
    return { students: users, count: users.length };
  }

  async findOneAdmin(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'admin' });
    if (!user) {
      throw new HttpException('Admin is not found', HttpStatus.NO_CONTENT);
    }
    return { admin: user };
  }

  async findOneStudent(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'student' });
    // if (!user) {
    //   throw new NotFoundException('User is not found');
    // }
    return { student: user };
  }

  async findOneTeacher(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'teacher' });
    if (!user) {
      throw new HttpException('Teacher is not found', HttpStatus.NO_CONTENT);
    }
    return { teacher: user };
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

  async updateStudent(id: string, updateUserDto: UpdateUserDto) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('Student is not found');
    }
    await user.updateOne(updateUserDto);
    const updatedUser = await this.userModel.findById(id);
    return { updated_user: updatedUser };
  }

  async remove(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    await user.deleteOne();
    return { message: 'deleted successfully' };
  }
}
