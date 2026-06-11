import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { QueryContext } from '@/core/querying/domain/ast/query/query-context';
import { CachePolicy } from '../contracts/cache-policy';

/**
 * Política de cache que solo cachea proyecciones específicas (allowlist).
 *
 * CASO DE USO:
 * En una proptech, no todas las proyecciones tienen sentido cachear:
 *
 * CACHEABLE (alta reutilización, datos poco volátiles):
 *   - 'listing:card'     → mostrado a miles de usuarios (alta reutilización)
 *   - 'listing:map'      → tiles del mapa (muy repetido, datos estables)
 *   - 'property:summary' → SEO cards, previsualización
 *
 * NO CACHEABLE (alta volatilidad o sensible a contexto):
 *   - 'property:admin'   → datos sensibles, no compartibles
 *   - 'user:profile'     → datos personales, altamente volátiles
 *   - custom projections → no previsibles
 *
 * Especificar proyecciones cacheables en la configuración del módulo,
 * no hardcodeado aquí. Esta clase es el mecanismo, no la configuración.
 */
export class ProjectionCachePolicy implements CachePolicy {
  constructor(
    private readonly cacheableProjections: Map<string, number>,
    private readonly resourceName: string,
  ) {}

  shouldCache(query: QueryNode, _context?: QueryContext): boolean {
    const projection = query.projection ?? 'default';
    return this.cacheableProjections.has(projection);
  }

  getTtl(query: QueryNode, _context?: QueryContext): number {
    const projection = query.projection ?? 'default';
    return this.cacheableProjections.get(projection) ?? 60;
  }

  getTags(query: QueryNode, context?: QueryContext): readonly string[] {
    const projection = query.projection ?? 'default';
    const tags = [
      this.resourceName,
      `${this.resourceName}:projection:${projection}`,
    ];

    if (context?.tenantId) {
      tags.push(`${this.resourceName}:tenant:${context.tenantId}`);
    }

    return tags;
  }

  /**
   * Factory method para crear la política con configuración fluida.
   *
   * @example
   *   ProjectionCachePolicy.configure('property')
   *     .cache('listing:card', 60)
   *     .cache('listing:map', 300)
   *     .build()
   */
  static configure(resourceName: string): ProjectionCachePolicyBuilder {
    return new ProjectionCachePolicyBuilder(resourceName);
  }
}

class ProjectionCachePolicyBuilder {
  private readonly projections = new Map<string, number>();

  constructor(private readonly resourceName: string) {}

  cache(projectionName: string, ttlSeconds: number): this {
    this.projections.set(projectionName, ttlSeconds);
    return this;
  }

  build(): ProjectionCachePolicy {
    return new ProjectionCachePolicy(this.projections, this.resourceName);
  }
}