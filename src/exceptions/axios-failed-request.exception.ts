import { HttpException } from '@nestjs/common';

export class AxiosNoResponseException extends HttpException {
  constructor() {
    super('The request was made but no response was received', 400);
  }
}

export class AxiosRequestFailedException extends HttpException {
  constructor() {
    super('Something happened in setting up the request that triggered an Error', 400);
  }
}
