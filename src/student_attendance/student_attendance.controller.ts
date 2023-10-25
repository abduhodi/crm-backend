import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentAttendanceService } from './student_attendance.service';
import { CreateStudentAttendanceDto } from './dto/create-student_attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student_attendance.dto';
import { GroupStudentsService } from '../group_students/group_students.service';

@Controller('student-attendance')
export class StudentAttendanceController {
  constructor(
    private readonly studentAttendanceService: StudentAttendanceService,
  ) {}

  // @Post()
  // generateAttendance(@Body() createStudentAttendanceDto: CreateStudentAttendanceDto) {
  //   return this.studentAttendanceService.create(createStudentAttendanceDto);
  // }

  // @Get()
  // findAll() {
  //   return this.studentAttendanceService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.studentAttendanceService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateStudentAttendanceDto: UpdateStudentAttendanceDto,
  // ) {
  //   return this.studentAttendanceService.update(
  //     +id,
  //     updateStudentAttendanceDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.studentAttendanceService.remove(+id);
  // }
}
