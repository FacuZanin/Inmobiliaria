// backend/src/inquilinos/inquilinos.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';

import { InquilinosService } from './inquilinos.service';
import { Auth } from '../common/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CrearSolicitudVisitaDto } from './dto/crear-solicitud-visita.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity/user.entity';
import { ActualizarPerfilInquilinoDto } from './dto/actualizar-perfil.dto';

@Controller('inquilinos')
@Auth(UserRole.INQUILINO)
export class InquilinosController {
  constructor(private readonly service: InquilinosService) {}

  @Get('perfil')
  perfil(@CurrentUser() user: User) {
    return this.service.getPerfil(user.id);
  }

  @Post('visitas')
  solicitarVisita(
    @Body() dto: CrearSolicitudVisitaDto,
    @CurrentUser() user: User,
  ) {
    return this.service.crearSolicitudVisita(dto, user);
  }

  @Post('favoritos/:propiedadId')
  agregarFavorito(
    @Param('propiedadId') propiedadId: string,
    @CurrentUser() user: User,
  ) {
    return this.service.agregarFavorito(Number(propiedadId), user);
  }

  @Delete('favoritos/:id')
  eliminarFavorito(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.eliminarFavorito(Number(id), user);
  }

  @Get('favoritos')
  listarFavoritos(@CurrentUser() user: User) {
    return this.service.listarFavoritos(user);
  }

  @Patch('perfil')
actualizarPerfil(
  @Body() dto: ActualizarPerfilInquilinoDto,
  @CurrentUser() user: User,
) {
  return this.service.actualizarPerfil(user.id, dto);
}

}
