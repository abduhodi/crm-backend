import { Module, forwardRef } from '@nestjs/common';
import { CourseTeachersService } from './course_teachers.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseTeacher,
  CourseTeacherSchema,
} from './schemas/course_teacher.schema';
import { CoursesModule } from '../courses/courses.module';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseTeacher.name, schema: CourseTeacherSchema },
    ]),
    forwardRef(() => CoursesModule),
    forwardRef(() => TeachersModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CourseTeachersService],
  exports: [CourseTeachersService],
})
export class CourseTeachersModule {}
