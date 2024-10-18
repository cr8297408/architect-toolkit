import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class ValidationPayloadError extends SystemError {
  constructor(value: string, details?: any) {
    super(`Cant found payload [${value}]`);
    this.code = 'validation/payload-unprocessable-error';
    this.name = 'ValidationError';
    this.kind = KindError.VALIDATION;
    this.details = {
      message: `Cant found payload [${value}]`,
      errors: details,
    };
  }
}
