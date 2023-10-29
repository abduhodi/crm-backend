import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ versionKey: false })
export class Lesson {
  @Prop({
    type: String,
    require: false,
    default: null,
  })
  title: string;

  @Prop({
    type: Date,
    require: true,
    default: new Date(),
  })
  date: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    require: true,
  })
  group: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    require: false,
    default: null,
  })
  teacher: string;

  @Prop({
    type: Number,
    require: true,
  })
  number: number;

  @Prop({
    type: Boolean,
    require: true,
    default: false,
  })
  pass: boolean;

  @Prop({
    type: Number,
    require: true,
  })
  duration: number;

  @Prop({
    type: Boolean,
    require: true,
    default: true,
  })
  paid: boolean;

  @Prop({
    type: String,
    require: false,
    default: null,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    require: false,
    default: null,
  })
  admin: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
