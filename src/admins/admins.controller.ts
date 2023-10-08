import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admins.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SelfGuard } from '../guards/self.guard';

@Controller('admin')
@ApiTags('Admins')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminsController {
  constructor(private readonly adminsService: AdminService) {}

  @ApiOperation({ summary: 'Add new Teacher' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully added',
  })
  @ApiConsumes('multipart/form-data')
  @Post('add-teacher')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  createTeacher(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminsService.createTeacher(createUserDto, image);
  }

  @ApiOperation({ summary: 'Add new Student' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully added',
  })
  @ApiConsumes('multipart/form-data')
  @Post('add-student')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  createStudent(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminsService.createStudent(createUserDto, image);
  }

  @ApiOperation({ summary: 'Get all Students' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Students are not found',
  })
  @Get('get-students')
  @HttpCode(HttpStatus.OK)
  findAllStudents() {
    return this.adminsService.findAllStudents();
  }

  @ApiOperation({ summary: 'Get all Teachers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teachers are not found',
  })
  @Get('get-teachers')
  @HttpCode(HttpStatus.OK)
  findAllTeachers() {
    return this.adminsService.findAllTeachers();
  }

  @UseGuards(SelfGuard)
  @ApiOperation({ summary: 'Get Admin by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin is not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @Get('get-admins/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.adminsService.findOneAdmin(id);
  }

  @ApiOperation({ summary: 'Get Student by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student is not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @Get('get-students/:id')
  findOneStudent(@Param('id') id: string) {
    return this.adminsService.findOneStudent(id);
  }

  @ApiOperation({ summary: 'Get Teacher by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher is not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @Get('get-teachers/:id')
  findOneTeacher(@Param('id') id: string) {
    return this.adminsService.findOneTeacher(id);
  }
}
