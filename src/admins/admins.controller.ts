import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Param,
  Res,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admins.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SelfGuard } from '../guards/self.guard';
import { Response, query } from 'express';

@Controller('admin')
@ApiTags('Admins')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminsController {
  constructor(private readonly adminsService: AdminService) {}

  //-------------- ADD NEW STUDENT --------------------//

  @ApiOperation({ summary: 'Add new Student' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully added',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Post('add-student')
  @HttpCode(HttpStatus.CREATED)
  createStudent(@Body() createUserDto: CreateUserDto) {
    return this.adminsService.createStudent(createUserDto);
  }

  //-------------- UPDATE STUDENT --------------------//

  @ApiOperation({ summary: 'Update Student' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'succesfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Student is not found or invalid id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Put('update-student/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.adminsService.updateUser(id, createUserDto);
  }

  //-------------- GET ALL STUDENTS --------------------//

  @ApiOperation({ summary: 'Get all Students' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Get('get-students/:q')
  @HttpCode(HttpStatus.OK)
  findAllStudents(@Query() q: any, @Res({ passthrough: true }) res: Response) {
    return this.adminsService.findAllStudents(q?.page, q?.limit, res);
  }

  //-------------- GET STUDENT BY ID --------------------//

  @ApiOperation({ summary: 'Get Student by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Get('get-student/:id')
  findOneStudent(@Param('id') id: string) {
    return this.adminsService.findOneStudent(id);
  }

  //-------------- DELETE STUDENT BY ID --------------------//

  @ApiOperation({ summary: 'Delete Student by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Delete('delete-student/:id')
  deleteStudent(@Param('id') id: string) {
    return this.adminsService.deleteUser(id);
  }

  //-------------- GET ALL TEACHERS --------------------//

  @ApiOperation({ summary: 'Get all Teachers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'teachers list is empty',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Your Role is not as required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Get('get-teachers/:q')
  @HttpCode(HttpStatus.OK)
  findAllTeachers(@Query() q: any, @Res({ passthrough: true }) res: Response) {
    return this.adminsService.findAllTeachers(q?.page, q?.limit, res);
  }

  //-------------- GET TEACHER BY ID --------------------//

  @ApiOperation({ summary: 'Get Teacher by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Teacher is not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Get('get-teacher/:id')
  findOneTeacher(@Param('id') id: string) {
    return this.adminsService.findOneTeacher(id);
  }

  //-------------- GET ADMIN BY ID --------------------//

  @UseGuards(SelfGuard)
  @ApiOperation({ summary: 'Get Admin by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Admin is not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "You don't have access",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id',
  })
  @Get('get-admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.adminsService.findOneAdmin(id);
  }
}
