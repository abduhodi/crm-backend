import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonVideoDto } from './dto/create-lesson_video.dto';
import { UpdateLessonVideoDto } from './dto/update-lesson_video.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  LessonVideo,
  LessonVideoDocument,
} from './schemas/lesson_video.schema';
import { Model, isValidObjectId } from 'mongoose';
import { uploadFile } from '../utils/file-upload';

@Injectable()
export class LessonVideosService {
  constructor(
    @InjectModel(LessonVideo.name)
    private readonly lessonVideoModel: Model<LessonVideoDocument>,
  ) {}

  //----------------------- UPLOAD VIDEO -----------------------------//

  async uploadVideo(dto: CreateLessonVideoDto, video: Express.Multer.File) {
    try {
      if (!isValidObjectId(dto.lesson)) {
        throw new BadRequestException('Invalid Lesson Id');
      }
      const exist = await this.lessonVideoModel.findOne({ title: dto.title });
      if (exist) {
        throw new BadRequestException('Dublicate title');
      }
      const filename = await uploadFile(video);
      const file = await this.lessonVideoModel.create({
        title: dto.title,
        lesson: dto.lesson,
        url: filename,
        type: video.mimetype,
        size: video.size,
      });
      return file;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllVideos() {
    try {
      return this.lessonVideoModel.find().populate('lesson');
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findOneLessonVideo(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid Lesson id');
      }
      return this.lessonVideoModel.find({ lesson: id }).populate('lesson');
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async removeVideo(id: string) {
    try {
      if (isValidObjectId(id)) {
        throw new BadRequestException('Invalid Lesson id');
      }
      await this.lessonVideoModel.findByIdAndDelete(id);
      return { message: 'deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
