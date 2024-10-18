import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class ConnectionProxyError extends SystemError {
  constructor(name: string) {
    super(`Cant connect to proxy [${name}]`);
    this.code = 'connection/connect-proxy-error';
    this.name = 'ConnectionProxyError';
    this.kind = KindError.SYSTEM;
    this.details = {
      message: `Cant connect to proxy [${name}]`,
    };
  }
}
