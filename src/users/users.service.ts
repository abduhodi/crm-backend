import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { uploadFile } from '../utils/file-upload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createTeacher(
    createUserDto: CreateUserDto,
    image: Express.Multer.File,
  ) {
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');
    const filename = await uploadFile(image);
    return this.userModel.create({
      ...createUserDto,
      role: 'teacher',
      image: filename,
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
  }

  async createStudent(
    createUserDto: CreateUserDto,
    image: Express.Multer.File,
  ) {
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');
    const filename = await uploadFile(image);
    return this.userModel.create({
      ...createUserDto,
      role: 'student',
      image: filename,
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
  }

  async createAdmin(createUserDto: CreateUserDto, image: Express.Multer.File) {
    const user = await this.userModel.findOne({ phone: createUserDto.phone });
    if (user)
      throw new BadRequestException('Phone number is already registered');

    const filename = await uploadFile(image);

    return this.userModel.create({
      ...createUserDto,
      role: 'admin',
      image: filename,
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
  }

  async findAllStudents() {
    const users = await this.userModel.find({ role: 'student' });
    if (!users.length) {
      throw new NotFoundException('Students are not found');
    }
    return { students: users };
  }

  async findAllAdmins() {
    const users = await this.userModel.find({ role: 'admin' });
    if (!users.length) {
      throw new NotFoundException('Admins are not found');
    }
    return { students: users };
  }

  async findAllTeachers() {
    const users = await this.userModel.find({ role: 'teacher' });
    if (!users.length) {
      throw new NotFoundException('Teachers are not found');
    }
    return { students: users };
  }

  async findOneAdmin(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'admin' });
    if (!user) {
      throw new NotFoundException('Admin is not found');
    }
    return { admin: user };
  }

  async findOneStudent(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'student' });
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return { student: user };
  }

  async findOneTeacher(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findOne({ id, role: 'teacher' });
    if (!user) {
      throw new NotFoundException('Teacher is not found');
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User is not found');
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
