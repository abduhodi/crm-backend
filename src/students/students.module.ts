import { Module, forwardRef } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { TeachersModule } from '../teachers/teachers.module';
import { DirectorModule } from '../director/director.module';
import { CoursesModule } from '../courses/courses.module';
import { GroupsModule } from '../groups/groups.module';
import { RoomsModule } from '../rooms/rooms.module';
import { GroupStudentsModule } from '../group_students/group_students.module';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { RolesModule } from '../roles/roles.module';
import { LessonsModule } from '../lessons/lessons.module';
import { StudentAttendanceModule } from '../student_attendance/student_attendance.module';
import {
  GroupStudent,
  GroupStudentSchema,
} from '../group_students/schemas/group_student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
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
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
