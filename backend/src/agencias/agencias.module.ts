import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenciasService } from './agencias.service';
import { AgenciasController } from './agencias.controller';
import { Agencia } from './entities/agencia.entity';
import { AgenciaSolicitud } from './entities/agencia-solicitud.entity';
import { User } from '../users/user.entity/user.entity';
import { AdminAgenciasController } from './admin-agencias.controller';
import { AdminAgenciasService } from './admin-agencias.service';


@Module({
  imports: [TypeOrmModule.forFeature([Agencia,AgenciaSolicitud, User])],
  controllers: [AgenciasController, AdminAgenciasController],
  providers: [AgenciasService, AdminAgenciasService],
  exports: [AgenciasService, AdminAgenciasService],
})
export class AgenciasModule {}
