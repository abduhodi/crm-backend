import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GroupStudent } from './schemas/group_student.schema';
import { CreateGroupStudentDto } from './dto/create-group_student.dto';
import { GroupsService } from '../groups/groups.service';
import { StudentsService } from '../students/students.service';
import { AdminService } from '../admins/admins.service';
import { UpdateGroupStudentDto } from './dto/update-group_student.dto';

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectModel(GroupStudent.name)
    private groupStudentModel: Model<GroupStudent>,
    private groupService: GroupsService,
    private studentService: AdminService,
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
      group: group._id,
      student: student._id,
    });
    if (exist) {
      throw new BadRequestException('Student is already joined to this group');
    }
    const added = await this.groupStudentModel.create({
      group: group._id,
      student: student._id,
    });
    group.student_count++;
    await group.save();

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
      .populate('student');
    return { students: students.map((st) => st.student) };
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
      student: student._id,
    });
    if (!group_student) {
      throw new BadRequestException('Invalid id. Student is in this group');
    }
    await group_student.deleteOne();
    return { message: 'deleted successfully' };
  }
}
