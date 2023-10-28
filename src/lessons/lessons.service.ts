import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { Model, isValidObjectId } from 'mongoose';
import { MarkAttendanceLessonDto } from './dto/mark-attendance.dto';
import { Request } from 'express';
import { UpdateLessonCommentDto } from './dto/update-comment.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto) {
    return this.lessonModel.create(createLessonDto);
  }

  async generateLesson(group: string, number: number, date: string) {
    if (!isValidObjectId(group)) {
      throw new BadRequestException('Invalid Group Id');
    }
    return this.lessonModel.create({ group, number, date });
  }

  async findSingleGroupAllLessons(group: string, page: number, limit: number) {
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
  }

  async findGroupAllLessonsById(group: string) {
    if (!isValidObjectId(group)) {
      throw new BadRequestException('Invalid Group Id');
    }
    return this.lessonModel.find({ group });
  }

  async findLessonById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Group Id');
    }
    return this.lessonModel.findById(id).populate({
      path: 'group teacher',
      select: '-token -password -start_date',
    });
  }

  async markAttendance(id: string, dto: MarkAttendanceLessonDto, req: any) {
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
  }

  async updateLeesonComment(id: string, dto: UpdateLessonCommentDto, req: any) {
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
      $set: { admin, description: dto.description },
    });
    return { message: 'Lesson comment added' };
  }

  // findOne(id: string) {
  //   return `This action returns a #${id} lesson`;
  // }

  // update(id: number, updateLessonDto: UpdateLessonDto) {
  //   return `This action updates a #${id} lesson`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} lesson`;
  // }
}
