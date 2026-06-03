// backend\src\modules\propietario-documentos\propietario-documentos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { PropietarioDocumentosController } from '@/modules/documents/propietario-documentos/infrastructure/controllers/propietario-documentos.controller';

import { PropietarioDocumento } from '@/modules/documents/propietario-documentos/domain/entities/propietario-documento.domain';
import { User } from '@/modules/users/domain/entities/user.entity';
import { PropertyEntity } from '@modules/propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

import { PropietarioDocumentosTypeOrmRepository } from '@/modules/documents/propietario-documentos/infrastructure/persistence/typeorm/propietario-documentos.typeorm.repository';

import { UploadsModule } from '@/modules/media/uploads/uploads.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';

import { SubirDocumentoPropietarioUseCase } from '@/modules/documents/propietario-documentos/application/use-cases/subir-documento.usecase';
import { CambiarEstadoDocumentoPropietarioUseCase } from '@/modules/documents/propietario-documentos/application/use-cases/cambiar-estado.usecase';
import { ListarMisDocumentosPropietarioUseCase } from '@/modules/documents/propietario-documentos/application/use-cases/listar-mis-documentos.usecase';
import { DocumentosAprobadosPropietarioUseCase } from '@/modules/documents/propietario-documentos/application/use-cases/documentos-aprobados.usecase';

import { PROPIETARIO_DOCUMENTOS_REPOSITORY } from './application/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropietarioDocumento, User, PropertyEntity]),
    UploadsModule,
    AuthModule,
    UsersModule,
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
