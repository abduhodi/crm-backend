import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroupStudentsDocument = HydratedDocument<GroupStudent>;

@Schema()
export class GroupStudent {
  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group_id: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  student_id: string;
}

export const GroupStudentSchema = SchemaFactory.createForClass(GroupStudent);
