import { PartialType } from '@nestjs/swagger';
import { CreateCourseTeacherDto } from './create-course_teacher.dto';

export class UpdateCourseTeacherDto extends PartialType(CreateCourseTeacherDto) {}
