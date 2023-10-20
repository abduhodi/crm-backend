import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
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
import { CourseTeachersService } from '../course_teachers/course_teachers.service';
import { CreateCourseTeacherDto } from '../course_teachers/dto/create-course_teacher.dto';

@ApiBearerAuth()
@ApiTags('Courses')
@UseGuards(AuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly courseTeachersService: CourseTeachersService,
  ) {}

  // ------------------------------CREATE COURSE-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'create new course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'successfully added new course',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'course is already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-course')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  // ------------------------------FETCH ALL COURSES-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch all courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get('all/:q')
  findAll(@Query() q: any) {
    return this.coursesService.fetchAllCourses(q?.page, q?.limit);
  }

  // ------------------------------FETCH SINGLE COURSE-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch single course by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.fetchSingleCourse(id);
  }

  // ------------------------------UPDATE COURSE-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'update course by id' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  // ------------------------------DELETE COURSE-----------------------------//

  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'delete course by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.coursesService.removeCourse(id);
  }

  // ------------------------------ADD TEACHER TO COURSE-----------------------------//

  @ApiOperation({ summary: 'Add Teacher to Course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully added',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('add-teacher')
  addTeacher(@Body() createCourseTeacherDto: CreateCourseTeacherDto) {
    return this.courseTeachersService.addTeacherToCourse(
      createCourseTeacherDto,
    );
  }

  @ApiOperation({ summary: 'Find All Teachers from All Courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully returned',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @HttpCode(HttpStatus.OK)
  @Get('all-teachers')
  findAllTeachersCourses() {
    return this.courseTeachersService.findAll();
  }

  @ApiOperation({ summary: 'Find All Teachers of One Course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully returned',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @HttpCode(HttpStatus.OK)
  @Get('all-teachers/:id')
  findAllTeachersOfCourse(@Param('id') id: string) {
    return this.courseTeachersService.findAllTeachersOfCourse(id);
  }

  // @ApiOperation({ summary: 'Update Teacher in Course' })
  // @ApiResponse({
  //   status: HttpStatus.ACCEPTED,
  //   description: 'succesfully updated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Your Role is not as required',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Token is not found',
  // })
  // @HttpCode(HttpStatus.ACCEPTED)
  // @Put('update')
  // updateTeacherCourses(@Body() updateCourseTeacherDto: CreateCourseTeacherDto) {
  //   return this.courseTeachersService.update(updateCourseTeacherDto);
  // }

  @ApiOperation({ summary: 'Delete Teacher from Course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @HttpCode(HttpStatus.OK)
  @Delete('delete-teacher')
  removeTeacher(@Body() removeDto: CreateCourseTeacherDto) {
    return this.courseTeachersService.removeTeacherFromCourse(removeDto);
  }
}
