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
    type: Date,
    required: false,
  })
  end_date: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  days: boolean;

  @Prop({
    type: Number,
    required: true,
  })
  start_time: number;

  @Prop({
    type: Number,
    required: true,
  })
  end_time: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Room',
    required: false,
  })
  room: string;

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
  course: string;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  student_count: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
