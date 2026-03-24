// backend\src\common\pipes\validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// Detecta tipos nativos o metadatos inválidos
function shouldSkipValidation(metatype: any): boolean {
  if (!metatype) return true;

  const nativeTypes = [String, Boolean, Number, Array, Object];
  return nativeTypes.includes(metatype);
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype, type } = metadata;

    // Si no es del body o no es clase => no validar
    if (type !== 'body' || shouldSkipValidation(metatype)) {
      return value;
    }

    // Si el metatype NO es constructor válido => no validar
    if (typeof metatype !== 'function') {
      return value;
    }

    // Ahora sí, dto válido → instanciar
    const object = plainToInstance(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        field: error.property,
        messages: Object.values(error.constraints ?? {}),
      }));

      throw new BadRequestException({
        message: 'Error en validación',
        errors: messages,
      });
    }

    return object;
  }
}
