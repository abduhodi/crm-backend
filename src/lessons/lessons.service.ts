import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { Model, isValidObjectId } from 'mongoose';
import { MarkAttendanceLessonDto } from './dto/mark-attendance.dto';
import { UpdateLessonCommentDto } from './dto/update-comment.dto';
import {
  StudentAttendance,
  StudentAttendanceDocument,
} from '../student_attendance/schemas/student_attendance.schema';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(StudentAttendance.name)
    private readonly attendanceModel: Model<StudentAttendanceDocument>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto) {
    try {
      return this.lessonModel.create(createLessonDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateLesson(group: string, number: number, date: string) {
    try {
      if (!isValidObjectId(group)) {
        throw new BadRequestException('Invalid Group Id');
      }
      return this.lessonModel.create({ group, number, date });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findSingleGroupAllLessons(group: string, page: number, limit: number) {
    try {
      let page1: number;
      let limit1: number;
      page1 = +page > 0 ? +page : 1;
      limit1 = +limit > 0 ? +limit : null;
      if (!isValidObjectId(group)) {
        throw new BadRequestException('Invalid Group Id');
      }
      const lessons = await this.lessonModel
        .find({ group })
        .populate({
          path: 'group teacher',
          select: '-token -password -start_date',
        })
        .sort('date : 1')
        .skip((page1 - 1) * limit1)
        .limit(limit1);

      const count = await this.lessonModel.count({ group });

      return { lessons, count };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findGroupAllLessonsById(group: string) {
    try {
      if (!isValidObjectId(group)) {
        throw new BadRequestException('Invalid Group Id');
      }
      return this.lessonModel.find({ group });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findLessonById(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid Group Id');
      }
      return this.lessonModel.findById(id).populate({
        path: 'group teacher',
        select: '-token -password -start_date',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async markAttendance(id: string, dto: MarkAttendanceLessonDto, req: any) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid Lesson Id');
      }
      Object.defineProperties(dto, {
        _id: { enumerable: false },
        date: { enumerable: false },
        group: { enumerable: false },
        teacher: { enumerable: false },
        number: { enumerable: false },
        description: { enumerable: false },
        admin: { enumerable: false },
      });

      const teacher = req?.user?.id;
      if (!teacher) {
        throw new BadRequestException('Invalid token');
      }
      await this.lessonModel.findByIdAndUpdate(id, {
        $set: { pass: true, title: dto.title, teacher },
      });
      return { message: 'Lesson marked as passed' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateLessonComment(id: string, dto: UpdateLessonCommentDto, req: any) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid Lesson Id');
      }
      Object.defineProperties(dto, {
        _id: { enumerable: false },
        pass: { enumerable: false },
        title: { enumerable: false },
        group: { enumerable: false },
        teacher: { enumerable: false },
        number: { enumerable: false },
        admin: { enumerable: false },
      });

      const admin = req?.user?.id;
      if (!admin) {
        throw new BadRequestException('Invalid token');
      }
      await this.lessonModel.findByIdAndUpdate(id, {
        admin,
        ...dto,
        pass: false,
      });
      await this.attendanceModel.updateMany(
        { lesson: id },
        { participated: false, comment: dto.description, admin },
      );
      return { message: 'Lesson comment added' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
