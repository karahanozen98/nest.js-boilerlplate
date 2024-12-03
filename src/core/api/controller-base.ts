import type { IApiResponse, IApiPageResponse } from './api-response.interface';
import { PaginationResult } from './pagination';

export abstract class ControllerBase {
  ok<T>(result: PaginationResult<T>): IApiPageResponse<T>;

  ok<T = any>(result?: T | undefined): IApiResponse<T>;

  ok<T>(response?: T | PaginationResult<T>): IApiResponse | IApiPageResponse {
    return {
      result: response,
      success: true,
      message: 'Ok',
      pagination: response instanceof PaginationResult ? response?.pagination : undefined,
    };
  }
}
