import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Validate } from 'class-validator';
import { isObjectIdValidator } from '../../validators/isObjectId.validator';

export class CreateLessonDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  group: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  teacher?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  pass?: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  admin?: string;
}
