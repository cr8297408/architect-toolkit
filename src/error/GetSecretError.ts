import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class GetSecretError extends SystemError {
  constructor() {
    super('Cant get secrets [AWS]');
    this.code = 'connection/get-secret-error';
    this.name = 'GetSecretError';
    this.kind = KindError.SYSTEM;
    this.details = {
      message: 'Cant get secrets [AWS]',
    };
  }
}
