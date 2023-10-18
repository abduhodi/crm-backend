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

  async createTeacher(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');
    return this.userModel.create({
      ...createUserDto,
      role: 'teacher',
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');

    return this.userModel.create({
      ...createUserDto,
      role: 'admin',
      image: '',
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
  }

  async activateAdmin(id: string) {
    const user = await this.userModel.findById(id).select('-password -token');
    if (!user) throw new BadRequestException('Admin is not found');

    user.status = !user.status;
    await user.save();
    return { user };
  }

  async findAllStudents() {
    const users = await this.userModel.find({ role: 'student' });

    return { students: users };
  }

  async findAllAdmins() {
    const users = await this.userModel.find({ role: 'admin' });

    return { students: users };
  }

  async findAllTeachers() {
    const users = await this.userModel.find({ role: 'teacher' });

    return { students: users };
  }

  async findOneAdmin(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'admin' });

    return { admin: user };
  }

  async findOneStudent(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'student' });

    return { student: user };
  }

  async findOneTeacher(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'teacher' });

    return { teacher: user };
  }
}
