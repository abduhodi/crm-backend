import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentAttendanceDto } from './dto/create-student_attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student_attendance.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudentAttendance,
  StudentAttendanceDocument,
} from './schemas/student_attendance.schema';
import { Model, isValidObjectId } from 'mongoose';
import { GroupStudentsService } from '../group_students/group_students.service';

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectModel(StudentAttendance.name)
    private readonly studentAttendanceModel: Model<StudentAttendanceDocument>,
  ) // private groupStudentsService: GroupStudentsService,
  {}

  async generateAttendance(group: string, lesson: string, date: string) {
    if (!isValidObjectId(group) || !isValidObjectId(lesson)) {
      return null;
    }

    // const { students } = await this.groupStudentsService.fetchGroupAllStudents(
    //   group,
    // );
    // students.forEach(async (student: any) => {
    //   await this.studentAttendanceModel.create({
    //     group,
    //     lesson,
    //     student: student.id,
    //     date,
    //   });
    // });

    return;
  }

  async findSingleGroupLessonAttendace(group: string, lesson: string) {
    return this.studentAttendanceModel
      .find({ group, lesson })
      .populate(['student']);
  }

  async findSingleStudentGroupLessonAttendace(
    group: string,
    lesson: string,
    student: string,
  ) {
    return this.studentAttendanceModel
      .find({ group, lesson, student })
      .populate(['student']);
  }

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
