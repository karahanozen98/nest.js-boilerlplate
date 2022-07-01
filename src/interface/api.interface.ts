import type { Order } from 'common/constants';
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

export interface IPageOptions {
  readonly order: Order;
  readonly page: number;
  readonly take: number;
  get skip(): number;
  readonly q?: string;
}
