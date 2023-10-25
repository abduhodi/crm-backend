import { BadRequestException, Injectable } from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { RoomsService } from '../rooms/rooms.service';
import { CoursesService } from '../courses/courses.service';
import { GetFreeRoomDto } from './dto/get-free-room.dto';
import { LessonsService } from '../lessons/lessons.service';
import { getSelectedDaysFromDate } from '../utils/get-selected-days';
import { StudentAttendanceService } from '../student_attendance/student_attendance.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
    private roomService: RoomsService,
    private courseService: CoursesService,
    private lessonService: LessonsService,
    private studentAttendanceService: StudentAttendanceService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    if (createGroupDto.start_time >= createGroupDto.end_time) {
      throw new BadRequestException('end time must be greater than start time');
    }
    const { room } = await this.roomService.fetchSingleRoom(
      createGroupDto.room,
    );
    if (!room) {
      throw new BadRequestException('Room is not found ');
    }
    const { course } = await this.courseService.fetchSingleCourse(
      createGroupDto.course,
    );
    if (!course) {
      throw new BadRequestException('Course is not found ');
    }
    const exist = await this.groupModel.findOne({
      name: createGroupDto.name,
    });
    if (exist) {
      throw new BadRequestException('Group is already exists');
    }

    const end_date = new Date(createGroupDto.start_date);
    end_date.setMonth(end_date.getMonth() + course.period);

    const group = await this.groupModel.create({ ...createGroupDto, end_date });
    const selectedDays = [];
    if (group.days) {
      selectedDays.push('monday', 'wednesday', 'friday');
    } else {
      selectedDays.push('tuesday', 'thursday', 'saturday');
    }
    const days = getSelectedDaysFromDate(
      selectedDays,
      group.start_date,
      group.end_date,
    );

    days.forEach(async (day, number) => {
      const lesson = await this.lessonService.generateLesson(
        group.id,
        number + 1,
        day,
      );
      await this.studentAttendanceService.generateAttendance(
        group.id,
        lesson.id,
        day,
      );
    });

    return { group };
  }

  async fetchAllGroups(page: number, limit: number) {
    let page1: number;
    let limit1: number;
    page1 = +page > 0 ? +page : 1;
    limit1 = +limit > 0 ? +limit : null;

    const groups = await this.groupModel
      .find()
      .skip((page1 - 1) * limit1)
      .limit(limit1)
      .populate(['course', 'room']);
    const count = await this.groupModel.count({});
    return { groups, count };
  }

  async fetchAvailableRooms(getFreeRoomDto: GetFreeRoomDto) {
    const groups = await this.groupModel.find({
      end_date: {
        $gte: getFreeRoomDto.start_date,
      },
      $or: [
        {
          $and: [
            {
              start_time: {
                $lte: getFreeRoomDto.start_time,
              },
            },
            {
              end_time: {
                $gte: getFreeRoomDto.start_time,
              },
            },
          ],
        },
        {
          $and: [
            {
              start_time: {
                $lte: getFreeRoomDto.end_time,
              },
            },
            {
              end_time: {
                $gte: getFreeRoomDto.end_time,
              },
            },
          ],
        },
        {
          $and: [
            {
              start_time: {
                $gte: getFreeRoomDto.start_time,
              },
            },
            {
              end_time: {
                $lte: getFreeRoomDto.end_time,
              },
            },
          ],
        },
      ],
      days: getFreeRoomDto.days,
    });
    const busyRooms = groups.map((group) => group.room);
    const rooms = await this.roomService.getFreeRooms(busyRooms);
    return rooms;
  }

  async fetchSingleGroup(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const group = await this.groupModel
      .findById(id)
      .populate(['course', 'room']);
    return { group };
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const group = await this.groupModel.findById(id);
    if (!group) {
      throw new BadRequestException('Invalid id. Group does not exist');
    }
    const exist = await this.groupModel.findOne({
      name: updateGroupDto.name,
    });
    if (exist && exist.id !== group.id) {
      throw new BadRequestException('Group is already exists');
    }
    await this.groupModel.updateOne({ _id: id }, updateGroupDto);
    const updated = await this.groupModel.findById(id);
    return { updated };
  }

  async removeGroup(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const group = await this.groupModel.findById(id);
    if (!group) {
      throw new BadRequestException('Invalid id. Group does not exist');
    }
    await group.deleteOne();
    return { message: 'deleted successfully' };
  }
}
