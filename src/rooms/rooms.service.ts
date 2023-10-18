import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const exist = await this.roomModel.findOne({
      name: createRoomDto.name,
    });
    if (exist) {
      throw new BadRequestException('Room is already exists');
    }
    const room = await this.roomModel.create(createRoomDto);
    return { room };
  }

  async getFreeRooms(rooms: string[]) {
    const avaliableRooms = await this.roomModel.find({
      _id: { $not: { $in: rooms } },
    });
    return avaliableRooms;
  }

  async fetchAllRooms(page: number, limit: number) {
    let page1: number;
    let limit1: number;
    page1 = +page > 0 ? +page : 1;
    limit1 = +limit > 0 ? +limit : null;

    const rooms = await this.roomModel
      .find()
      .skip((page1 - 1) * limit1)
      .limit(limit1);
    const count = await this.roomModel.count({});
    return { rooms, count };
  }

  async fetchSingleRoom(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid room id');
    }
    const room = await this.roomModel.findById(id);
    return { room };
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new BadRequestException('Invalid id. Room does not exist');
    }
    const exist = await this.roomModel.findOne({
      name: updateRoomDto.name,
    });
    if (exist && exist.id !== room.id) {
      throw new BadRequestException('Room is already exists');
    }
    await this.roomModel.updateOne({ _id: id }, updateRoomDto);
    const updated = await this.roomModel.findById(id);
    return { updated };
  }

  async removeRoom(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new BadRequestException('Invalid id. Room does not exist');
    }
    await room.deleteOne();
    return { message: 'deleted successfully' };
  }
}
