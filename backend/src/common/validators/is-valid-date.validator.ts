import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true;
          const d = new Date(value);
          return !isNaN(d.getTime());
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser una fecha válida`;
        },
      },
    });
  };
}
