// backend/src/core/infrastructure/persistence/typeorm/typeorm-unit-of-work.ts
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import type { IUnitOfWork } from '../../../application/unit-of-work/unit-of-work.interface';

@Injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
  // queryRunner activo durante la transacción, null fuera de ella
  private _queryRunner: QueryRunner | null = null;

  constructor(private readonly dataSource: DataSource) {}

  async begin(): Promise<void> {
    this._queryRunner = this.dataSource.createQueryRunner();
    await this._queryRunner.connect();
    await this._queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this._queryRunner) throw new Error('No hay transacción activa');
    await this._queryRunner.commitTransaction();
    await this._queryRunner.release();
    this._queryRunner = null;
  }

  async rollback(): Promise<void> {
    if (!this._queryRunner) throw new Error('No hay transacción activa');
    await this._queryRunner.rollbackTransaction();
    await this._queryRunner.release();
    this._queryRunner = null;
  }

  async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    await this.begin();
    try {
      const result = await work();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  // Retorna un repositorio que usa el QueryRunner activo.
  // Se llama desde los CommandHandlers para operar dentro de la tx.
  getRepository<T>(EntityClass: new () => T): any {
    if (!this._queryRunner) {
      throw new Error(
        'getRepository() debe llamarse dentro de withTransaction()',
      );
    }
    return this._queryRunner.manager.getRepository(EntityClass);
  }
}
