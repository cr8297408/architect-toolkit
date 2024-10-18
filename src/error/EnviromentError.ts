import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class EnvironmentError extends SystemError {
  constructor(envName: string) {
    super(`Environment variable: ${envName} is undefined`);
    this.code = 'environment/set-variable-error';
    this.name = 'EnvironmentError';
    this.kind = KindError.SYSTEM;
    this.details = {
      message: `Environment variable: ${envName} is undefined`,
    };
  }
}
