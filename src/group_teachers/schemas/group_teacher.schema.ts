import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupTeacherDocument = HydratedDocument<GroupTeacher>;

@Schema({ versionKey: false })
export class GroupTeacher {
  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  teacher: string;
}

export const GroupTeacherSchema = SchemaFactory.createForClass(GroupTeacher);
