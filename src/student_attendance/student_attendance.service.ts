import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateStudentAttendanceDto } from './dto/update-student_attendance.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentAttendance,
  StudentAttendanceDocument,
} from './schemas/student_attendance.schema';
import { Model, isValidObjectId } from 'mongoose';
import {
  GroupStudent,
  GroupStudentsDocument,
} from '../group_students/schemas/group_student.schema';
import { UpdateStudentsAttendanceDto } from './dto/update-many.dto';
import { UpdateStudentsAttendance2Dto } from './dto/update-many2.dto';
import { UpdateAttendanceDto } from './dto/update-one.dto';
import { Request } from 'express';

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectModel(StudentAttendance.name)
    private readonly studentAttendanceModel: Model<StudentAttendanceDocument>,
    @InjectModel(GroupStudent.name)
    private readonly groupStudentModel: Model<GroupStudentsDocument>, // private groupStudentsService: GroupStudentsService,
  ) {}

  async generateAttendance(
    group: string,
    lesson: string,
    student: string,
    date: string,
  ) {
    if (
      !isValidObjectId(group) ||
      !isValidObjectId(lesson) ||
      !isValidObjectId(student)
    ) {
      return null;
    }

    await this.studentAttendanceModel.create({
      group,
      lesson,
      student,
      date,
    });

    return;
  }

  async findSingleGroupLessonAttendace(group: string, lesson: string) {
    try {
      return this.studentAttendanceModel
        .find({ group, lesson })
        .populate(['student']);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find all students' attendances in all lessons in one group
  async findSingleGroupAllStudentsAttendace(
    group: string,
    page: number,
    limit: number,
  ) {
    try {
      let page1: number;
      let limit1: number;
      page1 = +page > 0 ? +page : 1;
      limit1 = +limit > 0 ? +limit : 30;
      return await this.studentAttendanceModel.aggregate([
        { $match: { group } },
        { $sort: { date: 1 } },
        {
          $group: {
            _id: '$student',
            attendance: {
              $push: {
                lesson: '$_id',
                participated: '$participated',
                comment: '$comment',
                admin: '$admin',
                date: '$date',
              },
            },
          },
        },
        { $skip: (page1 - 1) * limit1 },
        { $limit: limit1 },
        { $project: { student: '$_id', _id: 0, attendance: 1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'student',
            foreignField: 'id',
            as: 'student',
          },
        },
        { $unwind: '$student' },
        {
          $project: {
            'student.token': 0,
            'student.password': 0,
            'student.start_date': 0,
            'student.role': 0,
          },
        },
      ]);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find all students' attendances in one lesson in one group
  async findSingleLessonStudentsAttendace(group: string, lesson: string) {
    try {
      return this.studentAttendanceModel.find({ group, lesson }).populate({
        path: 'student admin lesson',
        select: '-token -password -role -start_date',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find all students' attendances in one day in one group
  async findSingleDayStudentsAttendace(group: string, date: string) {
    try {
      return this.studentAttendanceModel.find({ group, date }).populate({
        path: 'student admin lesson',
        select: '-token -password -role -start_date',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find single student's attendance in one lesson in one group
  async findSingleStudentSingleLessonAttendace(
    group: string,
    lesson: string,
    student: string,
  ) {
    try {
      return this.studentAttendanceModel
        .findOne({ group, lesson, student })
        .populate({
          path: 'student admin',
          select: '-token -password -role -start_date',
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //update single student's attendance in one lesson in one group
  async updateSingleStudentSingleLessonAttendace(
    id: string,
    value: UpdateAttendanceDto,
    req: any,
  ) {
    try {
      const admin = req?.user?.id;
      if (!admin) {
        throw new BadRequestException('Invalid token');
      }
      await this.studentAttendanceModel.findByIdAndUpdate(id, {
        ...value,
        admin,
      });
      return { message: 'updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //update all students' attendances in one lesson in one group
  async updateSingleLessonStudentsAttendace(data: {
    data: UpdateStudentsAttendanceDto[];
  }) {
    try {
      data.data.forEach(async (item) => {
        await this.studentAttendanceModel.findByIdAndUpdate(item._id, {
          participated: item.participated,
        });
      });

      return { message: 'updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // //update all students' attendances in one lesson in one group
  // async updateSingleLessonStudentsAttendace(
  //   data: UpdateStudentsAttendanceDto[],
  // ) {
  //   data.forEach(async (item) => {
  //     await this.studentAttendanceModel.findByIdAndUpdate(item.participate, {
  //       participated: item.value,
  //     });
  //   });

  //   return { message: 'updated' };
  // }

  // //find all students' attendances in one lesson in one group
  // async findSingleStudentGroupLessonAttendace(
  //   group: string,
  //   lesson: string,
  //   student: string,
  // ) {
  //   return this.studentAttendanceModel
  //     .find({ group, lesson, student })
  //     .populate(['student']);
  // }

  findOne(id: number) {
    return `This action returns a #${id} studentAttendance`;
  }

  update(id: number, updateStudentAttendanceDto: UpdateStudentAttendanceDto) {
    return `This action updates a #${id} studentAttendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentAttendance`;
  }
}
