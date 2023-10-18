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
import { ROLE } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@ApiBearerAuth()
@ApiTags('Rooms')
@UseGuards(AuthGuard, RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // ------------------------------CREATE ROOM-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'create new room' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'successfully added new room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'room is already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is not found',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-room')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  // ------------------------------FETCH ALL ROOMS-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch all rooms' })
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
    return this.roomsService.fetchAllRooms(q?.page, q?.limit);
  }

  // ------------------------------FETCH SINGLE ROOM-----------------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'fetch single room by id' })
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
    return this.roomsService.fetchSingleRoom(id);
  }

  // ------------------------------UPDATE ROOM-----------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'update room by id' })
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
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  // ------------------------------DELETE ROOM----------------------//
  @Roles(ROLE.ADMIN, ROLE.DIRECTOR)
  @ApiOperation({ summary: 'delete room by id' })
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
    return this.roomsService.removeRoom(id);
  }
}
