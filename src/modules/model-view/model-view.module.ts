import { Module } from '@nestjs/common';

import { ModelViewController } from './model-view.controller';

@Module({
  controllers: [ModelViewController],
})
export class ModelViewModule {}
