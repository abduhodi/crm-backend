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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.register({
      global: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'data'),
      exclude: ['index.html'],
    }),
    UsersModule,
    AdminsModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    DirectorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
