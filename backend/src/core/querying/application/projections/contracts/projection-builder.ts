import { Projection } from '../../../domain/projections/projection';

export interface ProjectionBuilder {
  build<TResult = unknown>(
    projection: Projection<TResult>,
    input: unknown,
  ): TResult;
}