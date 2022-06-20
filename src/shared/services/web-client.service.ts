import { HttpException, Injectable } from '@nestjs/common';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { AxiosNoResponseException, AxiosRequestFailedException } from 'exceptions';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class WebClientService {
  httpService: AxiosInstance;

  constructor(private readonly apiConfigService: ApiConfigService) {
    this.httpService = axios.create({
      baseURL: this.apiConfigService.apiConfig.baseUrl,
      timeout: 1000 * 60 * 3,
      maxRedirects: 5,
      timeoutErrorMessage: 'UPT Bff - Http Request timeout',
      withCredentials: true,
    });

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
