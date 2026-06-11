// backend/src/core/querying/application/caching/contracts/cache-key-builder.ts

import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';

/**
 * Contrato para builders de cache keys deterministas.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué keys deterministas:
 *
 * Dos requests idénticos DEBEN producir la misma cache key.
 * Esto requiere:
 * 1. Serialización canónica del QueryNode (mismo orden de campos)
 * 2. Inclusión del tenant para multi-tenancy (usuario A no ve cache de usuario B)
 * 3. Inclusión de la proyección (listing:card ≠ listing:detail)
 * 4. Versión del esquema (para invalidación por deployment)
 *
 * SEGURIDAD CRÍTICA — Isolation por tenant:
 * En una proptech multi-tenant, una cache key que NO incluya el tenantId
 * podría retornar datos de otro usuario. Esto es un data-leak silencioso.
 *
 * El CacheKeyBuilder DEBE incluir siempre el contexto de seguridad
 * relevante para el recurso (tenantId, viewerId, scopes).
 */
export interface CacheKeyBuilder {
  /**
   * Construye la cache key para una query específica.
   *
   * @param resourceName - Nombre del recurso (ej: 'property', 'listing')
   * @param queryNode - El query AST a cachear
   * @param context - Contexto de seguridad (tenant, viewer, etc.)
   * @returns Key determinista única para esta combinación
   */
  build(
    resourceName: string,
    queryNode: QueryNode,
    context?: QueryContext,
  ): string;
}