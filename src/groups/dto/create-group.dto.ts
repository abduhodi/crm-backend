import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  days: boolean;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  time: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  room_id: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  course_id: string;
}
