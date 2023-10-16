import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ versionKey: false })
export class Room {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: Number,
    required: false,
  })
  size: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
