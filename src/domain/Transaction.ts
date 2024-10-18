import { Domain } from './Domain';
import { Response } from './Response';
import { StatusCode } from './StatusCode';

export interface Transaction extends Domain {
  parent?: string;
  service: string;
  action: string;
  createdAt?: Date;
  status: StatusCode;
  payload: string;
  response?: Response;
  subTransactions?: Array<Transaction>;
}
