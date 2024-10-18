import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class FieldNotFoundError extends SystemError {
  constructor(value: string) {
    super(`Cant found field [${value}]`);
    this.code = 'validation/field-not-found-error';
    this.name = 'ValidationError';
    this.kind = KindError.VALIDATION;
    this.details = {
      message: `Cant found field [${value}]`,
    };
  }
}
