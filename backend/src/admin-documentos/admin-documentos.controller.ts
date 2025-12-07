import {
  Controller,
  Get,
  Query,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { AdminDocumentosService } from './admin-documentos.service';
import { FiltroDocumentosDto } from './dto/filtro-documentos.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/documentos')
export class AdminDocumentosController {
  constructor(private readonly adminDocsService: AdminDocumentosService) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.AGENCIA)
  listar(@Query() filtros: FiltroDocumentosDto) {
    return this.adminDocsService.listarDocumentos(filtros);
  }

  @Get(':tipo/:id/historial')
  @Auth(UserRole.ADMIN, UserRole.AGENCIA)
  historial(
    @Param('tipo') tipo: 'INQUILINO' | 'PROPIETARIO',
    @Param('id') id: number,
  ) {
    return this.adminDocsService.verHistorial(id, tipo);
  }

  @Patch(':tipo/:id/estado')
  @Auth(UserRole.ADMIN, UserRole.AGENCIA)
  cambiarEstado(
    @Param('tipo') tipo: 'INQUILINO' | 'PROPIETARIO',
    @Param('id') id: number,
    @Body() dto: CambiarEstadoDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.adminDocsService.cambiarEstado(tipo, id, dto, userId);
  }
}
