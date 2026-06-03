// backend/src/modules/agencias/application/use-cases/solicitar-agencia.usecase.ts

import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import type { UserRepositoryPort } from '@/modules/users/application/ports/user-repository.port';

import { AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';

import { AgenciaSolicitudEstado } from '@shared/contracts/enums/agencia-solicitud-estado.enum';

import {
  AGENCY_USER_TYPES,
  PROFESSIONAL_USER_TYPES,
} from '@/modules/users/domain/capabilities/property-publishers';

import type { CreateSolicitudAgenciaDto } from '../dto/create-solicitud-agencia.dto';



import { USER_REPOSITORY } from '@/modules/users/application/tokens';

@Injectable()
export class SolicitarAgenciaUseCase {
  constructor(
    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly solicitudesRepository: AgenciaSolicitudRepositoryPort,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(dto: CreateSolicitudAgenciaDto, userId: number) {
    const usuario = await this.userRepository.findById(userId);

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (usuario.agencia || AGENCY_USER_TYPES.includes(usuario.tipo)) {
      throw new BadRequestException('El usuario ya pertenece a una agencia');
    }

    if (PROFESSIONAL_USER_TYPES.includes(usuario.tipo)) {
      throw new BadRequestException('El usuario ya tiene un perfil profesional');
    }

    const yaTienePendiente =
      await this.solicitudesRepository.findPendienteByUserId(userId);

    if (yaTienePendiente) {
      throw new BadRequestException('Ya tienes una solicitud pendiente');
    }

    const solicitud = await this.solicitudesRepository.create(dto, userId);

    return {
      message: 'Solicitud enviada correctamente',
      data: solicitud,
    };
  }
}
