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
import { RolesService } from '../roles/roles.service';
import { CoursesService } from '../courses/courses.service';
import { CourseTeachersService } from '../course_teachers/course_teachers.service';

@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly roleService: RolesService,
    private readonly courseService: CoursesService,
    private readonly courseTeacherService: CourseTeachersService,
  ) {}

  //----------------------- CREATE Staff -----------------------------//

  async createStaff(createUserDto: CreateUserDto) {
    const { role, course, phone, first_name, last_name, image } = createUserDto;
    const existRole = await this.roleService.fetchSingleRole(role);
    if (!existRole.role) {
      throw new BadRequestException('Role is not found');
    }
    const staff = await this.userModel.findOne({ phone });
    if (staff)
      throw new BadRequestException('Phone number is already registered');
    const newStaff = await this.userModel.create({
      first_name,
      last_name,
      phone,
      image,
      role: existRole.role.name,
      password: bcrypt.hashSync(createUserDto.phone, 7),
    });
    if (course) {
      await this.courseTeacherService.addTeacherToCourse({
        course,
        teacher: staff.id,
      });
    }
    return { staff: { ...newStaff, password: null, token: null } };
  }

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
