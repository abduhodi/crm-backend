import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schemas/course.schema';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GroupsService } from '../groups/groups.service';
import { Group } from '../groups/schemas/group.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
    @InjectModel(Group.name)
    private groupModel: Model<Group>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const exist = await this.courseModel.findOne({
      name: createCourseDto.name,
    });
    if (exist) {
      throw new BadRequestException('Course is already exists');
    }
    const course = await this.courseModel.create(createCourseDto);
    return { course };
  }

  async fetchAllCourses(page: number, limit: number) {
    let page1: number;
    let limit1: number;
    page1 = +page > 0 ? +page : 1;
    limit1 = +limit > 0 ? +limit : null;

    const courses = await this.courseModel
      .find()
      .skip((page1 - 1) * limit1)
      .limit(limit1);
    const count = await this.courseModel.count({});
    return { courses, count };
  }

  async fetchSingleCourse(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid course id');
    }
    const course = await this.courseModel.findById(id);
    return { course };
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new BadRequestException('Invalid id. Course is not exists');
    }
    const exist = await this.courseModel.findOne({
      name: updateCourseDto.name,
    });
    if (exist && exist.id !== course.id) {
      throw new BadRequestException('Course is already exists');
    }
    await this.courseModel.updateOne({ _id: id }, updateCourseDto);
    const updated = await this.courseModel.findById(id);
    return { updated };
  }

  async removeCourse(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new BadRequestException('Invalid id. Course is not exists');
    }
    await course.deleteOne();

    await this.groupModel.deleteMany({ course: id });

    return { message: 'deleted successfully' };
  }
}
