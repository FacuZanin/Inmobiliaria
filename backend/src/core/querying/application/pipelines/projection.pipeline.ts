import { ExecutionContext } from '../execution/contracts/execution-context';
import { ExecutionStage } from '../execution/contracts/execution-stage';
import { ProjectionRegistry } from '@/core/querying/domain/projections/registry/projection.registry';
import { QueryExecutionContextFactory } from '../execution/context/query-execution-context';

/**
 * Stage que resuelve la proyección activa para la query.
 *
 * RESPONSABILIDAD ÚNICA:
 * Toma el nombre de proyección del QueryNode, busca en el ProjectionRegistry,
 * y enriquece el contexto con la proyección resuelta.
 *
 * Si no se especifica proyección, usa la proyección default del recurso.
 * La proyección default es responsabilidad del executor concreto, no de este stage.
 *
 * SEGURIDAD:
 * Este stage es el punto donde se aplica la lógica de "qué campos puede ver
 * este usuario". En una implementación completa, se podría verificar que
 * el usuario tiene permiso para usar la proyección solicitada.
 *
 * DECISIÓN: La proyección se resuelve ANTES del translation stage para que
 * el translator pueda seleccionar solo las columnas necesarias (SELECT a, b
 * en vez de SELECT *). Esto reduce el payload desde la DB significativamente
 * en proyecciones sparse como 'listing:map' (solo lat/lng/id).
 */
export class ProjectionResolutionStage<
  TField extends string = string,
  TExecutionPlan = unknown,
> implements ExecutionStage<TField, TExecutionPlan> {
  readonly name = 'projection-resolution';

  constructor(
    private readonly projectionRegistry: ProjectionRegistry,
    private readonly defaultProjectionName: string,
  ) {}

  async execute(
    context: ExecutionContext<TField, TExecutionPlan>,
  ): Promise<ExecutionContext<TField, TExecutionPlan>> {
    const projectionName =
      context.queryNode.projection ?? this.defaultProjectionName;

    const projection = this.projectionRegistry.get(projectionName);

    return QueryExecutionContextFactory.enrich(
      context,
      { projection },
      this.name,
    );
  }
}
