import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'phone', async: false })
@Injectable()
export class PhoneValidator implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const isPhone = /^\+998\d{9}$/.test(value);
    if (isPhone) return true;
    return false;
  }
}
