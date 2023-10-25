import { Module, forwardRef } from '@nestjs/common';
import { GroupTeachersService } from './group_teachers.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GroupTeacher,
  GroupTeacherSchema,
} from './schemas/group_teacher.schema';
import { GroupsModule } from '../groups/groups.module';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { AdminsModule } from '../admins/admins.module';
import { StudentsModule } from '../students/students.module';
import { DirectorModule } from '../director/director.module';
import { CoursesModule } from '../courses/courses.module';
import { RoomsModule } from '../rooms/rooms.module';
import { GroupStudentsModule } from '../group_students/group_students.module';
import { RolesModule } from '../roles/roles.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StudentAttendanceModule } from '../student_attendance/student_attendance.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupTeacher.name, schema: GroupTeacherSchema },
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
  providers: [GroupTeachersService],
  exports: [GroupTeachersService],
})
export class GroupTeachersModule {}
