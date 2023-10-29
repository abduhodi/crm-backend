import { PartialType } from '@nestjs/swagger';
import { CreateLessonVideoDto } from './create-lesson_video.dto';

export class UpdateLessonVideoDto extends PartialType(CreateLessonVideoDto) {}
