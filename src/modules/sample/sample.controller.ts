import { Body, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  AllowAnonymous,
  ApiController,
  ApiOkResponse,
  ApiPaginationResponse,
  CacheAdd,
  CacheClear,
  Roles,
} from 'decorators';
import { Pagination } from 'decorators/param.decorator';
import { RolesGuard } from 'guards/roles.guard';
import { ControllerBase, IApiPageResponse, IApiResponse, IPaginationOptions } from 'core/api';
import { ApiConfigService } from 'shared/services/api-config.service';

import { CreateSampleDto } from './dto/request/create-sample-request.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';
import { SampleService } from './sample.service';

@UseGuards(RolesGuard)
@ApiController({ tags: ['Sample'], path: 'sample', version: '1' })
export class SampleController extends ControllerBase {
  constructor(
    private readonly sampleService: SampleService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiPaginationResponse({ type: PersonResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @CacheAdd()
  @AllowAnonymous()
  async list(
    @Pagination() options: IPaginationOptions,
  ): Promise<IApiPageResponse<PersonResponseDto>> {
    const paginationResult = await this.sampleService.list(options);

    return this.ok(paginationResult);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [PersonResponseDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @CacheAdd({ public: true })
  @AllowAnonymous()
  async listAll(): Promise<IApiResponse<PersonResponseDto[]>> {
    const list = await this.sampleService.listAll();

    return this.ok(list);
  }

  @Get('person/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Find Person by id', type: PersonResponseDto })
  @CacheAdd()
  async getPerson(@Param('id') id: string): Promise<IApiResponse<PersonResponseDto>> {
    const person = await this.sampleService.get(id);

    return this.ok(person);
  }

  @Get('isDev')
  @ApiOkResponse({ type: 'boolean' })
  @Roles('Admin')
  getEnvironment(): IApiResponse<boolean> {
    return this.ok(this.apiConfigService.isDevelopment ? true : false);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSampleDto })
  @ApiOkResponse({ status: 201 })
  @CacheClear()
  create(@Body() createSampleDto: CreateSampleDto): IApiResponse<any> {
    this.sampleService.create(createSampleDto);

    return this.ok();
  }

  @Get('translate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: 'string' })
  @AllowAnonymous()
  translate(): IApiResponse<string> {
    return this.ok(this.sampleService.translate());
  }
}
