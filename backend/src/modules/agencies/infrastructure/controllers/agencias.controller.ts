// backend/src/modules/agencias/infrastructure/controllers/agencias.controller.ts

import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/security/decorators/auth.decorator';

import { CurrentUser } from '@/security/decorators/current-user.decorator';

import type { User } from '../../../users/domain/entities/user.entity';

import { CreateSolicitudAgenciaDto } from '../../application/dto/create-solicitud-agencia.dto';

import { SolicitarAgenciaUseCase } from '../../application/use-cases/solicitar-agencia.usecase';

@ApiTags('Perfiles Profesionales')
@ApiBearerAuth()
@Controller('agencias')
export class AgenciasController {
  constructor(
    private readonly solicitarUC: SolicitarAgenciaUseCase,
  ) {}

  // =========================
  // USER AUTENTICADO
  // =========================

  @Auth()
  @Post('solicitar')
  @ApiOperation({
    summary: 'Solicitar activacion de perfil profesional',
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitud enviada correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  solicitar(
    @Body() dto: CreateSolicitudAgenciaDto,

    @CurrentUser() user: User,
  ) {
    return this.solicitarUC.execute(
      dto,
      user.id,
    );
  }
}
