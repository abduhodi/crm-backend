import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateLessonCommentDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  paid?: boolean;

  @ApiProperty({
    type: Number,
    required: false,
  })
  duration?: number;
}
