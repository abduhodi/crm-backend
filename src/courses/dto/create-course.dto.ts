import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @Max(2000000)
  @Min(200000)
  price: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @Max(200)
  @Min(30)
  period: number;
}
