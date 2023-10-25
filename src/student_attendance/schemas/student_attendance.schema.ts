import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentAttendanceDocument = HydratedDocument<StudentAttendance>;

@Schema({ versionKey: false })
export class StudentAttendance {
  @Prop({
    type: Boolean,
    require: true,
    default: true,
  })
  participated: boolean;

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
    ref: 'Lesson',
    require: true,
  })
  lesson: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    require: true,
  })
  student: string;

  @Prop({
    type: String,
    require: false,
    default: null,
  })
  comment: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    require: false,
    default: null,
  })
  admin: string;
}

export const StudentAttendanceSchema =
  SchemaFactory.createForClass(StudentAttendance);
