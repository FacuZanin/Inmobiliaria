// backend/src/core/application/unit-of-work/unit-of-work.interface.ts
export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  // Ejecuta el callback dentro de una única transacción.
  // Si lanza, hace rollback automático y re-lanza el error.
  withTransaction<T>(work: () => Promise<T>): Promise<T>;

  // Accede al repositorio que comparte el QueryRunner activo.
  // El token es el injection token de NestJS (símbolo o clase).
  getRepository<T>(token: symbol | (new (...args: any[]) => T)): T;
}
