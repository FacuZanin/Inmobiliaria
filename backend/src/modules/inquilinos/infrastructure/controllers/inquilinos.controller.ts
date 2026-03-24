// backend\src\modules\inquilinos\infrastructure\controllers\inquilinos.controller.ts
import { Controller, Put, Post, Body, Param } from '@nestjs/common';

import { ActualizarPerfilUseCase } from '../../application/use-cases/actualizar-perfil.usecase';
import { AgregarFavoritoUseCase } from '../../application/use-cases/agregar-favorito.usecase';
import { CrearSolicitudVisitaUseCase } from '../../application/use-cases/crear-solicitud-visita.usecase';

import type { ActualizarPerfilDTO } from '../../application/dto/actualizar-perfil.dto';
import type { AgregarFavoritoDTO } from '../../application/dto/agregar-favorito.dto';
import type { CrearSolicitudVisitaDTO } from '../../application/dto/crear-solicitud-visita.dto';

@Controller('inquilinos')
export class InquilinosController {
  constructor(
    private readonly actualizarPerfil: ActualizarPerfilUseCase,
    private readonly agregarFavorito: AgregarFavoritoUseCase,
    private readonly crearSolicitudVisita: CrearSolicitudVisitaUseCase,
  ) {}

  @Put(':id/perfil')
  actualizar(
    @Param('id') id: number,
    @Body() dto: ActualizarPerfilDTO,
  ) {
    return this.actualizarPerfil.execute(id, dto);
  }

  @Post(':id/favoritos')
  agregarFav(
    @Param('id') id: number,
    @Body() dto: AgregarFavoritoDTO,
  ) {
    return this.agregarFavorito.execute(id, dto);
  }

  @Post(':id/solicitudes-visita')
  solicitarVisita(
    @Param('id') id: number,
    @Body() dto: CrearSolicitudVisitaDTO,
  ) {
    return this.crearSolicitudVisita.execute(id, dto);
  }
}
