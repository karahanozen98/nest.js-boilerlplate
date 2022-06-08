import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AxiosNoResponseException, AxiosRequestFailedException } from 'exceptions';

@Injectable()
export class HttpRequestService {
  constructor(private readonly httpService: HttpService) {}

  get(
    url: string,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Observable<AxiosResponse<any, any>> {
    return this.httpService.get(url, config).pipe(catchError(defaultErrorBehaviour));
  }

  post(
    url: string,
    data: any,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Observable<AxiosResponse<any, any>> {
    return this.httpService.post(url, data, config).pipe(catchError(defaultErrorBehaviour));
  }

  put(
    url: string,
    data: any,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Observable<AxiosResponse<any, any>> {
    return this.httpService.put(url, data, config).pipe(catchError(defaultErrorBehaviour));
  }

  delete(
    url: string,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Observable<AxiosResponse<any, any>> {
    return this.httpService.delete(url, config).pipe(catchError(defaultErrorBehaviour));
  }
}

const defaultErrorBehaviour = (err: any) => {
  if (err.response) {
    throw new HttpException(err.response.data, err.response.status);
  } else if (err.request) {
    throw new AxiosNoResponseException();
  }
  throw new AxiosRequestFailedException();
};
