import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Propiedad } from './entities/propiedad.entity';
import { PropiedadesService } from './propiedades.service';
import { PropiedadesController } from './propiedades.controller';

import { PropiedadCasa } from './entities/propiedad-casa.entity';
import { PropiedadDepartamento } from './entities/propiedad-departamento.entity';
import { PropiedadLote } from './entities/propiedad-lote.entity';
import { PropiedadLocal } from './entities/propiedad-local.entity';
import { PropiedadOficina } from './entities/propiedad-oficina.entity';
import { PropiedadCampo } from './entities/propiedad-campo.entity';
import { PropiedadPH } from './entities/propiedad-ph.entity';
import { PropiedadPozo } from './entities/propiedad-pozo.entity';
import { PropietarioDocumentosModule } from '../propietario-documentos/propietario-documentos.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Propiedad,
      PropiedadCasa,
      PropiedadDepartamento,
      PropiedadLote,
      PropiedadLocal,
      PropiedadOficina,
      PropiedadCampo,
      PropiedadPH,
      PropiedadPozo,
    ]),
    PropietarioDocumentosModule,
  ],
  controllers: [PropiedadesController],
  providers: [PropiedadesService],
  exports: [PropiedadesService],
})
export class PropiedadesModule {}
