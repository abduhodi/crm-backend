import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { DirectorModule } from './director/director.module';
import { AdminsModule } from './admins/admins.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoursesModule } from './courses/courses.module';
import { GroupsModule } from './groups/groups.module';
import { RoomsModule } from './rooms/rooms.module';
import { GroupStudentsModule } from './group_students/group_students.module';
import { CourseTeachersModule } from './course_teachers/course_teachers.module';
import { GroupTeachersModule } from './group_teachers/group_teachers.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.register({
      global: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'data'),
      serveRoot: '/api',
      // exclude: ['index.html'],
    }),
    UsersModule,
    AdminsModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    DirectorModule,
    CoursesModule,
    GroupsModule,
    RoomsModule,
    GroupStudentsModule,
    CourseTeachersModule,
    GroupTeachersModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
