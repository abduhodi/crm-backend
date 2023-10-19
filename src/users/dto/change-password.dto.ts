import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Length(3, 30)
  @IsNotEmpty({ message: 'Old Password should not be empty' })
  old_password: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Length(3, 30)
  @IsNotEmpty({ message: 'New Password should not be empty' })
  new_password: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Length(3, 30)
  @IsNotEmpty({ message: 'Confirm Password should not be empty' })
  confirm_password: string;
}
