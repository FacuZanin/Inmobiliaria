// backend\src\modules\user\infrastructure\controllers\users.controller.ts
import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Get,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { Audit } from '../../../../shared/security/decorators/audit.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { AuditAction } from '@shared/contracts/enums/audit-action.enum';
import { AuditEntity } from '@shared/contracts/enums/audit-entity.enum';

import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { UpdateUserAdminUseCase } from '../../application/use-cases/update-user-admin.usecase';
import { UpdateMyProfileUseCase } from '../../application/use-cases/update-my-profile.usecase';
import { RestoreUserUseCase } from '../../application/use-cases/restore-user.usecase';
import { ListUsersUseCase } from '../../application/use-cases/list-users.usecase';
import { BecomeAgencyUseCase } from '../../application/use-cases/become-agency.usecase';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserAdminDto } from '../../application/dto/update-user-admin.dto';
import { UpdateMyProfileDto } from '../../application/dto/update-my-profile.dto';
import { UserFiltersDto } from '../../application/dto/user-filters.dto';

import { User } from '../../domain/entities/user.entity';

@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUC: CreateUserUseCase,
    private readonly updateUserAdminUC: UpdateUserAdminUseCase,
    private readonly updateMyProfileUC: UpdateMyProfileUseCase,
    private readonly restoreUserUC: RestoreUserUseCase,
    private readonly listUsersUC: ListUsersUseCase,
    private readonly becomeAgencyUC: BecomeAgencyUseCase,
  ) {}

  @Auth()
  @Get('me')
  getMe(@CurrentUser() user) {
    return user;
  }

  // 🛡️ SOLO SUPERADMIN
  @Get()
  @Auth(UserRole.SUPERADMIN)
  findAll(@Query() filters: UserFiltersDto) {
    return this.listUsersUC.execute(filters);
  }

  @Post()
  @Auth(UserRole.SUPERADMIN)
  @Audit({ action: AuditAction.CREATE_USER, entity: AuditEntity.USER })
  create(@Body() dto: CreateUserDto) {
    return this.createUserUC.execute(dto);
  }

  // 🔐 USUARIO LOGUEADO (solo su perfil)
  @Patch('me')
  @Auth()
  @Audit({ action: AuditAction.UPDATE_OWN_PROFILE, entity: AuditEntity.USER })
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateMyProfileDto) {
    return this.updateMyProfileUC.execute(user.id, dto);
  }

  // 🧨 ADMIN modifica cualquier usuario
  @Patch(':id')
  @Auth(UserRole.SUPERADMIN)
  @Audit({ action: AuditAction.UPDATE_USER, entity: AuditEntity.USER })
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAdminDto,
  ) {
    return this.updateUserAdminUC.execute(id, dto);
  }

  @Patch(':id/restore')
  @Auth(UserRole.SUPERADMIN)
  @Audit({ action: AuditAction.RESTORE_USER, entity: AuditEntity.USER })
  restore(@Param('id') id: string) {
    return this.restoreUserUC.execute(+id);
  }

  @Patch('become-agency')
  @Auth()
  becomeAgency(@CurrentUser() user: User) {
    return this.becomeAgencyUC.execute(user.id);
  }
}
