import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropietarioDocumento } from './entities/propietario-documento.entity';
import { PropietarioDocumentosService } from './propietario-documentos.service';
import { PropietarioDocumentosController } from './propietario-documentos.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropietarioDocumento]),
    UploadsModule,
  ],
  controllers: [PropietarioDocumentosController],
  providers: [PropietarioDocumentosService],
  exports: [PropietarioDocumentosService],
})
export class PropietarioDocumentosModule {}
