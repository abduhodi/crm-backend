import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { isObjectIdValidator } from '../../validators/isObjectId.validator';

export class CreateLessonVideoDto {
  @ApiProperty({
    type: String,
    description: 'title for video',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'lesson id',
  })
  @IsString()
  @IsNotEmpty()
  @Validate(isObjectIdValidator)
  lesson: string;
}
