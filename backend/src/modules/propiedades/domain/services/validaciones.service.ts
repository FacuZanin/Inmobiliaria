// backend\src\modules\propiedades\domain\services\validaciones.service.ts
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidacionesService {
  async validate(dto: any) {
    // ---------------------------------------------------
    // TÍTULO
    // ---------------------------------------------------

    if (!dto.titulo) {
      throw new BadRequestException(
        'El título es obligatorio',
      );
    }

    // ---------------------------------------------------
    // PRECIO
    // ---------------------------------------------------

    if (
      dto.precio === undefined ||
      dto.precio === null
    ) {
      throw new BadRequestException(
        'El precio es obligatorio',
      );
    }

    if (dto.precio <= 0) {
      throw new BadRequestException(
        'El precio debe ser mayor a 0',
      );
    }

    // ---------------------------------------------------
    // DIRECCIÓN
    // ---------------------------------------------------

    if (!dto.direccion) {
      throw new BadRequestException(
        'La dirección es obligatoria',
      );
    }

    // ---------------------------------------------------
    // TIPO OPERACIÓN
    // ---------------------------------------------------

    if (!dto.tipoOperacion) {
      throw new BadRequestException(
        'El tipo de operación es obligatorio',
      );
    }

    // ---------------------------------------------------
    // TIPO PROPIEDAD
    // ---------------------------------------------------

    if (!dto.tipoPropiedad) {
      throw new BadRequestException(
        'El tipo de propiedad es obligatorio',
      );
    }

    return true;
  }
}