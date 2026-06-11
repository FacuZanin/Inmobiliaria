// backend\src\core\querying\projections\registry\projection-metadata.registry.ts
import { ProjectionDefinition } from '../value-objects/projection-definition';

export class ProjectionMetadataRegistry {
  private readonly definitions =
    new Map<string, ProjectionDefinition>();

  register(
    definition: ProjectionDefinition,
  ): void {
    this.definitions.set(
      definition.name,
      definition,
    );
  }

  get(
    name: string,
  ): ProjectionDefinition {
    const definition =
      this.definitions.get(name);

    if (!definition) {
      throw new Error(
        `Projection metadata "${name}" not found`,
      );
    }

    return definition;
  }
}