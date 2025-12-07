import { Injectable } from '@nestjs/common';
import { AgenciasService } from './agencias.service';
import { SolicitudAgenciaDto } from './dto/solicitud-agencia.dto';
import { User } from '../users/user.entity/user.entity';

@Injectable()
export class AdminAgenciasService {
  constructor(private readonly agenciasService: AgenciasService) {}

  crearSolicitud(dto: SolicitudAgenciaDto, user: User) {
    return this.agenciasService.crearSolicitud(dto, user);
  }

  listarSolicitudes() {
    return this.agenciasService.findSolicitudesPendientes();
  }

  obtenerSolicitud(id: number) {
    return this.agenciasService.findSolicitud(id);
  }

  aprobarSolicitud(id: number) {
    return this.agenciasService.aprobarSolicitud(id);
  }

  rechazarSolicitud(id: number) {
    return this.agenciasService.rechazarSolicitud(id);
  }
}
