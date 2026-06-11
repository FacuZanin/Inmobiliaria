

/**
 * Puerto de infraestructura para el sistema de cache de queries.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué una interfaz y no Redis directamente:
 *
 * 1. Testabilidad: los stages del pipeline pueden usar un InMemoryQueryCache
 *    en tests sin levantar Redis.
 *
 * 2. Flexibilidad: podemos tener MemoryQueryCache (proceso local, L1) +
 *    RedisQueryCache (distribuido, L2) con un TwoLevelQueryCache que intenta
 *    primero el L1 y luego el L2.
 *
 * 3. Evolución: si pasamos de Redis a Memcached o DynamoDB, solo cambia
 *    la implementación — ningún stage del pipeline se modifica.
 *
 * SEMÁNTICA:
 * - get retorna null si no está en cache (cache miss)
 * - get retorna el valor si está en cache (cache hit)
 * - set con ttl=0 significa "no expira" (usar con cuidado)
 * - invalidate elimina por clave exacta
 * - invalidateByTags elimina todo lo que tenga esas tags (cache invalidation pattern)
 */
export interface QueryCache {
  /**
   * Busca un valor en cache.
   * @returns El valor cacheado o null si no existe / expiró
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Guarda un valor en cache con TTL en segundos.
   * @param ttl - Tiempo de vida en segundos. 0 = sin expiración.
   */
  set<T>(key: string, value: T, ttl: number): Promise<void>;

  /**
   * Elimina una clave específica del cache.
   */
  invalidate(key: string): Promise<void>;

  /**
   * Elimina todas las claves asociadas a las tags dadas.
   *
   * PATRÓN — Tag-based invalidation:
   * Cuando se actualiza una propiedad con id='abc', se invalida la tag
   * 'entity:property:abc'. Todos los cache entries que tienen esa tag
   * son eliminados automáticamente — sin necesidad de conocer las keys exactas.
   *
   * Esto es fundamental para una proptech donde listings cambian frecuentemente
   * (precio actualizado, disponibilidad cambiada, etc.)
   */
  invalidateByTags(tags: readonly string[]): Promise<void>;

  /**
   * Verifica si una clave existe en cache sin traer el valor.
   * Útil para logging de hit rate sin deserializar el payload.
   */
  has(key: string): Promise<boolean>;
}