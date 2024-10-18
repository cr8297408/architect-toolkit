import { SystemError } from './SystemError';
import { KindError } from '../domain';

export class QueryError extends SystemError {
  constructor(query: string, params: Array<string | number>) {
    super(`Cant exec query [${query}], [${params.toString()}]`);
    this.code = 'data/exec-query-error';
    this.name = 'DatabaseError';
    this.kind = KindError.SYSTEM;
  }
}
