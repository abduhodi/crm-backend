import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GroupStudent } from './schemas/group_student.schema';
import { CreateGroupStudentDto } from './dto/create-group_student.dto';
import { GroupsService } from '../groups/groups.service';
import { AdminService } from '../admins/admins.service';
import { LessonsService } from '../lessons/lessons.service';
import { StudentAttendanceService } from '../student_attendance/student_attendance.service';

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectModel(GroupStudent.name)
    private readonly groupStudentModel: Model<GroupStudent>,
    private readonly studentService: AdminService,
    private readonly groupService: GroupsService,
    private readonly lessonService: LessonsService,
    private readonly studentAttendanceService: StudentAttendanceService,
  ) {}

  async addStudentToGroup(createGroupStudentDto: CreateGroupStudentDto) {
    const isValidGroupId = isValidObjectId(createGroupStudentDto.group);
    if (!isValidGroupId) {
      throw new BadRequestException('Invalid id');
    }
    const { group } = await this.groupService.fetchSingleGroup(
      createGroupStudentDto.group,
    );
    if (!group) {
      throw new BadRequestException('Group is not found');
    }
    const { student } = await this.studentService.findOneStudentByPhone(
      createGroupStudentDto.student_phone,
    );
    if (!student) {
      throw new BadRequestException('Student is not found');
    }
    const exist = await this.groupStudentModel.findOne({
      group: group.id,
      student: student.id,
    });
    if (exist) {
      throw new BadRequestException('Student is already joined to this group');
    }
    const added = await this.groupStudentModel.create({
      group: group.id,
      student: student.id,
    });
    group.student_count++;
    await group.save();

    const lessons = await this.lessonService.findGroupAllLessonsById(group.id);

    lessons.forEach((lesson) => {
      this.studentAttendanceService.generateAttendance(
        group.id,
        lesson.id,
        student.id,
        lesson.date,
      );
    });

    return { create: added };
  }

  async fetchAll(page: number, limit: number) {
    let page1: number;
    let limit1: number;
    page1 = +page > 0 ? +page : 1;
    limit1 = +limit > 0 ? +limit : 10;

    const group_students = await this.groupStudentModel
      .find()
      .skip((page1 - 1) * limit1)
      .limit(limit1)
      .populate(['group', 'student']);
    const count = await this.groupStudentModel.count({});
    return { group: group_students, count };
  }

  async fetchGroupAllStudents(group: string) {
    const students = await this.groupStudentModel
      .find({ group })
      .populate({
        path: 'student',
        select: '-token -password -role',
      })
      .select('student -_id');
    return {
      students: students.map((st) => st.student),
    };
  }

  // async fetchSingleRoom(id: string) {
  //   const isValidId = isValidObjectId(id);
  //   if (!isValidId) {
  //     throw new BadRequestException('Invalid id');
  //   }
  //   const room = await this.groupStudentModel.findById(id);
  //   return { room };
  // }

  // async updateRoom(id: string, updateRoomDto: UpdateGroupStudentDto) {
  //   const isValidId = isValidObjectId(id);
  //   if (!isValidId) {
  //     throw new BadRequestException('Invalid id');
  //   }
  //   const room = await this.groupStudentModel.findById(id);
  //   if (!room) {
  //     throw new BadRequestException('Invalid id. Room does not exist');
  //   }
  //   const exist = await this.groupStudentModel.findOne({
  //     name: updateRoomDto.name,
  //   });
  //   if (exist && exist.id !== room.id) {
  //     throw new BadRequestException('Room is already exists');
  //   }
  //   await this.groupStudentModel.updateOne({ _id: id }, updateRoomDto);
  //   const updated = await this.groupStudentModel.findById(id);
  //   return { updated };
  // }

  async removeStudentFromGroup(dto: CreateGroupStudentDto) {
    const isValidGroupId = isValidObjectId(dto.group);
    if (!isValidGroupId) {
      throw new BadRequestException('Invalid group id');
    }
    const { group } = await this.groupService.fetchSingleGroup(dto.group);
    if (!group) {
      throw new BadRequestException('Group is not found');
    }
    const { student } = await this.studentService.findOneStudentByPhone(
      dto.student_phone,
    );
    if (!student) {
      throw new BadRequestException('Student is not found');
    }
    const group_student = await this.groupStudentModel.findOne({
      group: dto,
      student: student.id,
    });
    if (!group_student) {
      throw new BadRequestException('Invalid id. Student is in this group');
    }
    await group_student.deleteOne();
    return { message: 'deleted successfully' };
  }
}
