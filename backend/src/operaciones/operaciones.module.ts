import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operacion } from './entities/operacion.entity';
import { Propiedad } from '../propiedades/entities/propiedad.entity';
import { User } from '../users/user.entity/user.entity';
import { Agencia } from '../agencias/entities/agencia.entity';
import { OperacionesController } from './operaciones.controller';
import { OperacionesService } from './operaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operacion, Propiedad, Agencia, User]),
  ],
  controllers: [OperacionesController],
  providers: [OperacionesService],
})
export class OperacionesModule {}
