/* eslint-disable @moneteam/nestjs/injectable-should-be-provided */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { WEB_CLIENT_CONFIG } from 'common/constants';
import { AxiosNoResponseException, AxiosRequestFailedException } from 'exceptions';

@Injectable()
export class WebClientService {
  httpService: AxiosInstance;

  constructor(@Inject(WEB_CLIENT_CONFIG) config: AxiosRequestConfig<any> | undefined) {
    this.httpService = axios.create(config);

    this.httpService.interceptors.response.use(
      (value) => value,
      (error) => {
        if (error.response) {
          throw new HttpException(error.message as string, error.response?.status as number);
        } else if (error.request) {
          throw new AxiosNoResponseException();
        } else {
          throw new AxiosRequestFailedException();
        }
      },
    );
  }

  async get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<AxiosResponse<T, D>> {
    return await this.httpService.get(url, config);
  }

  async post<T = any, D = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<AxiosResponse<T, D>> {
    return await this.httpService.post(url, data, config);
  }

  async put<T = any, D = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<AxiosResponse<T, D>> {
    return await this.httpService.put(url, data, config);
  }

  async delete<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<AxiosResponse<T, D>> {
    return await this.httpService.delete(url, config);
  }
}
