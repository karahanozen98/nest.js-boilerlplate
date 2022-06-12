import { HttpStatus, ValidationPipe } from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      //dismissDefaultMessages: true,
      //exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    });
  }
}
