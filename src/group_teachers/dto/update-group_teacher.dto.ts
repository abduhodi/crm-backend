import { PartialType } from '@nestjs/swagger';
import { CreateGroupTeacherDto } from './create-group_teacher.dto';

export class UpdateGroupTeacherDto extends PartialType(CreateGroupTeacherDto) {}
