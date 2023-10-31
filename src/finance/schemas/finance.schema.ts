import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FinanceDocument = HydratedDocument<Finance>;

@Schema({ versionKey: false })
export class Finance {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  teacher: string;

  @Prop({
    type: Number,
    required: true,
  })
  salary: number;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
