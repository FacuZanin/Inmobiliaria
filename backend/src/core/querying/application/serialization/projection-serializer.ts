import { Projection } from '@/core/querying/domain/projections/projection';

export interface ProjectionSerializer {
  serialize<TResult>(
    projection: Projection<TResult>,
    input: unknown,
  ): TResult;
}
