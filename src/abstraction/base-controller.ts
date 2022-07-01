import { PageDto } from 'common/constants';
import type { IBaseResponse, IPaginatedResponse } from 'interface';

export abstract class BaseController {
  ok<T>(pageDto: PageDto<T>): IPaginatedResponse<T>;

  ok<T = any>(result?: T | undefined): IBaseResponse<T>;

  ok<T>(response?: T | PageDto<T>): any {
    if (response instanceof PageDto) {
      return response.toResponse();
    }

    return {
      result: response,
      success: true,
      error: null,
    };
  }
}
