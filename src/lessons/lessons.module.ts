import { Module, forwardRef } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';
import { DirectorModule } from '../director/director.module';
import { CoursesModule } from '../courses/courses.module';
import { GroupsModule } from '../groups/groups.module';
import { RoomsModule } from '../rooms/rooms.module';
import { GroupStudentsModule } from '../group_students/group_students.module';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { RolesModule } from '../roles/roles.module';
import { StudentAttendanceModule } from '../student_attendance/student_attendance.module';
import {
  StudentAttendance,
  StudentAttendanceSchema,
} from '../student_attendance/schemas/student_attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: StudentAttendance.name, schema: StudentAttendanceSchema },
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
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
