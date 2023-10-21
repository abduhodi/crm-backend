import { BadRequestException, Injectable } from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { RoomsService } from '../rooms/rooms.service';
import { CoursesService } from '../courses/courses.service';
import { GetFreeRoomDto } from './dto/get-free-room.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
    private roomService: RoomsService,
    private courseService: CoursesService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
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
