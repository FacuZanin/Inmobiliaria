import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PROPERTY_QUERY_REPOSITORY,
  PROPERTY_REPOSITORY,
} from './application/tokens';
import { ChangePropertyStatusUseCase } from './application/use-cases/change-property-status.usecase';
import { CreatePropertyUseCase } from './application/use-cases/create-property.usecase';
import { DeletePropertyUseCase } from './application/use-cases/delete-property.usecase';
import { GetPropertyUseCase } from './application/use-cases/get-property.usecase';
import { SearchPropertiesUseCase } from './application/use-cases/search-properties.usecase';
import { UpdatePropertyUseCase } from './application/use-cases/update-property.usecase';
import { PropertyOwnershipPolicy } from './application/policies/property-ownership.policy';
import { PropertyOrmEntity } from './infrastructure/persistence/typeorm/entities/property.orm-entity';
import { PropertyQueryRepository } from './infrastructure/repositories/property-query.repository';
import { PropertyRepository } from './infrastructure/repositories/property.repository';
import { PropertyAdminController } from './presentation/http/controllers/property-admin.controller';
import { PropertyOwnerController } from './presentation/http/controllers/property-owner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyOrmEntity])],
  controllers: [PropertyOwnerController, PropertyAdminController],
  providers: [
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyRepository,
    },
    {
      provide: PROPERTY_QUERY_REPOSITORY,
      useClass: PropertyQueryRepository,
    },
    PropertyOwnershipPolicy,
    CreatePropertyUseCase,
    GetPropertyUseCase,
    SearchPropertiesUseCase,
    UpdatePropertyUseCase,
    ChangePropertyStatusUseCase,
    DeletePropertyUseCase,
  ],
  exports: [PROPERTY_REPOSITORY, PROPERTY_QUERY_REPOSITORY],
})
export class PropertiesModule {}
