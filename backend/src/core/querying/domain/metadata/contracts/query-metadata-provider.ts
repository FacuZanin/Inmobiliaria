import type { QueryMetadataRegistry } from '../registries/query-metadata-registry';

// Puerto que cada módulo implementa para exponer su registry.
// Permite que el sistema de querying descubra los campos disponibles
// sin acoplarse a cada módulo directamente.
export interface IQueryMetadataProvider<TField extends string = string> {
  getRegistry(): QueryMetadataRegistry<TField>;
}