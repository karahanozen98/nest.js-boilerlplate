import type { PageDto } from 'common/constants';
import type { PageMetaDto } from 'common/dto/page-meta.dto';

export interface IBaseResponse<T = any> {
  result: T | undefined;
  success: boolean;
  error: Record<string, any> | null;
}

export interface IPaginatedResponse<T = any> {
  result: T[];
  success: boolean;
  error: Record<string, any> | null;
  pagination: PageMetaDto;
}

export abstract class BaseController {
  ok<T>(pageDto: PageDto<T>): IPaginatedResponse<T>;

  ok<T = any>(result?: T | undefined): IBaseResponse<T>;

  ok(response?: any): any {
    if (response && response.pagination) {
      return response.toResponse();
    }

    return {
      result: response,
      success: true,
      error: null,
    };
  }
}
