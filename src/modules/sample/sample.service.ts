import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { HttpRequestService } from 'shared/services/http-request.service';
import { CreateSampleDto } from './dto/request/create-sample-request.dto';
import { PersonResponseDto } from './dto/response/person-response.dto';

@Injectable()
export class SampleService {
  constructor(
    private readonly httpService: HttpService,
    private readonly httpRequestService: HttpRequestService,
  ) {}

  async list(): Promise<Observable<any>> {
    // Default HttpServer example:
    const list = this.httpService.get('people/').pipe(
      map((res) => res.data),
      catchError((err) => {
        throw new HttpException(err.response.data, 400);
      }),
    );

    return list;
  }

  async get(id: string): Promise<Observable<PersonResponseDto>> {
    // Promises example:
    const person1 = await lastValueFrom(this.httpRequestService.get(`people/${id}`));
    console.log(person1.data);

    //Custom HttpServer example
    const response = this.httpRequestService
      .get(`people/${id}`)
      .pipe(map((res) => new PersonResponseDto({ id, ...res.data })));

    return response;
  }

  create(createSampleDto: CreateSampleDto): string {
    return `${createSampleDto.name} ${createSampleDto.description} created`;
  }
}
