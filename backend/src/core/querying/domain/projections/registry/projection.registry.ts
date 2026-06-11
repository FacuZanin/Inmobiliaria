// backend/src/core/querying/domain/projections/registry/projection.registry.ts
import { Projection } from '@/core/querying/domain/projections/projection';

export class ProjectionRegistry {
  private readonly projections =
    new Map<string, Projection>();

  register<TResult>(
    projection: Projection<TResult>,
  ): void {
    this.projections.set(
      projection.definition.name,
      projection,
    );
  }

  get<TResult>(
    name: string,
  ): Projection<TResult> {
    const projection =
      this.projections.get(name);

    if (!projection) {
      throw new Error(
        `Projection "${name}" not found`,
      );
    }

    return projection as Projection<TResult>;
  }

  has(name: string): boolean {
    return this.projections.has(name);
  }
}