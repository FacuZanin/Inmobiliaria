// backend\src\modules\admin-documentos\infrastructure\controllers\admin-documentos.controller.ts
import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';

import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';

import { FiltroDocumentosDto } from '../../application/dto/filtro-documentos.dto';
import { CambiarEstadoDto } from '../../application/dto/cambiar-estado.dto';

import { ListarDocumentosUseCase } from '../../application/use-cases/listar-documentos.usecase';
import { CambiarEstadoDocumentoUseCase } from '../../application/use-cases/cambiar-estado-documento.usecase';
import { VerHistorialDocumentoUseCase } from '../../application/use-cases/ver-historial-documento.usecase';

import { DocumentoTipo } from '@shared/contracts/enums/documento-tipo.enum'

import { Roles } from '../../../../shared/security/decorators/roles.decorator';
import { Profiles } from '../../../../shared/security/decorators/profiles.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';


@Controller('admin/documentos')
export class AdminDocumentosController {
  constructor(
    private readonly listarUC: ListarDocumentosUseCase,
    private readonly cambiarEstadoUC: CambiarEstadoDocumentoUseCase,
    private readonly historialUC: VerHistorialDocumentoUseCase,
  ) {}

  @Get()
  @Roles(UserRole.SUPERADMIN)
  @Profiles(UserProfile.AGENCIA)
  listar(@Query() filtros: FiltroDocumentosDto) {
    return this.listarUC.execute(filtros);
  }

  @Get(':tipo/:id/historial')
  @Roles(UserRole.SUPERADMIN)
  @Profiles(UserProfile.AGENCIA)
  historial(
    @Param('tipo') tipo: 'INQUILINO' | 'PROPIETARIO',
    @Param('id') id: string,
  ) {
    const documentoTipo = tipo as DocumentoTipo;
    return this.historialUC.execute(Number(id), documentoTipo);
  }

  @Patch(':tipo/:id/estado')
  @Roles(UserRole.SUPERADMIN)
  @Profiles(UserProfile.AGENCIA)
  cambiarEstado(
    @Param('tipo') tipo: 'INQUILINO' | 'PROPIETARIO',
    @Param('id') id: string,
    @Body() dto: CambiarEstadoDto,
    @CurrentUser('id') userId: number,
  ) {
    const documentoTipo = tipo as DocumentoTipo;

    return this.cambiarEstadoUC.execute({
      tipo: documentoTipo,
      documentoId: Number(id),
      estado: dto.estado,
      comentario: dto.comentarioRechazo,
      userId,
    });
  }
}
