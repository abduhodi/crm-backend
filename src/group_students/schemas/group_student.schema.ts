import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupStudentsDocument = HydratedDocument<GroupStudent>;

@Schema({ versionKey: false })
export class GroupStudent {
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
  student: string;
}

export const GroupStudentSchema = SchemaFactory.createForClass(GroupStudent);
