import { ValidationOptions } from 'class-validator';
import { IsPhoneNumber as isPhoneNumber, registerDecorator, ValidateIf } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
        },
        defaultMessage(): string {
          return 'error.password';
        },
      },
    });
  };
}

export function IsPhoneNumber(
  validationOptions?: ValidationOptions & {
    region?: Parameters<typeof isPhoneNumber>[0];
  },
): PropertyDecorator {
  return isPhoneNumber(validationOptions?.region, {
    message: 'error.phoneNumber',
    ...validationOptions,
  });
}

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_, value) => value !== undefined, options);
}

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_, value) => value !== null, options);
}
