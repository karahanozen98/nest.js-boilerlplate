import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageService } from 'shared/services/language.service';
import { WebClientService } from 'shared/services/web-client.service';

import type { CreateSampleDto } from './dto/request/create-sample-request.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';

@Injectable()
export class SampleService {
  constructor(
    private readonly webClientService: WebClientService,
    private readonly languageService: LanguageService,
  ) {}

  async list(): Promise<any> {
    const { data } = await this.webClientService.get('people');

    return data;
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

    return this.languageService.translate('sample.user.found');
  }
}
