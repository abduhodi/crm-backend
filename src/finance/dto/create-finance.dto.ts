import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { isObjectIdValidator } from '../../validators/isObjectId.validator';

export class CreateFinanceDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  teacher: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  salary: number;
}
