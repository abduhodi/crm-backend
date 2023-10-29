import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonVideoDocument = HydratedDocument<LessonVideo>;

@Schema({ versionKey: false })
export class LessonVideo {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
  })
  lesson: string;

  @Prop({
    type: Date,
    required: true,
    default: new Date(),
  })
  date: string;

  @Prop({
    type: String,
    required: true,
  })
  url: string;

  @Prop({
    type: Number,
    required: false,
  })
  size: number;

  @Prop({
    type: String,
    required: false,
  })
  type: string;
}

export const LessonVideoSchema = SchemaFactory.createForClass(LessonVideo);
