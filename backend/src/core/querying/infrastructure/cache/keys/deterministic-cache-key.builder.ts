// backend/src/core/querying/caching/keys/deterministic-cache-key.builder.ts

import { createHash } from 'crypto';
import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';
import { CacheKeyBuilder } from '../../../application/caching/contracts/cache-key-builder';

/**
 * Builder de cache keys deterministas basado en SHA-256.
 *
 * ALGORITMO:
 * 1. Serializa el QueryNode de forma canónica (keys ordenadas)
 * 2. Incluye contexto de seguridad relevante (tenantId, scopes)
 * 3. Incluye el nombre del recurso y la proyección
 * 4. Hashea todo con SHA-256 y toma los primeros 32 chars (128 bits)
 *
 * SEGURIDAD:
 * SHA-256 garantiza que queries diferentes producen keys diferentes.
 * Los primeros 32 chars (16 bytes = 128 bits) tienen probabilidad de
 * colisión de 1/2^128 — aceptable para cache keys.
 *
 * NOTA — No usamos MD5:
 * Aunque MD5 es suficiente para cache keys (no es uso criptográfico),
 * muchas auditorías de seguridad empresariales lo rechazan.
 * SHA-256 truncado es la opción pragmática.
 *
 * CANONICAL SERIALIZATION:
 * JSON.stringify({ b: 1, a: 2 }) ≠ JSON.stringify({ a: 2, b: 1 })
 * Necesitamos ordenar las keys para que el mismo query producca el mismo hash
 * independientemente del orden en que se construyó el objeto.
 */
export class DeterministicCacheKeyBuilder implements CacheKeyBuilder {
  /** Prefijo del proyecto/servicio para namespacing en Redis compartido. */
  private static readonly KEY_PREFIX = 'qry';

  /** Versión del esquema de cache. Incrementar en breaking changes. */
  private static readonly SCHEMA_VERSION = 'v1';

  build(
    resourceName: string,
    queryNode: QueryNode,
    context?: QueryContext,
  ): string {
    const payload = this.buildPayload(resourceName, queryNode, context);
    const canonical = this.toCanonicalJson(payload);
    const hash = this.hash(canonical);

    return [
      DeterministicCacheKeyBuilder.KEY_PREFIX,
      DeterministicCacheKeyBuilder.SCHEMA_VERSION,
      resourceName,
      hash,
    ].join(':');
  }

  private buildPayload(
    resourceName: string,
    queryNode: QueryNode,
    context?: QueryContext,
  ): Record<string, unknown> {
    return {
      resource: resourceName,
      projection: queryNode.projection ?? 'default',
      filters: queryNode.filters,
      sorting: queryNode.sorting,
      pagination: queryNode.pagination,
      // SEGURIDAD: incluir solo datos de seguridad, no PII
      tenantId: context?.tenantId,
      viewerId: context?.viewerId,
      scopes: context?.scopes ? [...context.scopes].sort() : undefined,
    };
  }

  /**
   * Serialización canónica: ordena keys recursivamente.
   * Garantiza que { a: 1, b: 2 } === { b: 2, a: 1 } produzcan el mismo string.
   */
  private toCanonicalJson(value: unknown): string {
    return JSON.stringify(this.sortDeep(value));
  }

  private sortDeep(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortDeep(item));
    }

    if (value !== null && typeof value === 'object') {
      const sorted: Record<string, unknown> = {};
      const keys = Object.keys(value as Record<string, unknown>).sort();

      for (const key of keys) {
        sorted[key] = this.sortDeep((value as Record<string, unknown>)[key]);
      }

      return sorted;
    }

    return value;
  }

  private hash(input: string): string {
    return createHash('sha256').update(input).digest('hex').slice(0, 32);
  }
}