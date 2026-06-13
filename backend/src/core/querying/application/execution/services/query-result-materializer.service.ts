import { Injectable } from '@nestjs/common';
import { ProjectionRegistry } from '@/core/querying/domain/projections/registry/projection.registry';
import { DefaultProjectionSerializer } from '@/core/querying/application/serialization/contracts/projection.serializer';

/**
 * Servicio de materialización de resultados.
 *
 * RESPONSABILIDAD:
 * Toma raw results de TypeORM y los transforma a DTOs usando
 * la proyección registrada para el contexto dado.
 *
 * DECISIÓN — Por qué un servicio separado y no dentro del executor:
 * La materialización es un concern reutilizable. Los executors concretos
 * pueden usarla directamente sin duplicar la lógica de serialización.
 *
 * En un sistema con múltiples executors (TypeORM, Elasticsearch, Cache),
 * todos pueden compartir este materializador — la proyección es agnóstica
 * a la fuente de datos.
 *
 * EJEMPLO DE USO en un executor:
 *   const items = await this.materializer.materialize(
 *     rawRows,
 *     'listing:card',
 *   );
 */
@Injectable()
export class QueryResultMaterializerService {
  private readonly serializer = new DefaultProjectionSerializer();

  constructor(private readonly projectionRegistry: ProjectionRegistry) {}

  /**
   * Materializa una lista de raw rows usando la proyección nombrada.
   *
   * @param rawItems - Datos crudos de la DB (TypeORM getRawMany output)
   * @param projectionName - Nombre de la proyección registrada
   * @returns Items proyectados y serializados como TResult
   */
  materialize<TResult>(
    rawItems: readonly unknown[],
    projectionName: string,
  ): TResult[] {
    const projection = this.projectionRegistry.get(projectionName);

    return rawItems.map((raw) =>
      this.serializer.serialize(projection, raw),
    ) as TResult[];
  }

  /**
   * Materializa un único raw item.
   * Útil para detail queries (find-by-id).
   *
   * @throws si rawItem es null/undefined — el caller debe verificar existencia
   */
  materializeOne<TResult>(rawItem: unknown, projectionName: string): TResult {
    const projection = this.projectionRegistry.get(projectionName);
    return this.serializer.serialize(projection, rawItem) as TResult;
  }
}
