import type { IPageMetaDto, IPaginatedResponse } from 'interface';

export class PageDto<T> {
  readonly result: T[];

  readonly pagination: IPageMetaDto;

  constructor(result: T[], meta: IPageMetaDto) {
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
