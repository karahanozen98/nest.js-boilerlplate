import { Order } from 'common/constants';
import { ApiProperty } from '@nestjs/swagger';
import { EnumFieldOptional, NumberFieldOptional, StringFieldOptional } from '../../decorators';

export interface IPaginationDetails {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export interface IPaginationOptions {
  readonly order: Order;
  readonly page: number;
  readonly take: number;
  get skip(): number;
  readonly q?: string;
}

interface IPageMetaDtoParameters {
  pageOptions: IPaginationOptions;
  itemCount: number;
}

export class PageOptions implements IPaginationOptions {
  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly order: Order = Order.ASC;

  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly test: Order = Order.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 110,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    default: 5,
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

export class PaginationDetails implements IPaginationDetails {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptions, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PaginationResult<T> {
  result: T[];
  pagination: IPaginationDetails;

  constructor(result: T[], pagination: IPaginationDetails) {
    this.result = result;
    this.pagination = pagination;
  }
}
