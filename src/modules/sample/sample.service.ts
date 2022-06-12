import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { WebClientService } from 'shared/services/web-client.service';
import { CreateSampleDto } from './dto/request/createSampleRequestDto';
import { PersonResponseDto } from './dto/response/personResponseDto';

@Injectable()
export class SampleService {
  constructor(
    private readonly webClientService: WebClientService,
    private readonly i18nService: I18nService,
  ) {}

  async list(): Promise<any> {
    const { data } = await this.webClientService.get('people');
    return data;
  }

  async get(id: string): Promise<PersonResponseDto> {
    const { data } = await this.webClientService.get(`people/${id}`);
    return new PersonResponseDto(data);
  }

  create(createSampleDto: CreateSampleDto): string {
    return `${createSampleDto.name} ${createSampleDto.description} created`;
  }

  translate() {
    throw new NotFoundException('sample.user.notFound');
    return this.i18nService.t('sample.user.found');
  }
}
