// backend/src/inquilinos/inquilinos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inquilino } from './entities/inquilino.entity';
import { SolicitudVisita } from './entities/solicitud-visita.entity';
import { Favorito } from './entities/favorito.entity';

import { InquilinosService } from './inquilinos.service';
import { InquilinosController } from './inquilinos.controller';

import { Propiedad } from '../propiedades/entities/propiedad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inquilino,
      SolicitudVisita,
      Favorito,
      Propiedad,
    ]),
  ],
  controllers: [InquilinosController],
  providers: [InquilinosService],
  exports: [InquilinosService],
})
export class InquilinosModule {}
