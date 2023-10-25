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
import { GroupStudentsService } from '../group_students/group_students.service';
import { GroupsModule } from '../groups/groups.module';
import { RoomsModule } from '../rooms/rooms.module';
import { CoursesModule } from '../courses/courses.module';
import { TeachersModule } from '../teachers/teachers.module';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';
import { LessonsModule } from '../lessons/lessons.module';
import { AdminsModule } from '../admins/admins.module';
import { StudentsModule } from '../students/students.module';
import { DirectorModule } from '../director/director.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { RolesModule } from '../roles/roles.module';
import {
  GroupStudent,
  GroupStudentSchema,
} from '../group_students/schemas/group_student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentAttendance.name, schema: StudentAttendanceSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => StudentsModule),
    forwardRef(() => TeachersModule),
    forwardRef(() => DirectorModule),
    forwardRef(() => CoursesModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => GroupStudentsModule),
    forwardRef(() => GroupTeachersModule),
    forwardRef(() => CourseTeachersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => LessonsModule),
    forwardRef(() => StudentAttendanceModule),
  ],
  controllers: [StudentAttendanceController],
  providers: [StudentAttendanceService],
  exports: [StudentAttendanceService],
})
export class StudentAttendanceModule {}
