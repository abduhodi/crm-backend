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
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
    return {
      message: 'Success',
      user: {
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        payment_status: '',
      },
    };
  }
  //----------------------- GET ALL STUDENTS -----------------------------//

  async findAllStudents(page: number, limit: number, res: Response) {
    try {
      let limit_1: number;
      let page_1: number;
      page_1 = +page > 1 ? +page : 1;
      limit_1 = +limit > 0 ? +limit : null;

      const users = await this.userModel
        .find({ role: 'student' })
        .skip((page_1 - 1) * limit_1)
        .limit(limit_1)
        .select('-password -token');
      const count = await this.userModel.count({ role: 'student' });
      return { students: users, count };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad request from client');
    }
  }

  //----------------------- GET SINGLE STUDENT -----------------------------//

  async findOneStudent(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel
      .findOne({ _id: id, role: 'student' })
      .select('-password -token');

    // if (!user) {
    //   throw new NotFoundException('User is not found');
    // }
    return { student: user };
  }

  async findOneStudentByPhone(phone: string) {
    const user = await this.userModel
      .findOne({ phone, role: 'student' })
      .select('-password -token');

    // if (!user) {
    //   throw new NotFoundException('User is not found');
    // }
    return { student: user };
  }

  //----------------------- UPDATE USER -----------------------------//

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    Object.defineProperties(updateUserDto, {
      _id: { enumerable: false },
      token: { enumerable: false },
      password: { enumerable: false },
      role: { enumerable: false },
      start_date: { enumerable: false },
      status: { enumerable: false },
      id: { enumerable: false },
    });
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User is not found');
    }
    const exist = await this.userModel.findOne({ phone: updateUserDto.phone });
    if (exist && user?.id !== exist?.id) {
      throw new BadRequestException('Phone number is already registered');
    }
    await user.updateOne(updateUserDto);
    const updatedUser = await this.userModel
      .findById(id)
      .select('-password -token');
    return { updated_user: updatedUser };
  }

  //----------------------- DELETE USER -----------------------------//

  async deleteUser(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException(
        'User is not found by given id',
        HttpStatus.NO_CONTENT,
      );
    }
    await user.deleteOne();
    return { message: 'deleted successfully' };
  }

  //----------------------- GET ALL TEACHERS -----------------------------//

  async findAllTeachers(page: number, limit: number, res: Response) {
    try {
      let limit_1: number;
      let page_1: number;
      page_1 = +page > 1 ? +page : 1;
      limit_1 = +limit > 0 ? +limit : null;

      const users = await this.userModel
        .find({ role: 'teacher' })
        .skip((page_1 - 1) * limit_1)
        .limit(limit_1)
        .select('-password -token');
      const count = await this.userModel.count({ role: 'teacher' });
      return { teachers: users, count };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad request from client');
    }
  }

  //----------------------- GET TEACHER BY ID -----------------------------//

  async findOneTeacher(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel
      .findOne({ _id: id, role: 'teacher' })
      .select('-password -token');
    if (!user) {
      throw new HttpException('Teacher is not found', HttpStatus.NO_CONTENT);
    }
    return { teacher: user };
  }

  //----------------------- GET ADMIN BY ID (self profile) -----------------------------//

  async findOneAdmin(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel
      .findOne({ _id: id, role: 'admin' })
      .select('-password -token');
    if (!user) {
      throw new HttpException('Admin is not found', HttpStatus.NO_CONTENT);
    }
    return { admin: user };
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
}
