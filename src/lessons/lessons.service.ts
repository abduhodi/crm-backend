import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { Model, isValidObjectId } from 'mongoose';

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
    return this.lessonModel.create({ group, number, created_date: date });
  }

  async findSingleGroupAllLessons(group: string) {
    if (!isValidObjectId(group)) {
      throw new BadRequestException('Invalid Group Id');
    }
    return this.lessonModel.find({ group }).populate(['group', 'teacher']);
  }

  findOne(id: number) {
    return `This action returns a #${id} lesson`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}
