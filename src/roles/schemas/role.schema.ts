import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ versionKey: false })
export class Role {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
