import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous, CacheAdd, CacheClear } from 'decorators';
import { ApiConfigService } from 'shared/services/api-config.service';
import { CreateSampleDto } from './dto/request/createSampleRequestDto';
import { PersonResponseDto } from './dto/response/personResponseDto';
import { SampleService } from './sample.service';

@ApiTags('Sample')
@Controller({ path: '/sample', version: '1' })
export class SampleController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of users', type: [PersonResponseDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @CacheAdd({ public: true })
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
  @ApiResponse({ type: 'any' })
  async translate() {
    return this.sampleService.translate();
  }
}
