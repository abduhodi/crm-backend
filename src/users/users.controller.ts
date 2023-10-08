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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SelfGuard } from '../guards/self.guard';

@ApiTags('Users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.STUDENT)
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SelfGuard)
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
  @Get('get-users/:id')
  findOneStudent(@Param('id') id: string) {
    return this.usersService.findOneStudent(id);
  }

  // @ApiOperation({ summary: 'Get Teacher by id' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'succesfully generated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Teacher is not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid id',
  // })
  // @Get(':id')
  // findOneTeacher(@Param('id') id: string) {
  //   return this.usersService.findOneTeacher(id);
  // }

  // @ApiOperation({ summary: 'update user' })
  // @ApiResponse({
  //   status: HttpStatus.ACCEPTED,
  //   description: 'succesfully updated',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'User is not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid id',
  // })
  // @Patch('update/:id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @ApiOperation({ summary: 'delete user' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'succesfully deleted',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'User is not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid id',
  // })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }
}
