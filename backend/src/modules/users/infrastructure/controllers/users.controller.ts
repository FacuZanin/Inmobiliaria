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

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';
import { Audit } from '@/security/decorators/audit.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';
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
import { UserResponseDto } from '../../application/dto/user-response.dto';

import { User } from '../../domain/entities/user.entity';

@ApiTags('Users')
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

  @Get('me')
  @Auth()
  @ApiOperation({
    summary: 'Obtener usuario autenticado',
  })
  @ApiOkResponse({
    description: 'Usuario autenticado',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autenticado',
  })
  getMe(@CurrentUser() user: User) {
    return user;
  }

  // 🛡️ SOLO SUPERADMIN
  @ApiOperation({
    summary: 'Listar usuarios',
  })
  @ApiOkResponse({
    description: 'Listado de usuarios',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'Solo SUPERADMIN',
  })
  @Get()
  @Auth(Permission.USER_READ)
  findAll(@Query() filters: UserFiltersDto) {
    return this.listUsersUC.execute(filters);
  }

  @ApiOperation({
    summary: 'Crear usuario manualmente',
  })
  @ApiCreatedResponse({
    description: 'Usuario creado',
    type: UserResponseDto,
  })
  @Post()
  @Auth(Permission.USER_CREATE)
  @Audit({ action: AuditAction.CREATE_USER, entity: AuditEntity.USER })
  create(@Body() dto: CreateUserDto) {
    return this.createUserUC.execute(dto);
  }

  // 🔐 USUARIO LOGUEADO (solo su perfil)
  @ApiOperation({
    summary: 'Actualizar mi perfil',
  })
  @ApiOkResponse({
    description: 'Perfil actualizado',
    type: UserResponseDto,
  })
  @Patch('me')
  @Auth()
  @Audit({ action: AuditAction.UPDATE_OWN_PROFILE, entity: AuditEntity.USER })
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateMyProfileDto) {
    return this.updateMyProfileUC.execute(user.id, dto);
  }

  // 🧨 ADMIN modifica cualquier usuario
  @ApiOperation({
    summary: 'Actualizar usuario por admin',
  })
  @ApiOkResponse({
    description: 'Usuario actualizado',
    type: UserResponseDto,
  })
  @Patch(':id')
  @Auth(Permission.USER_UPDATE)
  @Audit({ action: AuditAction.UPDATE_USER, entity: AuditEntity.USER })
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAdminDto,
  ) {
    return this.updateUserAdminUC.execute(id, dto);
  }

  @ApiOperation({
    summary: 'Restaurar usuario eliminado',
  })
  @Patch(':id/restore')
  @Auth(Permission.USER_RESTORE)
  @Audit({ action: AuditAction.RESTORE_USER, entity: AuditEntity.USER })
  restore(@Param('id') id: string) {
    return this.restoreUserUC.execute(+id);
  }

  @ApiOperation({
    summary: 'Convertirse en agencia',
  })
  @Patch('become-agency')
  @Auth(Permission.PROFILE_UPDATE)
  becomeAgency(@CurrentUser() user: User) {
    return this.becomeAgencyUC.execute(user.id);
  }
}
