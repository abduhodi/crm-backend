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
import { TeachersService } from './teachers.service';
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
import { GroupTeachersService } from '../group_teachers/group_teachers.service';

@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
    private readonly groupTeachersService: GroupTeachersService,
  ) {}

  //----------------------- ADD TEACHER -----------------------------//
  @Roles(ROLE.DIRECTOR)
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

  //----------------------- FIND All TEACHERS -----------------------------//

  @Roles(ROLE.DIRECTOR, ROLE.ADMIN)
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

  @Roles(ROLE.DIRECTOR, ROLE.ADMIN)
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

  // ------------------------------FETCH TEACHER'S ALL GROUPS-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER)
  @ApiOperation({ summary: 'get all groups of single teacher' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'successfully returned',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @Get('get-groups/:id')
  findAllTeacherGroups(@Param('id') id: string) {
    return this.groupTeachersService.findAllGroups(id);
  }

  //----------------------- FIND TEACHER BY PHONE -----------------------------//
  @Roles(ROLE.DIRECTOR, ROLE.ADMIN)
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
  @Roles(ROLE.DIRECTOR, ROLE.ADMIN)
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
    return this.teachersService.searchTeacherByPhone(phone);
  }

  //----------------------- UPDATE TEACHER -----------------------------//
  @Roles(ROLE.DIRECTOR, ROLE.ADMIN)
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
  @Roles(ROLE.DIRECTOR)
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
