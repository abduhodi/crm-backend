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
  ParseFilePipe,
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidFileValidator } from '../validators/file.validator';
import { Request } from 'express';
import { FileUploadDto } from './dto/file-upload.dto';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Profile')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //-------------- UPLOAD IMAGE --------------------//

  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image (png, jpeg)*',
    type: FileUploadDto,
  })
  @ApiOperation({ summary: 'Upload new image' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'succesfully uploaded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid image',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Post('upload-image')
  @HttpCode(HttpStatus.CREATED)
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ValidFileValidator({})],
      }),
    )
    image: FileUploadDto,
  ) {
    return this.usersService.uploadImage(image);
  }

  //-------------- GET PROFILE INFO --------------------//

  @ApiOperation({ summary: 'get profile info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'succesfully returned',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Get('info')
  @HttpCode(HttpStatus.OK)
  getProfileInfo(@Req() req: Request) {
    return this.usersService.getProfileInfo(req);
  }

  //-------------- UPDATE PROFILE --------------------//

  @ApiOperation({ summary: 'Update Profile' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'succesfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User is not found or invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Put('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req, updateProfileDto);
  }

  //-------------- CHANGE PASSWORD --------------------//

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'succesfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User is not found or invalid id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is not found',
  })
  @Post('change-password')
  @HttpCode(HttpStatus.ACCEPTED)
  changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req, changePasswordDto);
  }
}
