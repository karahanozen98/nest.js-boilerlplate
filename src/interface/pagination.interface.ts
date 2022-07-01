import type { Order } from 'common/constants';

export interface IPageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface IPageOptions {
  readonly order: Order;
  readonly page: number;
  readonly take: number;
  get skip(): number;
  readonly q?: string;
}
