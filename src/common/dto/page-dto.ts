import type { IPaginatedResponse } from 'interface';

import type { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  readonly result: T[];

  readonly pagination: PageMetaDto;

  constructor(result: T[], meta: PageMetaDto) {
    this.result = result;
    this.pagination = meta;
  }

  toResponse(): IPaginatedResponse<T> {
    return {
      result: this.result,
      success: true,
      error: null,
      pagination: this.pagination,
    };
  }
}
