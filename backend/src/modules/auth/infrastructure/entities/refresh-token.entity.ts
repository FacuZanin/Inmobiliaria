// backend\src\modules\auth\infrastructure\entities\refresh-token.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { User } from '@/modules/user/domain/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 🔐 hash del token (NUNCA el token plano)
  @Column()
  @Index()
  tokenHash!: string;

  // ⏳ expiración
  @Column()
  expiresAt!: Date;

  // 🚫 si fue revocado (logout, seguridad, etc.)
  @Column({ default: false })
  revoked!: boolean;

  // 🔁 para detectar reutilización (ataques)
  @Column({ nullable: true })
  replacedByToken!: string;

  // 📅 auditoría
  @CreateDateColumn()
  createdAt!: Date;

  // 👤 relación con usuario
  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @Column({ nullable: true })
  ip?: string;

  @Column({ nullable: true })
  userAgent?: string;
}
