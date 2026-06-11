// backend/src/core/querying/application/caching/contracts/cache-policy.ts

import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';

/**
 * Define la política de caching para un tipo de query.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué policies separadas de la implementación:
 *
 * Diferentes tipos de queries tienen diferentes necesidades de cache:
 *
 * - listings de propiedades: TTL=60s, cacheable, tags=['listing']
 * - detalle de una propiedad: TTL=300s, tags=['entity:property:{id}']
 * - resultados de búsqueda con filtros complejos: TTL=30s o no cacheable
 * - queries de admin: NO cacheable (datos siempre frescos)
 * - queries con context sensible (viewerId): cacheable con key que incluye viewerId
 *
 * La policy encapsula estas decisiones. El stage de cache la consulta
 * para decidir si cachear y con qué TTL.
 *
 * IMPLEMENTACIONES TÍPICAS:
 * - TtlCachePolicy: siempre cachea con TTL fijo
 * - TenantCachePolicy: cachea por tenant con TTL configurable
 * - ProjectionCachePolicy: cachea solo para proyecciones específicas
 * - NoCachePolicy: nunca cachea (para datos sensibles o real-time)
 */
export interface CachePolicy {
  /**
   * Determina si una query debe ser cacheada.
   *
   * Se puede decidir basándose en el query (¿tiene filtros complejos?),
   * el contexto (¿es admin?) o cualquier otra heurística.
   */
  shouldCache(query: QueryNode, context?: QueryContext): boolean;

  /**
   * TTL en segundos para este tipo de query.
   * Solo llamado si shouldCache() retorna true.
   */
  getTtl(query: QueryNode, context?: QueryContext): number;

  /**
   * Tags para invalidación basada en eventos de dominio.
   *
   * Ejemplo: una query de propiedades de un listing retorna:
   *   ['listing', 'listing:tenant:{tenantId}', 'entity:property:{propertyId}']
   *
   * Cuando se actualiza una propiedad, se invalida 'entity:property:{id}'
   * y todos los cache entries con esa tag son eliminados.
   */
  getTags(query: QueryNode, context?: QueryContext): readonly string[];
}