import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<Group>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    const exist = await this.groupModel.findOne({
      name: createGroupDto.name,
    });
    if (exist) {
      throw new BadRequestException('Group is already exists');
    }
    const group = await this.groupModel.create(createGroupDto);
    return { group };
  }

  async fetchAllGroups(page: number, limit: number) {
    let page1: number;
    let limit1: number;
    page1 = +page > 0 ? +page : 1;
    limit1 = +limit > 0 ? +limit : 10;

    const groups = await this.groupModel
      .find()
      .skip((page1 - 1) * limit1)
      .limit(limit1);
    const count = await this.groupModel.count({});
    return { groups, count };
  }

  async fetchSingleGroup(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }
    const group = await this.groupModel.findById(id);
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
