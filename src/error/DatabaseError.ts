import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class DatabaseError extends SystemError {
  constructor(message: string, code: string, errors?: any) {
    super(message);
    this.code = 'internal/database-error-' + code?.toLowerCase();
    this.name = code;
    this.kind = KindError.SYSTEM;
    this.details = {
      message,
      errors,
    };
  }
}
