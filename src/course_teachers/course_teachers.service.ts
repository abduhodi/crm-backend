import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseTeacherDto } from './dto/create-course_teacher.dto';
import { UpdateCourseTeacherDto } from './dto/update-course_teacher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CourseTeacher } from './schemas/course_teacher.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CoursesService } from '../courses/courses.service';
import { TeachersService } from '../teachers/teachers.service';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class CourseTeachersService {
  constructor(
    @InjectModel(CourseTeacher.name)
    private readonly courseTeacherModel: Model<CourseTeacher>,
    private readonly courseService: CoursesService,
    private readonly teacherService: TeachersService,
  ) {}

  //----------------------- ADD TEACHER TO COURSE -----------------------------//

  async addTeacherToCourse(createCourseTeacherDto: CreateCourseTeacherDto) {
    const { course, teacher } = createCourseTeacherDto;

    const { course: courseData } = await this.courseService.fetchSingleCourse(
      course,
    );

    if (!courseData) {
      throw new BadRequestException('Course is not found');
    }

    const { teacher: teacherData } = await this.teacherService.findOneTeacher(
      teacher,
    );

    if (!teacherData) {
      throw new BadRequestException('Teacher is not found');
    }

    const exist = await this.courseTeacherModel.findOne({ course, teacher });

    if (exist) {
      throw new BadRequestException('Teacher is already added to this Course');
    }

    const newMember = await this.courseTeacherModel.create(
      createCourseTeacherDto,
    );

    return { response: newMember };
  }

  //----------------------- FIND ALL TEACHERS IN ALL COURSES -----------------------------//

  findAll() {
    return this.courseTeacherModel.find().populate({
      path: 'course teacher',
      select: '_id first_name last_name image',
    });
  }

  //----------------------- FIND ALL TEACHERS IN ONE COURSE -----------------------------//

  async findAllTeachersOfCourse(course: string) {
    const teachers = await this.courseTeacherModel.find({ course }).populate({
      path: 'course teacher',
      select: '_id first_name last_name image',
    });

    return { teachers: teachers.map((item) => item?.teacher) };
  }

  //----------------------- FIND TEACHER IN ONE COURSE -----------------------------//

  findCourseMemberTeacher(course: string, teacher: string) {
    return this.courseTeacherModel.findOne({ course, teacher }).populate({
      path: 'course teacher',
      select: '_id first_name last_name image',
    });
  }

  // //----------------------- UPDATE TEACHER IN ONE COURSE -----------------------------//

  // update(updateDto: CreateCourseTeacherDto) {
  //   return `This action updates a courseTeacher`;
  // }

  //----------------------- DELETE TEACHER FROM ONE COURSE -----------------------------//

  async removeTeacherFromCourse(removeDto: CreateCourseTeacherDto) {
    const { course, teacher } = removeDto;

    const { course: courseData } = await this.courseService.fetchSingleCourse(
      course,
    );

    if (!courseData) {
      throw new BadRequestException('Course is not found');
    }

    const { teacher: teacherData } = await this.teacherService.findOneTeacher(
      teacher,
    );

    if (!teacherData) {
      throw new BadRequestException('Teacher is not found');
    }

    const exist = await this.courseTeacherModel.findOne({ course, teacher });

    if (!exist) {
      throw new BadRequestException('Teacher is not in this Course');
    }

    await exist.deleteOne();

    return { message: 'delete success' };
  }
}
