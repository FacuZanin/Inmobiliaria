import { Injectable } from '@nestjs/common';
import type { SolicitudAgenciaDto } from '../dto/solicitud-agencia.dto';

@Injectable()
export class SolicitarAgenciaUseCase {
  async execute(dto: SolicitudAgenciaDto, userId: number) {

    return {
      message: 'Solicitud enviada correctamente',
      data: {
        ...dto,
        userId,
      },
    };
  }
}