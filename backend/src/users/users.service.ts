import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // --------------------------------------------------------
  // CREATE — SOLO ADMIN CREA USUARIOS
  // --------------------------------------------------------
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashed,
    });

    return this.usersRepository.save(user);
  }

  // Lista general
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // --------------------------------------------------------
  // FIND ONE NORMAL
  // --------------------------------------------------------
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // --------------------------------------------------------
  // FIND ONE CON PERMISOS
  // --------------------------------------------------------
  async findOneWithPermissions(id: number, usuarioActual: User): Promise<User> {
    const user = await this.findOne(id);

    // ADMIN = puede ver todo
    if (usuarioActual.role === UserRole.ADMIN) return user;

    // AGENCIA = solo usuarios de su agencia
    if (usuarioActual.role === UserRole.AGENCIA) {
      if (user.agenciaId !== usuarioActual.agenciaId) {
        throw new ForbiddenException('No puedes ver usuarios de otras agencias');
      }
      return user;
    }

    // EMPLEADO = solo se puede ver a sí mismo
    if (usuarioActual.role === UserRole.EMPLEADO) {
      if (usuarioActual.id !== user.id) {
        throw new ForbiddenException('No puedes ver otros usuarios');
      }
      return user;
    }

    // Otros roles
    throw new ForbiddenException('Acceso denegado');
  }

  // --------------------------------------------------------
  // UPDATE CON PERMISOS
  // --------------------------------------------------------
  async updateWithPermissions(
    id: number,
    dto: UpdateUserDto,
    usuarioActual: User,
  ): Promise<User> {
    const user = await this.findOne(id);

    // ADMIN modifica todo
    if (usuarioActual.role === UserRole.ADMIN) {
      Object.assign(user, dto);
      return this.usersRepository.save(user);
    }

    // AGENCIA solo modifica sus empleados
    if (usuarioActual.role === UserRole.AGENCIA) {
      if (user.agenciaId !== usuarioActual.agenciaId) {
        throw new ForbiddenException(
          'No puedes modificar usuarios de otras agencias',
        );
      }
      Object.assign(user, dto);
      return this.usersRepository.save(user);
    }

    // EMPLEADO solo puede modificarse a si mismo
    if (usuarioActual.role === UserRole.EMPLEADO) {
      if (user.id !== usuarioActual.id) {
        throw new ForbiddenException('No puedes modificar a otros usuarios');
      }
      Object.assign(user, dto);
      return this.usersRepository.save(user);
    }

    throw new ForbiddenException('Acceso denegado');
  }

  // --------------------------------------------------------
  // UPDATE NORMAL
  // --------------------------------------------------------
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  // --------------------------------------------------------
  // DELETE — SOLO ADMIN
  // --------------------------------------------------------
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
