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
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { Role } from '../roles/schemas/role.schema';
import { MarkAttendanceLessonDto } from './dto/mark-attendance.dto';
import { Request } from 'express';
import { UpdateLessonCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth()
@ApiTags('Lessons')
@UseGuards(AuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'create new lesson' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'successfully added new lesson',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'lesson is already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.createLesson(createLessonDto);
  }

  @Roles(ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER)
  @ApiOperation({ summary: 'get all lessons of single group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get('group/:id/:q')
  async findGroupLessons(@Param('id') id: string, @Query() q: any) {
    return this.lessonsService.findSingleGroupAllLessons(id, q?.page, q?.limit);
  }

  @Roles(ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER)
  @ApiOperation({ summary: 'get single lessons' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get('lesson/:id')
  findOneLesson(@Param('id') id: string) {
    return this.lessonsService.findLessonById(id);
  }

  @Roles(ROLE.TEACHER)
  @ApiOperation({ summary: 'set title lesson' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('lesson/attendance/:id')
  markAttendance(
    @Param('id') id: string,
    @Body() updateLessonDto: MarkAttendanceLessonDto,
    @Req() req: Request,
  ) {
    return this.lessonsService.markAttendance(id, updateLessonDto, req);
  }

  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'update single lessons' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('lesson/comment/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonCommentDto,
    @Req() req: Request,
  ) {
    return this.lessonsService.updateLessonComment(id, updateLessonDto, req);
  }
}
