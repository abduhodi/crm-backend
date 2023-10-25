import { Module, forwardRef } from '@nestjs/common';
import { StudentAttendanceService } from './student_attendance.service';
import { StudentAttendanceController } from './student_attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StudentAttendance,
  StudentAttendanceSchema,
} from './schemas/student_attendance.schema';
import { UsersModule } from '../users/users.module';
import { GroupStudentsModule } from '../group_students/group_students.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentAttendance.name, schema: StudentAttendanceSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => GroupStudentsModule),
  ],
  controllers: [StudentAttendanceController],
  providers: [StudentAttendanceService],
  exports: [StudentAttendanceService],
})
export class StudentAttendanceModule {}
