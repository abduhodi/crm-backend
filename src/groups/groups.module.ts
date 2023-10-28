import { Module, forwardRef } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { CoursesModule } from '../courses/courses.module';
import { GroupStudentsModule } from '../group_students/group_students.module';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';
import { TeachersModule } from '../teachers/teachers.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StudentAttendanceModule } from '../student_attendance/student_attendance.module';
import { AdminsModule } from '../admins/admins.module';
import { StudentsModule } from '../students/students.module';
import { DirectorModule } from '../director/director.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { RolesModule } from '../roles/roles.module';
import {
  GroupTeacher,
  GroupTeacherSchema,
} from '../group_teachers/schemas/group_teacher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupTeacher.name, schema: GroupTeacherSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => StudentsModule),
    forwardRef(() => TeachersModule),
    forwardRef(() => DirectorModule),
    forwardRef(() => CoursesModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => GroupStudentsModule),
    forwardRef(() => GroupTeachersModule),
    forwardRef(() => CourseTeachersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => LessonsModule),
    forwardRef(() => StudentAttendanceModule),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
