import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  value: boolean;
}
