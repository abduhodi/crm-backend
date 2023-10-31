import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Finance, FinanceDocument } from './schemas/finance.schema';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CalculateSalaryDto } from './dto/salary.dto';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson, LessonDocument } from '../lessons/schemas/lesson.schema';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Finance.name)
    private readonly financeModel: Model<FinanceDocument>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>, // @InjectModel(User.name) private readonly teacherModel: Model<UserDocument>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto) {
    try {
      // const teacher = await this.teacherModel.findById(createFinanceDto.teacher);
      // if (!teacher) {
      //   throw new BadRequestException('Teacher is not found');
      // };
      const salary = await this.financeModel.create(createFinanceDto);
      return salary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return `This action returns all finance`;
  }

  async calculateTeacherSalary(dto: CalculateSalaryDto) {
    try {
      if (!isValidObjectId(dto.teacher)) {
        throw new BadRequestException('Invalid Teacher Id');
      }
      const teacher = await this.financeModel.findOne({
        teacher: dto.teacher,
      });
      if (!teacher) {
        return { message: 'Teacher is not found' };
      }
      const lessons = await this.lessonModel.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(dto.start_date),
              $lte: new Date(dto.end_date),
            },
            teacher: dto.teacher,
            pass: true,
            paid: true,
          },
        },
        {
          $group: {
            _id: '$teacher',
            duration: { $sum: '$duration' },
          },
        },
      ]);
      //@ts-ignore
      const expected_salary = parseInt(teacher.salary * lessons[0].duration);
      return { expected_salary };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} finance`;
  }

  update(id: number, updateFinanceDto: UpdateFinanceDto) {
    return `This action updates a #${id} finance`;
  }

  remove(id: number) {
    return `This action removes a #${id} finance`;
  }
}
