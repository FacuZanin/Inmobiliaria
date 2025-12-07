import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { AdminAgenciasService } from './admin-agencias.service';
import { SolicitudAgenciaDto } from './dto/solicitud-agencia.dto';


import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/user.entity/user.entity';

@Controller('admin/agencias')
export class AdminAgenciasController {
  constructor(private readonly adminService: AdminAgenciasService) {}

  @Post('solicitar')
  @Auth(UserRole.PROPIETARIO, UserRole.INQUILINO, UserRole.AGENCIA)
  crearSolicitud(
    @Body() dto: SolicitudAgenciaDto,
    @CurrentUser() user: User,
  ) {
    return this.adminService.crearSolicitud(dto, user);
  }

  @Get('solicitudes')
  @Auth(UserRole.ADMIN)
  listar() {
    return this.adminService.listarSolicitudes();
  }

  @Get('solicitudes/:id')
  @Auth(UserRole.ADMIN)
  obtener(@Param('id') id: string) {
    return this.adminService.obtenerSolicitud(Number(id));
  }

  @Patch('solicitudes/:id/aprobar')
  @Auth(UserRole.ADMIN)
  aprobar(@Param('id') id: string) {
    return this.adminService.aprobarSolicitud(Number(id));
  }

  @Patch('solicitudes/:id/rechazar')
  @Auth(UserRole.ADMIN)
  rechazar(@Param('id') id: string) {
    return this.adminService.rechazarSolicitud(Number(id));
  }
}
