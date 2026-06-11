import { ProjectionSerializer } from './projection-serializer';

import { Projection } from '../../../domain/projections/projection';

export class DefaultProjectionSerializer
  implements ProjectionSerializer
{
  serialize<TResult>(
    projection: Projection<TResult>,
    input: unknown,
  ): TResult {
    return projection.serialize(input);
  }
}