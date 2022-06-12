import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, CacheAdd, CacheClear } from 'decorators';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiConfigService } from 'shared/services/api-config.service';
import { CreateSampleDto } from './dto/request/createSampleRequestDto';
import { PersonResponseDto } from './dto/response/personResponseDto';
import { SampleService } from './sample.service';

@ApiTags('sample')
@Controller({ path: '/sample', version: '1' })
export class SampleController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of users', type: [PersonResponseDto] })
  @CacheAdd()
  @AllowAnonymous()
  async list(): Promise<PersonResponseDto> {
    return await this.sampleService.list();
  }

  @Get('/person/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', format: 'string' })
  @ApiOkResponse({ description: 'Find Person by id', type: PersonResponseDto })
  @CacheAdd()
  async getPerson(@Param('id') id: string): Promise<PersonResponseDto> {
    return await this.sampleService.get(id);
  }

  @Get('nev')
  getEnvironment(): string {
    let environment = '';
    if (this.apiConfigService.isDevelopment) environment = 'dev';
    return environment;
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSampleDto })
  @ApiCreatedResponse()
  @CacheClear()
  create(@Body() createSampleDto: CreateSampleDto) {
    this.sampleService.create(createSampleDto);
  }

  @Get('translate')
  @HttpCode(HttpStatus.OK)
  async translate(@I18n() i18n: I18nContext) {
    throw new NotFoundException('sample.user.notFound');
    return await i18n.t('sample.name');
  }
}
