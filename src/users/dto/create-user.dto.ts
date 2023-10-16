import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Validate,
} from 'class-validator';
import { PhoneValidator } from '../../validators/phone.validator.decorator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'FirstName should not be empty' })
  first_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
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

  // @ApiProperty({ type: 'string', format: 'binary' })
  // image: any;
}
