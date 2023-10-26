import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Validate } from 'class-validator';
import { isObjectIdValidator } from '../../validators/isObjectId.validator';

export class UpdateStudentsAttendance2Dto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  student: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  lesson: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  value: boolean;
}
