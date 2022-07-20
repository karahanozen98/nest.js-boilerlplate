import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ModelViewModule } from './model-view/model-view.module';
import { SampleModule } from './sample/sample.module';

@Module({
  imports: [ModelViewModule, AuthModule, SampleModule],
})
export class ModuleContainerModule {}
