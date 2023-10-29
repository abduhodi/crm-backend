import { BadRequestException, Injectable } from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { uploadFile } from '../utils/file-upload';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  //----------------------- UPLOAD VIDEO -----------------------------//

  async uploadVideo(video: any) {
    try {
      const filename = await uploadFile(video);
      return { video: filename };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //----------------------- CREATE TEACHER -----------------------------//

  async createTeacher(createUserDto: CreateUserDto) {
    Object.defineProperties(createUserDto, {
      _id: { enumerable: false },
      token: { enumerable: false },
      password: { enumerable: false },
      role: { enumerable: false },
      start_date: { enumerable: false },
      status: { enumerable: false },
      id: { enumerable: false },
    });
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');
    const teacher = await this.userModel.create({
      ...createUserDto,
      role: 'teacher',
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
    return { teacher: { ...teacher, password: null, token: null } };
  }

  //----------------------- GET ALL TEACHERS -----------------------------//

  async findAllTeachers(page: number, limit: number) {
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
      throw new BadRequestException('Invalid Teacher id');
    }
    const user = await this.userModel
      .findOne({ _id: id, role: 'teacher' })
      .select('-password -token');
    return { teacher: user };
  }

  //----------------------- GET TEACHER BY PHONE -----------------------------//

  async findTeacherByPhone(phone: string) {
    const user = await this.userModel
      .findOne({ phone, role: 'teacher' })
      .select('-password -token');
    return { teacher: user };
  }

  //----------------------- SEARCH TEACHER BY PHONE -----------------------------//

  async searchTeacherByPhone(phone: string) {
    try {
      const regex = new RegExp(phone + '$');
      const user = await this.userModel
        .find({ phone: { $regex: regex }, role: 'teacher' })
        .select('-password -token')
        .exec();
      return { teacher: user };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad operation');
    }
  }

  //----------------------- UPDATE TEACHER BY ID -----------------------------//

  async updateTeacher(id: string, updateUserDto: UpdateUserDto) {
    Object.defineProperties(updateUserDto, {
      _id: { enumerable: false },
      token: { enumerable: false },
      password: { enumerable: false },
      role: { enumerable: false },
      start_date: { enumerable: false },
      status: { enumerable: false },
      id: { enumerable: false },
    });
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid Teacher id');
    }
    const teacher = await this.userModel.findOne({ _id: id, role: 'teacher' });
    if (!teacher) {
      throw new BadRequestException('Teacher is not exists');
    }
    const exist = await this.userModel.findOne({
      phone: updateUserDto.phone,
    });
    if (exist && exist.id !== teacher.id) {
      throw new BadRequestException('Phone number is already registered');
    }
    await this.userModel.updateOne({ _id: id }, updateUserDto);
    const updated = await this.userModel.findById(id);
    return { updated };
  }

  //----------------------- DELETE TEACHER BY ID -----------------------------//

  async removeTeacher(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid Teacher id');
    }
    const teacher = await this.userModel.findOne({ _id: id, role: 'teacher' });
    if (!teacher) {
      throw new BadRequestException('Teacher is not exists');
    }
    await teacher.deleteOne();
    return { message: 'deleted successfully' };
  }
}
