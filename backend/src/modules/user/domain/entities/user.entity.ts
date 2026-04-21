// backend\src\modules\user\domain\entities\user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { Agencia } from '../../../agencias/domain/entities/agencia.entity';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/enums/user-profile.enum';
import { UserStatus } from '@shared/contracts/enums/user-status.enum';

import { RefreshToken } from '@/modules/auth/infrastructure/entities/refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserProfile,
    nullable: true,
  })
  profile!: UserProfile | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono!: string | null;

  @ManyToOne(() => Agencia, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  agencia!: Agencia | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: 0 })
  tokenVersion!: number;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  refreshTokenHash!: string | null;

  
}
