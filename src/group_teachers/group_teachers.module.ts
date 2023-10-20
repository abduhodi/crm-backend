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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupTeacher.name, schema: GroupTeacherSchema },
    ]),
    forwardRef(() => GroupsModule),
    forwardRef(() => TeachersModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CourseTeachersModule),
  ],
  providers: [GroupTeachersService],
  exports: [GroupTeachersService],
})
export class GroupTeachersModule {}
