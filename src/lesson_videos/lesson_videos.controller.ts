import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  ParseFilePipe,
} from '@nestjs/common';
import { LessonVideosService } from './lesson_videos.service';
import { CreateLessonVideoDto } from './dto/create-lesson_video.dto';
import { UpdateLessonVideoDto } from './dto/update-lesson_video.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { VideoUploadDto } from './dto/upload-video.dto';
import { ValidVideoValidator } from '../validators/video.validator';

@ApiBearerAuth()
@ApiTags('Lesson Videos')
@UseGuards(AuthGuard)
@Controller('lesson-videos')
export class LessonVideosController {
  constructor(private readonly lessonVideosService: LessonVideosService) {}

  // ------------------------------UPLOAD VIDEO-----------------------------//
  @Roles(ROLE.TEACHER)
  @ApiOperation({ summary: 'upload new video' })
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully uploaded new video',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.OK)
  @Post('upload')
  uploadVideo(
    @Body() dto: CreateLessonVideoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ValidVideoValidator({})],
      }),
    )
    video: any,
  ) {
    return this.lessonVideosService.uploadVideo(dto, video);
  }

  // ------------------------------ GET ALL VIDEOS OF ALL LESSONS -----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'get all lessons all videos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'bad request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get()
  findAllVideos() {
    return this.lessonVideosService.findAllVideos();
  }

  // ------------------------------ GET ALL VIDEOS OF ALL LESSONS -----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER)
  @ApiOperation({ summary: "get one lesson's all videos" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid lesson id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get(':id')
  findOneLessonVieos(@Param('id') id: string) {
    return this.lessonVideosService.findOneLessonVideo(id);
  }

  // ------------------------------ GET ALL VIDEOS OF ALL LESSONS -----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'get one video ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid video id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  removeVideo(@Param('id') id: string) {
    return this.lessonVideosService.removeVideo(id);
  }
}
