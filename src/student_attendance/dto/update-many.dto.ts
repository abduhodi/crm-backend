import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class UpdateStudentsAttendanceDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isValidObjectId)
  _id: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  participated: boolean;
}
