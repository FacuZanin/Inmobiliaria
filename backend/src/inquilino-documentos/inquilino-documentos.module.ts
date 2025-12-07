import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquilinoDocumentosController } from './inquilino-documentos.controller';
import { InquilinoDocumentosService } from './inquilino-documentos.service';

import { InquilinoDocumento } from './entities/inquilino-documento.entity';
import { Inquilino } from '../inquilinos/entities/inquilino.entity';
import { UploadsModule } from '../uploads/uploads.module';
import { DocumentoAudit, DocumentoAuditAction } from '../admin-documentos/entities/documento-audit.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([InquilinoDocumento, Inquilino, DocumentoAudit]),
    UploadsModule,
  ],
  controllers: [InquilinoDocumentosController],
  providers: [InquilinoDocumentosService],
  exports: [InquilinoDocumentosService],
})
export class InquilinoDocumentosModule {}
