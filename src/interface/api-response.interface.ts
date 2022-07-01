import type { IPageMetaDto } from './pagination.interface';

export interface IBaseResponse<T = any> {
  result: T | undefined;
  success: boolean;
  error: Record<string, any> | null;
}

export interface IPaginatedResponse<T = any> {
  result: T[];
  success: boolean;
  error: Record<string, any> | null;
  pagination: IPageMetaDto;
}
