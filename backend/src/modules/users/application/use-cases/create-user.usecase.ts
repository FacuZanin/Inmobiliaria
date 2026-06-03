// backend\src\modules\user\application\use-cases\create-user.usecase.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY } from '../tokens';
import { CreateUserDto } from '../dto/create-user.dto';
import type { UserRepositoryPort } from '../ports/user-repository.port';
import { AuditService } from '../../../audit/application/audit.service';
import { UserMapper } from '../../domain/mappers/user.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,

    private readonly auditService: AuditService,
  ) {}

  async execute(dto: CreateUserDto) {
  const exists = await this.users.findByEmail(dto.email);
  if (exists) {
    throw new BadRequestException('Email ya registrado');
  }

  const created = await this.users.create(dto);

  await this.auditService.log({
    action: 'CREATE_USER',
    entity: 'User',
    entityId: created.id,
    newValue: created,
  });

  return UserMapper.toDomain(created);
}
}
