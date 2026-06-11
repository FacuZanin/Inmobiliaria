// backend/src/core/querying/domain/projections/projection.ts
import { ProjectionDefinition } from '@/core/querying/domain/projections/value-objects/projection-definition';

export interface Projection<TResult = unknown> {
  readonly definition: ProjectionDefinition;

  serialize(input: unknown): TResult;
}