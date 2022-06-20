import { RequestMethod } from '@nestjs/common';

export const globalPrefixExcludeList = [
  { path: '/', method: RequestMethod.ALL },
  { path: '/view', method: RequestMethod.ALL },
  { path: '/view/about', method: RequestMethod.ALL },
];
