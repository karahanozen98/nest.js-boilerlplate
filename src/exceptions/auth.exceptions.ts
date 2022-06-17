import { HttpException } from '@nestjs/common';

export class UserNameOrPasswordIncorrectException extends HttpException {
  constructor() {
    super('auth.invalidCredentials', 401);
  }
}
