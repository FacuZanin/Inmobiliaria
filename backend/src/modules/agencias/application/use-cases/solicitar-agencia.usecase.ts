// backend\src\modules\agencias\application\use-cases\solicitar-agencia.usecase.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SolicitarAgenciaUseCase {
  execute(): never {
    throw new Error('SolicitarAgenciaUseCase deshabilitado');
  }
}
