import { ApiProperty } from '@nestjs/swagger';

export class VideoUploadDto {
  @ApiProperty({ type: String, format: 'binary', required: true })
  video: any;
}
