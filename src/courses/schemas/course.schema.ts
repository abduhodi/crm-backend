import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ versionKey: false })
export class Course {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
  })
  period: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
