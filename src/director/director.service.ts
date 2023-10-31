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
import { FinanceService } from '../finance/finance.service';

@Injectable()
export class DirectorService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly roleService: RolesService,
    private readonly courseService: CoursesService,
    private readonly courseTeacherService: CourseTeachersService,
    private readonly financeService: FinanceService,
  ) {}

  //----------------------- CREATE Staff -----------------------------//

  async createStaff(createUserDto: CreateUserDto) {
    const { role, course, phone, first_name, last_name, image } = createUserDto;
    const existRole = await this.roleService.fetchSingleRole(role);
    if (!existRole.role || existRole?.role?.name === 'director') {
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
    if (existRole?.role?.name === 'teacher') {
      if (course) {
        await this.courseTeacherService.addTeacherToCourse({
          course,
          teacher: newStaff.id,
        });
      }
      await this.financeService.create({
        teacher: newStaff.id,
        salary: createUserDto.salary,
      });
    }
    const staf = JSON.parse(JSON.stringify(newStaff));
    delete staf.password;
    delete staf.token;
    delete staf._id;
    return { staff: staf };
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
      .limit(limit1)
      .select('-token -password');
    const count = await this.userModel
      .find({
        role: { $not: { $in: ['student', 'director'] } },
      })
      .count();

    return { staffs, count };
  }

  async deleteStaff(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Staff id');
    }

    const staff = await this.userModel.findById(id);
    if (!staff) {
      throw new BadRequestException('Staff is not found');
    }

    await staff.deleteOne();

    return { message: 'delete success' };
  }
}
