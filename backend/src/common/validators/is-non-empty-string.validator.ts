import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsNonEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNonEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage() {
          return `El campo debe ser un string no vacío`;
        },
      },
    });
  };
}
