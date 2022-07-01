import type { IPageOptions } from 'interface';

import { EnumFieldOptional, NumberFieldOptional, StringFieldOptional } from '../../decorators';
import { Order } from '../constants';

export class PageOptions implements IPageOptions {
  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly order: Order = Order.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @StringFieldOptional()
  readonly q?: string;

  constructor({
    page = 1,
    take = 10,
    order = Order.ASC,
  }: {
    page: number;
    take: number;
    order: Order;
  }) {
    this.page = page;
    this.take = take;
    this.order = order;
  }
}
