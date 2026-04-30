// backend\src\modules\user\infrastructure\persistence\typeorm\user.typeorm.repository.ts
import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../application/ports/user-repository.port';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../application/dto/update-user.dto';
import { UserFiltersDto } from '../../../application/dto/user-filters.dto';

@Injectable()
export class UserTypeOrmRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findById(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['agencia'],
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      relations: ['agencia'],
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.repo.create(data as Partial<User>);
    return this.repo.save(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    await this.repo.update(id, data);

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('User not found after update');
    }

    return updated;
  }

  save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async softDelete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.repo.restore(id);
  }

  async findByIdIncludingDeleted(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      withDeleted: true,
      relations: ['agencia'],
    });
  }

  async findAll(filters: UserFiltersDto): Promise<User[]> {
    const qb = this.repo.createQueryBuilder('user');

    if (filters.includeDeleted) {
      qb.withDeleted();
    }

    if (filters.role) {
      qb.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.isActive !== undefined) {
     qb.andWhere('user.status = :status', {
  status: filters.isActive ? 'ACTIVE' : 'INACTIVE',
});
    }

    if (filters.search) {
      qb.andWhere('(user.email ILIKE :search OR user.nombre ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.createdFrom) {
      qb.andWhere('user.createdAt >= :from', { from: filters.createdFrom });
    }

    if (filters.createdTo) {
      qb.andWhere('user.createdAt <= :to', { to: filters.createdTo });
    }

    if (filters.orderBy) {
      qb.orderBy(`user.${filters.orderBy}`, filters.order ?? 'DESC');
    }

    return qb.getMany();
  }

  async incrementTokenVersion(userId: number): Promise<void> {
    await this.repo.increment({ id: userId }, 'tokenVersion', 1);
  }

  async getByIdOrFail(id: number): Promise<User> {
  const user = await this.findById(id);
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }
  return user;
}

async getByEmailOrFail(email: string): Promise<User> {
  const user = await this.findByEmail(email);
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }
  return user;
}

async getTokenVersion(userId: number): Promise<number> {
  const user = await this.repo.findOne({
    where: { id: userId },
    select: ['tokenVersion'],
  });

  return user?.tokenVersion ?? 0;
}


}
