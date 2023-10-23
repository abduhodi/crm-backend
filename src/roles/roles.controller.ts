import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { RolesService } from './roles.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ROLE } from '../enums/role.enum';

@ApiBearerAuth()
@ApiTags('Roles')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.DIRECTOR)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'get all roles' })
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
  @Get('all')
  findAll() {
    return this.rolesService.fetchAllRoles();
  }

  // @ApiOperation({ summary: 'create new role' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'successfully added new role',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'role is already exists',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'token is not found',
  // })
  // @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  // @HttpCode(HttpStatus.CREATED)
  // @Post('create-role')
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.createRole(createRoleDto);
  // }

  // @ApiOperation({ summary: 'find role by id' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'successfully returned',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Invalid role id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'token is not found',
  // })
  // @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  // @HttpCode(HttpStatus.OK)
  // @Get('single/:id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.fetchSingleRole(id);
  // }

  // @ApiOperation({ summary: 'find role by name' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'successfully returned',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'token is not found',
  // })
  // @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  // @HttpCode(HttpStatus.OK)
  // @Get('role/:name')
  // findOneByName(@Param('name') name: string) {
  //   return this.rolesService.fetchSingleRoleByName(name);
  // }

  // @ApiOperation({ summary: 'update role' })
  // @ApiResponse({
  //   status: HttpStatus.ACCEPTED,
  //   description: 'successfully updated role',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'role is already exists | invalid role id',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'token is not found',
  // })
  // @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  // @HttpCode(HttpStatus.ACCEPTED)
  // @Put('update/:id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.updateRole(id, updateRoleDto);
  // }

  // @ApiOperation({ summary: 'delete role' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'successfully deleted',
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'invalid id | role is not found',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'token is not found',
  // })
  // @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'access denied' })
  // @HttpCode(HttpStatus.OK)
  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.removeRole(id);
  // }
}
