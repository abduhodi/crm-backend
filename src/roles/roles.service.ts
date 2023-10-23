import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  // async createRole(createRoleDto: CreateRoleDto) {
  //   const { name, description } = createRoleDto;
  //   const exist = await this.roleModel.findOne({
  //     name: name.toUpperCase(),
  //   });
  //   if (exist) {
  //     throw new BadRequestException('Role is already exists');
  //   }
  //   const role = await this.roleModel.create({
  //     name,
  //     description,
  //   });
  //   return { role };
  // }

  async fetchAllRoles() {
    const roles = await this.roleModel.find();

    return { roles };
  }

  async fetchSingleRole(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid role id');
    }
    const role = await this.roleModel.findById(id);
    return { role };
  }

  // async fetchSingleRoleByName(name: string) {
  //   const role = await this.roleModel.findOne({ name: name.toUpperCase() });
  //   return { role };
  // }

  // async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
  //   const { name } = updateRoleDto;

  //   const isValidId = isValidObjectId(id);
  //   if (!isValidId) {
  //     throw new BadRequestException('Invalid id');
  //   }
  //   const role = await this.roleModel.findById(id);
  //   if (!role) {
  //     throw new BadRequestException('Invalid id. Role does not exist');
  //   }
  //   const exist = await this.roleModel.findOne({
  //     name: name?.toUpperCase(),
  //   });
  //   if (exist && exist.id !== role.id) {
  //     throw new BadRequestException('Role is already exists');
  //   }
  //   await this.roleModel.updateOne({ _id: id }, updateRoleDto);
  //   const updated = await this.roleModel.findById(id);
  //   return { updated };
  // }

  // async removeRole(id: string) {
  //   const isValidId = isValidObjectId(id);
  //   if (!isValidId) {
  //     throw new BadRequestException('Invalid id');
  //   }
  //   const role = await this.roleModel.findById(id);
  //   if (!role) {
  //     throw new BadRequestException('Role does not exist');
  //   }
  //   await role.deleteOne();
  //   return { message: 'deleted successfully' };
  // }
}
