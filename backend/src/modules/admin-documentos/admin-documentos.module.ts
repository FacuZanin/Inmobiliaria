// backend\src\modules\admin-documentos\admin-documentos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminDocumentosController } from './infrastructure/controllers/admin-documentos.controller';

// ENTITIES
import { DocumentoAudit } from './domain/entities/documento-audit.entity';
import { PropietarioDocumento } from '../propietario-documentos/domain/entities/propietario-documento.domain';
import { InquilinoDocumento } from '../inquilino-documentos/domain/entities/inquilino-documento.entity';

// USE CASES
import { ListarDocumentosUseCase } from './application/use-cases/listar-documentos.usecase';
import { CambiarEstadoDocumentoUseCase } from './application/use-cases/cambiar-estado-documento.usecase';
import { VerHistorialDocumentoUseCase } from './application/use-cases/ver-historial-documento.usecase';

// PORTS → INFRA
import { DocumentoQueryTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/documento-query.typeorm.repository';
import { DocumentoAuditTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/documento-audit.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentoAudit,
      PropietarioDocumento,
      InquilinoDocumento,
    ]),
  ],
  controllers: [AdminDocumentosController],
  providers: [
    // Use cases
    ListarDocumentosUseCase,
    CambiarEstadoDocumentoUseCase,
    VerHistorialDocumentoUseCase,

    // Ports
    {
      provide: 'DocumentoQueryPort',
      useClass: DocumentoQueryTypeOrmRepository,
    },
    {
      provide: 'DocumentoCommandPort',
      useClass: DocumentoQueryTypeOrmRepository,
    },
    {
      provide: 'DocumentoAuditRepositoryPort',
      useClass: DocumentoAuditTypeOrmRepository,
    },
  ],
})
export class AdminDocumentosModule {}
