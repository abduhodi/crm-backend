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
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { CreateCourseTeacherDto } from '../course_teachers/dto/create-course_teacher.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  //----------------------- ADD TEACHER -----------------------------//

  @ApiOperation({ summary: 'Add Teacher' })
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
  create(@Body() createTeacherDto: CreateUserDto) {
    return this.teachersService.createTeacher(createTeacherDto);
  }

  //----------------------- FIND All TEACHER -----------------------------//

  @ApiOperation({ summary: 'Find All Teachers' })
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
  @Get('all/:q')
  findAll(@Query() q: any) {
    return this.teachersService.findAllTeachers(q?.page, q?.limit);
  }

  //----------------------- FIND ONE TEACHER -----------------------------//

  @ApiOperation({ summary: 'Find One Teacher' })
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
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.teachersService.findOneTeacher(id);
  }

  //----------------------- FIND TEACHER BY PHONE -----------------------------//

  @ApiOperation({ summary: 'Find Teacher by phone' })
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
  @Post('by-phone')
  findByPhone(@Body('phone') phone: string) {
    return this.teachersService.findTeacherByPhone(phone);
  }

  //----------------------- SEARCH TEACHER BY PHONE -----------------------------//

  @ApiOperation({ summary: 'Search Teacher by phone' })
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
  @Post('search')
  searchByPhone(@Body('phone') phone: string) {
    return this.teachersService.searchTeacherByPhone(phone);
  }

  //----------------------- UPDATE TEACHER -----------------------------//

  @ApiOperation({ summary: 'Update Teacher' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'succesfully updated',
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
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('update/:id')
  update(@Param() id: string, @Body() updateTeacherDto: UpdateUserDto) {
    return this.teachersService.updateTeacher(id, updateTeacherDto);
  }

  //----------------------- DELETE TEACHER -----------------------------//

  @ApiOperation({ summary: 'Delete Teacher' })
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
  @Delete('delete/:id')
  remove(@Param() id: string) {
    return this.teachersService.removeTeacher(id);
  }
}
