import { Module, forwardRef } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { CourseTeachersModule } from '../course_teachers/course_teachers.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => CourseTeachersModule),
    forwardRef(() => CoursesModule),
  ],
  controllers: [DirectorController],
  providers: [DirectorService],
})
export class DirectorModule {}
