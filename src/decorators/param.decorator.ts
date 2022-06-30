import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { Order } from 'common/constants';
import { PageOptions } from 'common/dto/page-options.dto';

export const Pagination = createParamDecorator<any, any, PageOptions>(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { page, take } = request.query;
    const order =
      request.query.order && request.query.order.toUpperCase() === 'DESC' ? Order.DESC : Order.ASC;

    return new PageOptions({ page: Number(page), take: Number(take), order });
  },
);
