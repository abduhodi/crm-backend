import { Module } from '@nestjs/common';
import { GroupStudentsController } from './group_students.controller';
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
    UsersModule,
    AdminsModule,
    GroupsModule,
  ],
  controllers: [GroupStudentsController],
  providers: [GroupStudentsService],
  exports: [GroupStudentsService],
})
export class GroupStudentsModule {}
