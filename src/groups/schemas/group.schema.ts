import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ versionKey: false })
export class Group {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: Date,
    required: false,
  })
  start_date: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  days: boolean;

  @Prop({
    type: String,
    required: true,
  })
  time: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Room',
    required: true,
  })
  room_id: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  status: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course_id: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
