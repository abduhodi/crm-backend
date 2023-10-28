import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RoomsService } from '../rooms/rooms.service';

@ValidatorConstraint({ name: 'room', async: false })
@Injectable()
export class RoomValidator implements ValidatorConstraintInterface {
  constructor(private roomService: RoomsService) {}

  async validate(
    id: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const isRoom = await this.roomService.fetchSingleRoom(id);
    if (isRoom) return true;
    return false;
  }
}
