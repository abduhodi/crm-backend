import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { PhoneValidator } from '../../validators/phone.validator.decorator';

export class CreateGroupStudentDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'group id',
  })
  @IsString()
  @IsNotEmpty()
  group: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'student id',
  })
  @Length(13, 13, { message: 'Enter valid phone number (Ex. +998901234567)' })
  @Validate(PhoneValidator, {
    message: 'Enter valid phone number (Ex. +998901234567)',
  })
  student_phone: string;
}
