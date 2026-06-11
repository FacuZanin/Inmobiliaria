// backend/src/core/querying/caching/keys/projection-cache-key.builder.ts

import { createHash } from 'crypto';
import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';
import { CacheKeyBuilder } from '../../../application/caching/contracts/cache-key-builder';

/**
 * Cache key builder especializado que incluye la proyección como parte
 * explícita de la key (no solo como hash).
 *
 * DECISIÓN — Cuándo usar este en lugar de DeterministicCacheKeyBuilder:
 *
 * En sistemas donde:
 * 1. Se necesita invalidar el cache por proyección específica
 *    (ej: cuando cambia el esquema de 'listing:card', invalidar solo esas keys)
 * 2. Se necesita monitorear el hit rate por proyección
 *    (ej: 'listing:map' tiene 95% hit rate, 'listing:detail' tiene 60%)
 *
 * La proyección es visible en la key: qry:v1:property:listing:card:{hash}
 * En vez de: qry:v1:property:{hash} (donde la proyección está dentro del hash)
 *
 * Para la mayoría de casos, DeterministicCacheKeyBuilder es suficiente.
 * Usar este cuando se necesita granularidad de monitoreo por proyección.
 */
export class ProjectionCacheKeyBuilder implements CacheKeyBuilder {
  private static readonly KEY_PREFIX = 'qry';
  private static readonly SCHEMA_VERSION = 'v1';

  build(
    resourceName: string,
    queryNode: QueryNode,
    context?: QueryContext,
  ): string {
    const projectionName = queryNode.projection ?? 'default';

    // El hash excluye la proyección (ya está explícita en la key)
    const payload = {
      filters: queryNode.filters,
      sorting: queryNode.sorting,
      pagination: queryNode.pagination,
      tenantId: context?.tenantId,
      viewerId: context?.viewerId,
      scopes: context?.scopes ? [...context.scopes].sort() : undefined,
    };

    const hash = createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex')
      .slice(0, 24);

    return [
      ProjectionCacheKeyBuilder.KEY_PREFIX,
      ProjectionCacheKeyBuilder.SCHEMA_VERSION,
      resourceName,
      projectionName,
      hash,
    ].join(':');
  }
}