import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  phone: string;

  // @ApiProperty({ type: 'string', format: 'binary' })
  // image: any;
}
