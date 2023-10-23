import { Module, forwardRef } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { TeachersController } from './teachers.controller';
import { GroupTeachersModule } from '../group_teachers/group_teachers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => GroupTeachersModule),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
