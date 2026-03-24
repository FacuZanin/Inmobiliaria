// backend\src\modules\operaciones\operaciones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperacionesController } from './operaciones.controller';

// ORM ENTITY (ojo acá, te marco algo abajo)
import { Operacion } from './infrastructure/persistence/typeorm/entities/operacion.entity';

// REPOSITORY
import { OperacionTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/operacion.typeorm.repository';

// TOKEN
import { OPERACION_REPOSITORY } from './application/tokens';

// USE CASES
import { CreateOperacionUseCase } from './application/use-cases/create-operacion.usecase';
import { ListOperacionesUseCase } from './application/use-cases/list-operaciones.usecase';
import { FindOperacionByIdUseCase } from './application/use-cases/find-operacion-by-id.usecase';
import { UpdateOperacionUseCase } from './application/use-cases/update-operacion.usecase';
import { ReservarOperacionUseCase } from './application/use-cases/reservar-operacion.usecase';
import { ProcesarOperacionUseCase } from './application/use-cases/procesar-operacion.usecase';
import { FinalizarOperacionUseCase } from './application/use-cases/finalizar-operacion.usecase';
import { CancelarOperacionUseCase } from './application/use-cases/cancel-operacion.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operacion]),
  ],
  controllers: [OperacionesController],
  providers: [
    {
      provide: OPERACION_REPOSITORY,
      useClass: OperacionTypeOrmRepository,
    },

    // UseCases
    CreateOperacionUseCase,
    ListOperacionesUseCase,
    FindOperacionByIdUseCase,
    UpdateOperacionUseCase,
    ReservarOperacionUseCase,
    ProcesarOperacionUseCase,
    FinalizarOperacionUseCase,
    CancelarOperacionUseCase,
  ],
})
export class OperacionesModule {}
