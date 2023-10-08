import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AdminService } from './admins.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [AdminsController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminsModule {}
