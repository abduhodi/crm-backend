import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // @Prop({
  //   type: Number,
  //   required: true,
  //   unique: true,
  // })
  // id: number;

  @Prop({
    type: String,
    required: true,
  })
  first_name: string;

  @Prop({
    type: String,
    required: true,
  })
  last_name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  phone: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  status: boolean;

  @Prop({
    type: String,
    required: true,
  })
  role: string;

  @Prop({
    type: String,
    required: false,
  })
  image: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: false,
  })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
