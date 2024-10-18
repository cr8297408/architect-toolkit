import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class ConexionError extends SystemError {
  constructor(name: string) {
    super(`Cant connect to proxy [${name}]`);
    this.code = 'connection/connect-proxy-error';
    this.name = 'ConexionError';
    this.kind = KindError.SYSTEM;
  }
}
