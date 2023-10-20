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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupStudent.name, schema: GroupStudentSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => GroupsModule),
  ],
  providers: [GroupStudentsService],
  exports: [GroupStudentsService],
})
export class GroupStudentsModule {}
