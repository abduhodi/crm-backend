import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({
    type: String,
    required: false,
    virtual: true,
  })
  id: string;

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
    default: true,
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
    default: null,
  })
  image: string;

  @Prop({
    type: Date,
    default: new Date(),
  })
  start_date: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.post('save', (val) => {
  val.id = val._id.toString();
  val.save();
});
