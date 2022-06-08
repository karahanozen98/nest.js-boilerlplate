import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SampleModule } from 'modules/sample/sample.module';
import { SharedModule } from 'shared/shared.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    SampleModule,
    SharedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
