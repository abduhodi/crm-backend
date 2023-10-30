import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  participated: boolean;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
