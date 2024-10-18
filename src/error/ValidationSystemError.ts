import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class ValidationSystemError extends SystemError {
  constructor(value: string, details?: any) {
    super(value);
    this.code = 'validation/system-error';
    this.name = 'ValidationError';
    this.kind = KindError.CLIENT;
    this.details = {
      message: `[${value}]`,
      errors: details,
    };
  }
}
