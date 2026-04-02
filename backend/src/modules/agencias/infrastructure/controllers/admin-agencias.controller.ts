// backend\src\modules\agencias\infrastructure\controllers\admin-agencias.controller.ts
import { Controller, Post, Body, Get, Param, Patch, UseGuards, } from '@nestjs/common';

import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { Roles } from '../../../../shared/security/decorators/roles.decorator';
import { Profiles } from '../../../../shared/security/decorators/profiles.decorator';

import { UserRole, UserProfile } from '@shared/contracts';

import type { User } from '../../../user/domain/entities/user.entity';

import { SolicitudAgenciaDto } from '../../application/dto/solicitud-agencia.dto';

import { SolicitarAgenciaUseCase } from '../../application/use-cases/solicitar-agencia.usecase';
import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.usecase';
import { AprobarSolicitudAgenciaUseCase } from '../../application/use-cases/aprobar-solicitud-agencia.usecase';
import { RechazarSolicitudAgenciaUseCase } from '../../application/use-cases/rechazar-solicitud-agencia.usecase';

import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/security/guards/roles.guard';
import { ProfilesGuard } from '../../../../shared/security/guards/profiles.guard';
import { Auth } from '../../../../shared/security/decorators/auth.decorator';


@UseGuards(JwtAuthGuard, RolesGuard, ProfilesGuard)
@Auth(UserRole.SUPERADMIN)
@Profiles(UserProfile.AGENCIA)
@Controller('admin/agencias')
export class AdminAgenciasController {
  constructor(
    private readonly solicitarUC: SolicitarAgenciaUseCase,
    private readonly listarSolicitudesUC: ListarSolicitudesUseCase,
    private readonly aprobarUC: AprobarSolicitudAgenciaUseCase,
    private readonly rechazarUC: RechazarSolicitudAgenciaUseCase,
  ) {}

  @Post('solicitar')
  @Profiles(
    UserProfile.PROPIETARIO,
    UserProfile.INQUILINO,
    UserProfile.AGENCIA,
  )
  solicitar(@Body() dto: SolicitudAgenciaDto, @CurrentUser() user: User) {
    return this.solicitarUC.execute(dto, user);
  }

  @Get('solicitudes')
  @Roles(UserRole.SUPERADMIN)
  listar() {
    return this.listarSolicitudesUC.execute();
  }

  @Patch('solicitudes/:id/aprobar')
  @Roles(UserRole.SUPERADMIN)
  aprobar(@Param('id') id: string) {
    return this.aprobarUC.execute(Number(id));
  }

  @Patch('solicitudes/:id/rechazar')
  @Roles(UserRole.SUPERADMIN)
  rechazar(@Param('id') id: string) {
    return this.rechazarUC.execute(Number(id));
  }
}
