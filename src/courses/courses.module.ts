import { Module, forwardRef } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { UsersModule } from '../users/users.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { AdminsModule } from '../admins/admins.module';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';
import { DirectorModule } from '../director/director.module';
import { GroupsModule } from '../groups/groups.module';
import { RoomsModule } from '../rooms/rooms.module';
import { GroupStudentsModule } from '../group_students/group_students.module';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';
import { RolesModule } from '../roles/roles.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StudentAttendanceModule } from '../student_attendance/student_attendance.module';
import { Group, GroupSchema } from '../groups/schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Group.name, schema: GroupSchema },
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
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
