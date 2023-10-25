import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { GroupsService } from './groups.service';
import { ROLE } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetFreeRoomDto } from './dto/get-free-room.dto';
import { GroupStudentsService } from '../group_students/group_students.service';
import { CreateGroupStudentDto } from '../group_students/dto/create-group_student.dto';
import { GroupTeachersService } from '../group_teachers/group_teachers.service';
import { CreateGroupTeacherDto } from '../group_teachers/dto/create-group_teacher.dto';

@ApiBearerAuth()
@ApiTags('Groups')
@UseGuards(AuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly groupStudentsService: GroupStudentsService,
    private readonly groupTeachersService: GroupTeachersService,
  ) {}

  // ------------------------------CREATE GROUP-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'create new group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'successfully added new group',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'group is already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-group')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(createGroupDto);
  }

  // ------------------------------FETCH ALL GROUPS-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch all groups' })
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
    return this.groupsService.fetchAllGroups(q?.page, q?.limit);
  }

  // ------------------------------FETCH ALL AVAILABLE ROOM-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch all avaliable rooms' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.OK)
  @Post('available-rooms')
  findAllFreeRooms(@Body() getFreeRoomDto: GetFreeRoomDto) {
    return this.groupsService.fetchAvailableRooms(getFreeRoomDto);
  }

  // ------------------------------FETCH SINGLE GROUP-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch single group by id' })
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
    return this.groupsService.fetchSingleGroup(id);
  }

  // ------------------------------UPDATE GROUP-----------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'update group by id' })
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
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.updateGroup(id, updateGroupDto);
  }

  // ------------------------------DELETE GROUP----------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'delete group by id' })
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
    return this.groupsService.removeGroup(id);
  }

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
  addStudent(@Body() createGroupStudentDto: CreateGroupStudentDto) {
    return this.groupStudentsService.addStudentToGroup(createGroupStudentDto);
  }

  // ------------------------------FETCH ALL GROUP STUDENTS-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'get all students of single group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get('all-students/:id')
  findAllStudentsGroups(@Param('id') id: string) {
    return this.groupStudentsService.fetchGroupAllStudents(id);
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
  @ApiOperation({ summary: 'delete student from group' })
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
  @Delete('delete-student')
  removeStudent(@Body() deleteDto: CreateGroupStudentDto) {
    return this.groupStudentsService.removeStudentFromGroup(deleteDto);
  }

  // ------------------------------ADD TEACHER TO GROUP-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'add teacher to group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'teacher successfully added to group',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid Group id | Group is not found | Teacher is not found | Teacher is already joined to this group',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.CREATED)
  @Post('add-teacher')
  addTeacher(@Body() createGroupTeacherDto: CreateGroupTeacherDto) {
    return this.groupTeachersService.addTeacherToGroup(createGroupTeacherDto);
  }

  // ------------------------------FETCH ALL GROUP TEACHERS-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'get all group teachers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get('get-teachers/:id')
  findAllGroupTeachers(@Param('id') id: string) {
    return this.groupTeachersService.findAllTeachers(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupTeachersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGroupStudentDto: UpdateGroupStudentDto,
  // ) {
  //   return this.groupTeachersService.update(+id, updateGroupStudentDto);
  // }

  // ------------------------------DELETE TEACHER FROM GROUP----------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'delete teacher from group' })
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
  @Delete('delete-teacher')
  removeTeacher(@Body() deleteDto: CreateGroupTeacherDto) {
    return this.groupTeachersService.removeTeacherFromGroup(deleteDto);
  }
}
