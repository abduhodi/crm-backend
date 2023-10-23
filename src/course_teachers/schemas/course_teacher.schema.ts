import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseTeacherDocument = HydratedDocument<CourseTeacher>;

@Schema({ versionKey: false })
export class CourseTeacher {
  @Prop({
    type: Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  teacher: string;
}

export const CourseTeacherSchema = SchemaFactory.createForClass(CourseTeacher);
