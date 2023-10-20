import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupTeacherDto {
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
    description: 'teacher id',
  })
  @IsString()
  @IsNotEmpty()
  teacher: string;
}
