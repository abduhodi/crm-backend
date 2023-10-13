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
} from '@nestjs/common';
import { DirectorService } from './director.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Director')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.DIRECTOR)
@Controller('director')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @ApiOperation({ summary: 'Add new Admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully added',
  })
  @Post('add-admin')
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.directorService.createAdmin(createUserDto);
  }

  @ApiOperation({ summary: 'Activate/Deactivate Admin' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'succesfully updated',
  })
  @Post('activate-admin/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  activateAdmin(@Param('id') id: string) {
    return this.directorService.activateAdmin(id);
  }

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
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.directorService.createTeacher(createUserDto, image);
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
    return this.directorService.findAllStudents();
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
    return this.directorService.findAllTeachers();
  }

  @ApiOperation({ summary: 'Get all Admins' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admins are not found',
  })
  @Get('get-admins')
  @HttpCode(HttpStatus.OK)
  findAllAdmins() {
    return this.directorService.findAllAdmins();
  }

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
    return this.directorService.findOneAdmin(id);
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
    return this.directorService.findOneStudent(id);
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
    return this.directorService.findOneTeacher(id);
  }
}
