//backend\src\modules\agencias\application\use-cases\solicitar-agencia.usecase.ts
import { Injectable } from '@nestjs/common';
import type { CreateSolicitudAgenciaDto } from '../dto/create-solicitud-agencia.dto';

@Injectable()
export class SolicitarAgenciaUseCase {
  async execute(dto: CreateSolicitudAgenciaDto, userId: number) {

    return {
      message: 'Solicitud enviada correctamente',
      data: {
        ...dto,
        userId,
      },
    };
  }
}