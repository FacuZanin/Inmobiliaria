// backend/src/core/infrastructure/persistence/typeorm/typeorm-entity.base.ts
import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// Base para TODAS las ORM entities de TypeORM.
// NO confundir con Entity del dominio — son modelos de persistencia.
// Separa el esquema de DB del modelo de negocio.
export abstract class TypeOrmEntityBase {
  @PrimaryColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
