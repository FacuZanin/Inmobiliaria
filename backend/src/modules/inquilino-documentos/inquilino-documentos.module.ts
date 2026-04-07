// backend/src/modules/inquilino-documentos/inquilino-documentos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquilinoDocumentosController } from './infrastructure/controllers/inquilino-documentos.controller';

import { TipoDocumentoInquilino } from '@shared/contracts/enums/tipo-documento-inquilino.enum';
import { DocumentoAuditAction } from '@shared/contracts/enums/documento-audit-action.enum';

import { Inquilino } from '../inquilinos/domain/entities/inquilino.entity';

import { UploadsModule } from '../uploads/uploads.module';

import { InquilinoDocumentosTypeOrmRepository } from './infrastructure/persistence/typeorm/inquilino-documentos.typeorm.repository';

import { SubirDocumentoInquilinoUseCase } from './application/use-cases/subir-documento.usecase';
import { CambiarEstadoInquilinoDocumentoUseCase } from './application/use-cases/cambiar-estado.usecase';
import { ListarMisDocumentosUseCase } from './application/use-cases/listar-mis-documentos.usecase';
import { DocumentosAprobadosUseCase } from './application/use-cases/documentos-aprobados.usecase';
import { DocumentoAudit } from '../../modules/admin-documentos/domain/entities/documento-audit.entity';
import { InquilinoDocumento } from './domain/entities/inquilino-documento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquilinoDocumento,
      DocumentoAudit,
    ]),
    UploadsModule,
  ],
  controllers: [InquilinoDocumentosController],
  providers: [
    {
      provide: 'InquilinoDocumentosRepositoryPort',
      useClass: InquilinoDocumentosTypeOrmRepository,
    },

    SubirDocumentoInquilinoUseCase,
    CambiarEstadoInquilinoDocumentoUseCase,
    ListarMisDocumentosUseCase,
    DocumentosAprobadosUseCase,
  ],
})
export class InquilinoDocumentosModule {}
