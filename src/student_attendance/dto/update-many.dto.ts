import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentsAttendanceDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  participate: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  value: boolean;
}
