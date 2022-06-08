import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Type } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ApiConfigService } from 'shared/services/api-config.service';
import { CreateSampleDto } from './dto/request/create-sample-request.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';
import { SampleService } from './sample.service';

@ApiTags('sample')
@Controller('sample')
export class SampleController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List of users', type: [PersonResponseDto] })
  list(): Promise<Observable<PersonResponseDto>> {
    return this.sampleService.list();
  }

  @Get('/person/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', format: 'string' })
  @ApiOkResponse({ description: 'Find Person by id', type: PersonResponseDto })
  async getPerson(@Param('id') id: string): Promise<Observable<PersonResponseDto>> {
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
  create(@Body() createSampleDto: CreateSampleDto): string {
    return this.sampleService.create(createSampleDto);
  }
}
