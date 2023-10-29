import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import {
  GroupStudent,
  GroupStudentsDocument,
} from '../group_students/schemas/group_student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(GroupStudent.name)
    private readonly groupStudentModel: Model<GroupStudentsDocument>,
  ) {}

  //----------------------- ADD NEW STUDENT -----------------------------//

  async createStudent(createUserDto: CreateUserDto) {
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

    const newUser = await this.userModel.create({
      ...createUserDto,
      role: 'student',
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
    return {
      message: 'Success',
      user: { ...newUser, password: null, token: null },
    };
  }

  //----------------------- GET ALL STUDENTS -----------------------------//

  async findAllStudents(page: number, limit: number) {
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
      throw new BadRequestException('Invalid Student id');
    }
    const user = await this.userModel
      .findOne({ _id: id, role: 'student' })
      .select('-password -token');

    return { student: user };
  }

  //----------------------- GET SINGLE STUDENT ALL GROUPS -----------------------------//

  async findOneStudentGroups(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid Student id');
    }
    const groups = await this.groupStudentModel
      .find({ student: id })
      .populate({
        path: 'group',
        populate: {
          path: 'course room',
          select: 'name',
        },
      })
      .select('group status');

    return { groups };
  }

  //----------------------- FIND STUDENT BY PHONE -----------------------------//

  async findOneStudentByPhone(phone: string) {
    const user = await this.userModel
      .findOne({ phone, role: 'student' })
      .select('-password -token');

    return { student: user };
  }

  //----------------------- SEARCH STUDENT BY PHONE -----------------------------//

  async searchStudentByPhone(phone: string) {
    try {
      const regex = new RegExp(phone + '$');
      const user = await this.userModel
        .find({ phone: { $regex: regex }, role: 'student' })
        .select('-password -token')
        .exec();
      return { student: user };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad operation');
    }
  }

  //----------------------- UPDATE STUDENT -----------------------------//

  async updateStudent(id: string, updateUserDto: UpdateUserDto) {
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
      throw new BadRequestException('Invalid Student id');
    }
    const user = await this.userModel.findOne({ _id: id, role: 'student' });
    if (!user) {
      throw new BadRequestException('Student is not found');
    }
    const exist = await this.userModel.findOne({ phone: updateUserDto.phone });
    if (exist && user?.id !== exist?.id) {
      throw new BadRequestException('Phone number is already registered');
    }
    await user.updateOne(updateUserDto);
    const updatedUser = await this.userModel
      .findById(id)
      .select('-password -token');
    return { updated_student: updatedUser };
  }

  //----------------------- DELETE STUDENT -----------------------------//

  async deleteStudent(id: string) {
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BadRequestException('Invalid Student id');
    }
    const user = await this.userModel.findOne({ _id: id, role: 'student' });
    if (!user) {
      throw new BadRequestException('Student is not found');
    }
    await user.deleteOne();
    return { message: 'deleted successfully' };
  }
}
