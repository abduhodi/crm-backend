import { Module } from '@nestjs/common';
import { LessonVideosService } from './lesson_videos.service';
import { LessonVideosController } from './lesson_videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonVideo, LessonVideoSchema } from './schemas/lesson_video.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LessonVideo.name, schema: LessonVideoSchema },
    ]),
    UsersModule,
  ],
  controllers: [LessonVideosController],
  providers: [LessonVideosService],
  exports: [LessonVideosService],
})
export class LessonVideosModule {}
