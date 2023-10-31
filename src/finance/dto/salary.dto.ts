import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, Validate } from 'class-validator';
import { isObjectIdValidator } from '../../validators/isObjectId.validator';

export class CalculateSalaryDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  teacher: string;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsString()
  start_date: string;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsString()
  end_date: string;
}
