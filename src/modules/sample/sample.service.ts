import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDetails, PaginationResult, type IPaginationOptions } from 'core/api';
import { LocalizationService } from 'shared/services/localization.service';
import { WebClientService } from 'shared/services/web-client.service';

import type { CreateSampleDto } from './dto/request/create-sample-request.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';

@Injectable()
export class SampleService {
  constructor(
    private readonly webClientService: WebClientService,
    private readonly localizationService: LocalizationService,
  ) {}

  async list(pageOptions: IPaginationOptions): Promise<PaginationResult<PersonResponseDto>> {
    const { data } = await this.webClientService.get<{ results: []; count: number }>('people');
    const mappedList = data.results.map((item: any) => new PersonResponseDto(item));
    const result = new PaginationResult(
      mappedList,
      new PaginationDetails({ itemCount: data.count, pageOptions }),
    );

    return result;
  }

  async listAll(): Promise<PersonResponseDto[]> {
    const { data } = await this.webClientService.get<{ results: []; count: number }>('people');
    const mappedList = data.results.map((item: any) => new PersonResponseDto(item));

    return mappedList;
  }

  async get(id: string): Promise<PersonResponseDto> {
    const { data } = await this.webClientService.get<PersonResponseDto>(`people/${id}`);

    return new PersonResponseDto(data);
  }

  create(createSampleDto: CreateSampleDto): string {
    return `${createSampleDto.name} ${createSampleDto.description} created`;
  }

  translate() {
    throw new NotFoundException('sample.user.notFound');

    return this.localizationService.translate('sample.user.found');
  }
}
