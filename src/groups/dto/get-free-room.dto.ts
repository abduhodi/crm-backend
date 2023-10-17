import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class GetFreeRoomDto {
  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

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
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  days: boolean;
}
