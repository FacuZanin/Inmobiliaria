// backend\src\modules\user\application\ports\user-repository.port.ts
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserRepositoryPort {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByIdIncludingDeleted(id: number): Promise<User | null>;
  update(id: number, data: Partial<User>): Promise<User>;
  save(user: User): Promise<User>;
  softDelete(id: number): Promise<void>;
  restore(id: number): Promise<void>;
  findAll(filters: any): Promise<User[]>;
  incrementTokenVersion(userId: number): Promise<void>;
  getByIdOrFail(id: number): Promise<User>;
  getByEmailOrFail(email: string): Promise<User>;
  getTokenVersion(userId: number): Promise<number>;
  create(data: Partial<User>): Promise<User>;
}
