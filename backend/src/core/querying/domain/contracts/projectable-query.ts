export interface ProjectableQuery {
  /**
   * Nombre de la proyección a aplicar.
   * Debe estar registrada en ProjectionRegistry.
   * Si está ausente, se aplica la proyección default del recurso.
   */
  readonly projection?: string;
}