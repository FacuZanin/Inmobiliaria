// backend\src\modules\propietario-documentos\propietario-documentos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { PropietarioDocumentosController } from './infrastructure/controllers/propietario-documentos.controller';

import { PropietarioDocumento } from './domain/entities/propietario-documento.domain';
import { User } from '../user/domain/entities/user.entity';
import { Propiedad } from '../propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

import { PropietarioDocumentosTypeOrmRepository } from './infrastructure/persistence/typeorm/propietario-documentos.typeorm.repository';

import { UploadsModule } from '../uploads/uploads.module';
import { AuthModule } from '../auth/auth.module';

import { SubirDocumentoPropietarioUseCase } from './application/use-cases/subir-documento.usecase';
import { CambiarEstadoDocumentoPropietarioUseCase } from './application/use-cases/cambiar-estado.usecase';
import { ListarMisDocumentosPropietarioUseCase } from './application/use-cases/listar-mis-documentos.usecase';
import { DocumentosAprobadosPropietarioUseCase } from './application/use-cases/documentos-aprobados.usecase';

import { PROPIETARIO_DOCUMENTOS_REPOSITORY } from './application/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropietarioDocumento, User, Propiedad]),
    UploadsModule,
    AuthModule,
  ],
  controllers: [PropietarioDocumentosController],
  providers: [
    {
    provide: PROPIETARIO_DOCUMENTOS_REPOSITORY,
    useClass: PropietarioDocumentosTypeOrmRepository,
    },
    SubirDocumentoPropietarioUseCase,
    CambiarEstadoDocumentoPropietarioUseCase,
    ListarMisDocumentosPropietarioUseCase,
    DocumentosAprobadosPropietarioUseCase,
  ],
  exports: [
    ListarMisDocumentosPropietarioUseCase,
    DocumentosAprobadosPropietarioUseCase,
  ],
})
export class PropietarioDocumentosModule {}
