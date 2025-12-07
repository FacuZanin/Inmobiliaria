import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminDocumentosController } from './admin-documentos.controller';
import { AdminDocumentosService } from './admin-documentos.service';

import { PropietarioDocumento } from '../propietario-documentos/entities/propietario-documento.entity';
import { InquilinoDocumento } from '../inquilino-documentos/entities/inquilino-documento.entity';
import { DocumentoAudit } from './entities/documento-audit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropietarioDocumento,
      InquilinoDocumento,
      DocumentoAudit,
    ]),
  ],
  controllers: [AdminDocumentosController],
  providers: [AdminDocumentosService],
  exports: [AdminDocumentosService],
})
export class AdminDocumentosModule {}
