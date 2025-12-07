import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPositiveInteger(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPositiveInteger',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && Number.isInteger(value) && value > 0;
        },
        defaultMessage() {
          return 'El valor debe ser un número entero positivo';
        },
      },
    });
  };
}
