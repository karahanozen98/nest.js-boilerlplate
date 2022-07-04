import { Body, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { BaseController } from 'abstraction';
import {
  AllowAnonymous,
  ApiBaseOkResponse,
  ApiController,
  ApiPageOkResponse,
  CacheAdd,
  CacheClear,
  Roles,
} from 'decorators';
import { Pagination } from 'decorators/param.decorator';
import { RolesGuard } from 'guards/roles.guard';
import type { IPaginatedResponse } from 'interface';
import { IBaseResponse, IPageOptions } from 'interface';
import { ApiConfigService } from 'shared/services/api-config.service';

import { CreateSampleDto } from './dto/request/create-sample-request.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';
import { SampleService } from './sample.service';

@UseGuards(RolesGuard)
@ApiController({ tags: ['Sample'], path: 'sample', version: '1' })
export class SampleController extends BaseController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({ type: PersonResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @CacheAdd()
  @AllowAnonymous()
  async list(@Pagination() pageOpts: IPageOptions): Promise<IPaginatedResponse<PersonResponseDto>> {
    const list = await this.sampleService.list(pageOpts);

    return this.ok(list);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiBaseOkResponse({ type: [PersonResponseDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @CacheAdd({ public: true })
  @AllowAnonymous()
  async listAll(): Promise<IBaseResponse<PersonResponseDto[]>> {
    const list = await this.sampleService.listAll();

    return this.ok(list);
  }

  @Get('person/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiBaseOkResponse({ description: 'Find Person by id', type: PersonResponseDto })
  @CacheAdd()
  async getPerson(@Param('id') id: string): Promise<IBaseResponse<PersonResponseDto>> {
    const person = await this.sampleService.get(id);

    return this.ok(person);
  }

  @Get('isDev')
  @ApiBaseOkResponse({ type: 'boolean' })
  @Roles('Admin')
  getEnvironment(): IBaseResponse<boolean> {
    return this.ok(this.apiConfigService.isDevelopment ? true : false);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSampleDto })
  @ApiBaseOkResponse({ status: 201 })
  @CacheClear()
  create(@Body() createSampleDto: CreateSampleDto): IBaseResponse<any> {
    this.sampleService.create(createSampleDto);

    return this.ok();
  }

  @Get('translate')
  @HttpCode(HttpStatus.OK)
  @ApiBaseOkResponse({ type: 'string' })
  translate(): IBaseResponse<string> {
    return this.ok(this.sampleService.translate());
  }
}
