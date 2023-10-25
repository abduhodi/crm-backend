import { Module, forwardRef } from '@nestjs/common';
import { GroupStudentsService } from './group_students.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GroupStudent,
  GroupStudentSchema,
} from './schemas/group_student.schema';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { GroupsModule } from '../groups/groups.module';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';
import { DirectorModule } from '../director/director.module';
import { CoursesModule } from '../courses/courses.module';
import { RoomsModule } from '../rooms/rooms.module';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { RolesModule } from '../roles/roles.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StudentAttendanceModule } from '../student_attendance/student_attendance.module';

@Module({
  imports: [
    MongooseModule.forFeature([
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
  providers: [GroupStudentsService],
  exports: [GroupStudentsService],
})
export class GroupStudentsModule {}
