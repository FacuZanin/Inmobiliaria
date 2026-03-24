// backend\src\common\validators\is-date-after.validator.ts
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsDateAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          const relatedValue = (args.object as any)[relatedProperty];

          if (!value || !relatedValue) return true;

          return new Date(value) > new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          return `${args.property} debe ser posterior a ${relatedProperty}`;
        },
      },
    });
  };
}
