import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  period: number;
}
