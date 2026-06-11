import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';
import { CachePolicy } from '../contracts/cache-policy';

/**
 * Política de cache con TTL fijo para todos los queries del recurso.
 *
 * USO: Para recursos con baja frecuencia de actualización donde
 * un TTL fijo es aceptable (ej: datos de configuración, catálogos).
 *
 * Para listings de propiedades que se actualizan frecuentemente,
 * preferir TenantCachePolicy con TTL más corto (30-60s).
 */
export class TtlCachePolicy implements CachePolicy {
  constructor(
    private readonly ttlSeconds: number,
    private readonly resourceTag: string,
  ) {}

  shouldCache(_query: QueryNode, _context?: QueryContext): boolean {
    return true;
  }

  getTtl(_query: QueryNode, _context?: QueryContext): number {
    return this.ttlSeconds;
  }

  getTags(_query: QueryNode, _context?: QueryContext): readonly string[] {
    return [this.resourceTag];
  }
}