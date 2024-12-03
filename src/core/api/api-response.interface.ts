import type { IPaginationDetails, PaginationResult } from './pagination';

export interface IApiResponse<T = any> {
  result: T | undefined;
  success: boolean;
  message: string;
}

export interface IApiPageResponse<T = any> {
  result: PaginationResult<T>;
  success: boolean;
  message: string;
  pagination: IPaginationDetails;
}
