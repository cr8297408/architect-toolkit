import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class StrategyError extends SystemError {
  constructor(name: string, key: string) {
    super(`Cant find key [${key}] into strategy [${name}]`);
    this.code = 'system/strategy-not-supported-error';
    this.name = 'StrategyError';
    this.kind = KindError.SYSTEM;
    this.details = {
      message: `Cant find key [${key}] into strategy [${name}]`,
    };
  }
}
