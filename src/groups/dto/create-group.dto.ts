import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
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
  @Min(360)
  @Max(1320)
  start_time: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(480)
  @Max(1380)
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
    required: false,
  })
  course?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  teacher?: string;
}
