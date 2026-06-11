import { ProjectionBuilder } from '../contracts/projection-builder';

import { Projection } from '../../../domain/projections/projection';

export class RelationProjectionBuilder
  implements ProjectionBuilder
{
  build<TResult>(
    projection: Projection<TResult>,
    input: unknown,
  ): TResult {
    return projection.serialize(input);
  }
}