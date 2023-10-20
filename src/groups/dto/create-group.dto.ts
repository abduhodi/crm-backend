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
    required: true,
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
    type: Number,
    required: true,
  })
  @IsNumber()
  start_time: number;
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  end_time: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  room: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  course: string;
}
