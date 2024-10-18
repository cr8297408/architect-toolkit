import type { StatusCode } from './StatusCode';
import { type KindError } from '../domain';
import { SystemError } from '../error';

export interface IResponseDataService<T> {
  status: Status;
  data?: T;
  error?: SystemError;
}

export interface IResponseDataServiceList<T> extends IResponseDataService<T> {
  pagination: Pagination;
}

export type Pagination = PaginationCursor | PaginationSkip;

export interface PaginationCursor {
  cursor: string;
}

export interface PaginationSkip {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Status {
  code: StatusCode;
  message: string;
  kind?: KindError;
}
