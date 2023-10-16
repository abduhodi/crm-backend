import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
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
    type: String,
    required: true,
  })
  room_id: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  status: boolean;

  @Prop({
    type: String,
    required: true,
  })
  course_id: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
