

/**
 * Puerto para invalidación de cache desde el write-side (CQRS).
 *
 * DECISIÓN ARQUITECTÓNICA — Write-side triggering cache invalidation:
 *
 * En CQRS, cuando un CommandHandler modifica un aggregate, debe invalidar
 * el cache del read-side para que los próximos reads sean frescos.
 *
 * Este es el único punto de contacto entre write-side y read-side en
 * términos de cache. NO hay queries directas al cache desde el write-side.
 *
 * PATRÓN — Event-driven invalidation (preferido sobre direct invalidation):
 *
 * El método directo (llamar invalidateByTags en el CommandHandler) funciona,
 * pero acopla el write-side al sistema de cache del read-side.
 *
 * La alternativa enterprise: los CommandHandlers publican DomainEvents,
 * un CacheInvalidationEventHandler escucha esos eventos y llama invalidateByTags.
 * Esto desacopla completamente write y read side.
 *
 * @example — Uso desde un CommandHandler (directo, aceptable):
 *   await this.cacheInvalidator.invalidateByTags([
 *     `entity:property:${propertyId}`,
 *     'listing',  // invalida todos los listings cacheados
 *   ]);
 *
 * @example — Uso desde un EventHandler (desacoplado, preferido):
 *   // PropertyUpdatedEventHandler:
 *   await this.cacheInvalidator.invalidateByTags([
 *     `entity:property:${event.propertyId}`,
 *   ]);
 */
export interface CacheInvalidator {
  /**
   * Invalida todas las cache entries que tengan AL MENOS UNA de las tags dadas.
   * Operación eventual — no garantiza que el cache esté vacío al retornar.
   */
  invalidateByTags(tags: readonly string[]): Promise<void>;

  /**
   * Invalida una clave específica del cache.
   * Útil cuando la clave es conocida (ej: invalidar la proyección de un ID específico).
   */
  invalidateByKey(key: string): Promise<void>;

  /**
   * Invalida todo el cache de un recurso específico.
   * Operación costosa — usar solo en deploys o cambios de esquema.
   *
   * @param resourceName - ej: 'property', 'listing', 'user'
   */
  invalidateResource(resourceName: string): Promise<void>;
}