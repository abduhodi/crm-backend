import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export class ValidFileValidator extends FileValidator {
  isValid(file?: any): boolean | Promise<boolean> {
    if (!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')) {
      return false;
    }
    if (file.size > 2097152) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: any): string {
    if (!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')) {
      return 'Image type must be png or jpeg';
    }
    if (file.size > 512000) {
      return 'Image size must be less than 500 KB';
    }
  }
}
