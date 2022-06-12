import axios from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfigService } from './api-config.service';
import { AxiosNoResponseException, AxiosRequestFailedException } from 'exceptions';

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
      (value) => {
        return value;
      },
      (error) => {
        if (error.response) throw new HttpException(error.message, error.response?.status);
        else if (error.request) throw new AxiosNoResponseException();
        else throw new AxiosRequestFailedException();
      },
    );
  }

  async get(
    url: string,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Promise<AxiosResponse<any, any>> {
    return await this.httpService.get(url, config);
  }

  async post(
    url: string,
    data: any,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Promise<AxiosResponse<any, any>> {
    return await this.httpService.post(url, data, config);
  }

  async put(
    url: string,
    data: any,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Promise<AxiosResponse<any, any>> {
    return await this.httpService.put(url, data, config);
  }

  async delete(
    url: string,
    config: AxiosRequestConfig<any> | undefined = undefined,
  ): Promise<AxiosResponse<any, any>> {
    return await this.httpService.delete(url, config);
  }
}
