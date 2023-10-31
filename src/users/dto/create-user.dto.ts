import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { PhoneValidator } from '../../validators/phone.validator.decorator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Length(3, 30)
  @IsNotEmpty({ message: 'FirstName should not be empty' })
  first_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Length(3, 30)
  @IsNotEmpty({ message: 'LastName should not be empty' })
  last_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Length(13, 13, { message: 'Enter valid phone number Ex.(+998901234567)' })
  @Validate(PhoneValidator, {
    message: 'Enter valid phone number Ex.(+998901234567)',
  })
  phone: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  image?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  role?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  course?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  salary?: number;
}
