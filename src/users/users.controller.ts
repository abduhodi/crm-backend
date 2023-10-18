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
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidFileValidator } from '../validators/file.validator';
import { Request } from 'express';

@ApiTags('Uploads')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //-------------- UPLOAD IMAGE --------------------//

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
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload-image')
  @HttpCode(HttpStatus.CREATED)
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ValidFileValidator({})],
      }),
    )
    image: Express.Multer.File,
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
}
