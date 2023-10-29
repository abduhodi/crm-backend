import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { StudentsService } from './students.service';
import { SelfGuard } from '../guards/self.guard';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  //----------------------- ADD STUDENT -----------------------------//

  @ApiOperation({ summary: 'Add Student' })
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
  @Post('create-student')
  create(@Body() createStudentDto: CreateUserDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  //----------------------- FIND All STUDENT -----------------------------//

  @ApiOperation({ summary: 'Find All Student' })
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
    return this.studentService.findAllStudents(q?.page, q?.limit);
  }

  //----------------------- FIND ONE STUDENT -----------------------------//

  @ApiOperation({ summary: 'Find One Student' })
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
    return this.studentService.findOneStudent(id);
  }

  //----------------------- FIND ONE STUDENT ALL GROUPS -----------------------------//

  @ApiOperation({ summary: 'Find One Student all groups' })
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
  @Get('groups/:id')
  findStudentGroups(@Param('id') id: string) {
    return this.studentService.findOneStudentGroups(id);
  }

  //----------------------- FIND STUDENT BY PHONE -----------------------------//

  @ApiOperation({ summary: 'Find Student by phone' })
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
    return this.studentService.findOneStudentByPhone(phone);
  }

  //----------------------- SEARCH STUDENT BY PHONE -----------------------------//

  @ApiOperation({ summary: 'Search Student by phone' })
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
  @ApiBody({
    schema: {
      example: { phone: '4567' },
      required: ['phone'],
      description: 'type last digits of phone number',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('search')
  searchByPhone(@Body('phone') phone: string) {
    return this.studentService.searchStudentByPhone(phone);
  }

  //----------------------- UPDATE STUDENT -----------------------------//

  @ApiOperation({ summary: 'Update Student' })
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
  update(@Param() id: string, @Body() updateStudentDto: UpdateUserDto) {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  //----------------------- DELETE STUDENT -----------------------------//

  @ApiOperation({ summary: 'Delete Student' })
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
    return this.studentService.deleteStudent(id);
  }
}
