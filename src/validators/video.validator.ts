import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export class ValidVideoValidator extends FileValidator {
  isValid(file?: any): boolean | Promise<boolean> {
    console.log(file);
    if (file.mimetype !== 'video/mp4') {
      return false;
    }
    if (file.size > 53000000) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: any): string {
    if (file.mimetype == 'video/mp4') {
      return 'Video type must be mp4 format';
    }
    if (file.size > 53000000) {
      return 'Video size must be less than 50 MB';
    }
  }
}
