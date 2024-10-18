import { type KindError } from '../domain';

export class SystemError extends Error {
  code: string;
  kind: KindError;
  statusCode?: number = 500;
  details?: {
    message: string;
    errors?: SystemError[];
  };
}
