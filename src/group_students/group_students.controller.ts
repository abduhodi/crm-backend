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
} from '@nestjs/common';
import { GroupStudentsService } from './group_students.service';
import { CreateGroupStudentDto } from './dto/create-group_student.dto';
import { UpdateGroupStudentDto } from './dto/update-group_student.dto';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';

@ApiBasicAuth()
@ApiTags('GroupStudents')
@UseGuards(AuthGuard, RolesGuard)
@Controller('group-students')
export class GroupStudentsController {
  constructor(private readonly groupStudentsService: GroupStudentsService) {}

  // ------------------------------ADD STUDENT TO GROUP-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'add student to group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'student successfully added to group',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid Group id | Group is not found | Student is not found | Student is already joined to this group',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.CREATED)
  @Post('add-student')
  create(@Body() createGroupStudentDto: CreateGroupStudentDto) {
    return this.groupStudentsService.addStudentToGroup(createGroupStudentDto);
  }

  // ------------------------------FETCH ALL GROUP STUDENTS-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch all group students' })
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
    return this.groupStudentsService.fetchAll(q?.page, q?.limit);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupStudentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGroupStudentDto: UpdateGroupStudentDto,
  // ) {
  //   return this.groupStudentsService.update(+id, updateGroupStudentDto);
  // }

  // ------------------------------DELETE STUDENT FROM GROUP----------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'student deleted from group' })
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
  remove(@Body() deleteDto: CreateGroupStudentDto) {
    return this.groupStudentsService.removeStudentFromGroup(deleteDto);
  }
}
