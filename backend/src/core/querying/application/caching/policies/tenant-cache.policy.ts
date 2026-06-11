import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';
import { CachePolicy } from '../contracts/cache-policy';

/**
 * Política de cache con isolation por tenant.
 *
 * SEGURIDAD CRÍTICA:
 * En un sistema multi-tenant (proptech con múltiples inmobiliarias),
 * el cache DEBE estar aislado por tenant. Esta política garantiza
 * que las tags incluyen el tenantId para que la invalidación sea
 * tenant-specific.
 *
 * Si el contexto no tiene tenantId, no se cachea.
 * Esto previene data-leaks entre tenants en casos edge.
 *
 * CONFIGURACIÓN TÍPICA para una proptech:
 *   listings: TTL=60s
 *   property detail: TTL=300s
 *   search results: TTL=30s
 */
export class TenantCachePolicy implements CachePolicy {
  constructor(
    private readonly ttlSeconds: number,
    private readonly resourceName: string,
  ) {}

  shouldCache(_query: QueryNode, context?: QueryContext): boolean {
    // SEGURIDAD: no cachear si no hay tenant identificado
    return !!context?.tenantId;
  }

  getTtl(_query: QueryNode, _context?: QueryContext): number {
    return this.ttlSeconds;
  }

  getTags(_query: QueryNode, context?: QueryContext): readonly string[] {
    const baseTags = [this.resourceName];

    if (context?.tenantId) {
      baseTags.push(`${this.resourceName}:tenant:${context.tenantId}`);
    }

    return baseTags;
  }
}