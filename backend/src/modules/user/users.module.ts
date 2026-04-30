// backend\src\modules\user\users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './domain/entities/user.entity';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/user.typeorm.repository';

import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.usecase';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.usecase';
import { UpdateUserAdminUseCase } from './application/use-cases/update-user-admin.usecase';
import { UpdateMyProfileUseCase } from './application/use-cases/update-my-profile.usecase';
import { RestoreUserUseCase } from './application/use-cases/restore-user.usecase';
import { ListUsersUseCase } from './application/use-cases/list-users.usecase';

import { AgenciasModule } from '../agencias/agencias.module';

import { USER_REPOSITORY } from './application/tokens';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuditModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AgenciasModule),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    UpdateUserAdminUseCase,
    UpdateMyProfileUseCase,
    RestoreUserUseCase,
    ListUsersUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
  ],
  exports: [
    USER_REPOSITORY,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
  ],
})
export class UsersModule {}
