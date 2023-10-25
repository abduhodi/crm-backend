import { PartialType } from '@nestjs/swagger';
import { CreateStudentAttendanceDto } from './create-student_attendance.dto';

export class UpdateStudentAttendanceDto extends PartialType(CreateStudentAttendanceDto) {}
