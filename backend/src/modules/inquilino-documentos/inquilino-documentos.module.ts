// backend/src/modules/inquilino-documentos/inquilino-documentos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquilinoDocumentosController } from './infrastructure/controllers/inquilino-documentos.controller';

import { InquilinoDocumento, DocumentoAudit } from './domain/entities/inquilino-documento.entity';
import { Inquilino } from '../inquilinos/domain/entities/inquilino.entity';

import { UploadsModule } from '../uploads/uploads.module';

import { InquilinoDocumentosTypeOrmRepository } from './infrastructure/persistence/typeorm/inquilino-documentos.typeorm.repository';

import { SubirDocumentoInquilinoUseCase } from './application/use-cases/subir-documento.usecase';
import { CambiarEstadoInquilinoDocumentoUseCase } from './application/use-cases/cambiar-estado.usecase';
import { ListarMisDocumentosUseCase } from './application/use-cases/listar-mis-documentos.usecase';
import { DocumentosAprobadosUseCase } from './application/use-cases/documentos-aprobados.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InquilinoDocumento,
      Inquilino,
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
