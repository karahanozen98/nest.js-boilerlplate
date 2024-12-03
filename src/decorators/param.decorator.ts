import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { Order } from 'common/constants';
import { PageOptions } from 'core/api';

export const Pagination = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const page = Number.isNaN(Number(request.query.page)) ? 1 : Number(request.query.page);
  const take = Number.isNaN(Number(request.query.take)) ? 10 : Number(request.query.take);
  const order =
    request.query.order && request.query.order.toUpperCase() === 'DESC' ? Order.DESC : Order.ASC;

  return new PageOptions({ page, take, order });
});
