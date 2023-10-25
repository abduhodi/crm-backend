import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

export class isObjectIdValidator implements ValidatorConstraintInterface {
  async validate(id: string): Promise<boolean> {
    if (isValidObjectId(id)) return true;
    return false;
  }
}
