import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
  Query,
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
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Director')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.DIRECTOR)
@Controller('director')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  //----------------------- ADD Staff -----------------------------//
  // @ApiOperation({ summary: 'Add Staff' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'succesfully added',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Staff is already exists',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Your Role is not as required',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Token is not found',
  // })
  // @HttpCode(HttpStatus.CREATED)
  // @Post('add-staff')
  // createStaff(@Body() createStaffDto: CreateUserDto) {
  //   return this.teachersService.createTeacher(createTeacherDto);
  // }

  @ApiOperation({ summary: 'Activate/Deactivate Staff' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'succesfully updated',
  })
  @Post('activate-staff/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  activateAdmin(@Param('id') id: string) {
    return this.directorService.activateAdmin(id);
  }

  @ApiOperation({ summary: 'Get all Staffs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully generated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Staffs are not found',
  })
  @Get('get-staffs/:q')
  @HttpCode(HttpStatus.OK)
  findAllStaffs(@Query() q: any) {
    return this.directorService.findAllStaffs(q?.page, q?.limit);
  }
}
