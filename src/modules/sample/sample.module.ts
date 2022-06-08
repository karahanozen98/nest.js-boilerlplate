import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpConfigService } from 'shared/services/http-config.service';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';

@Module({
  controllers: [SampleController],
  providers: [SampleService], // add SampleService to the DI container
  imports: [
    // resolve modules from DI container
    HttpModule.registerAsync({ useExisting: HttpConfigService }),
  ],
})
export class SampleModule {}
