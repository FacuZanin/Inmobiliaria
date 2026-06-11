// backend/src/core/querying/domain/projections/value-objects/projection-definition.ts
// Describe la estructura de una proyección: nombre y campos.
// Es un value object inmutable — no cambia una vez registrado.
export interface ProjectionDefinition {
  readonly name: string;
  readonly description?: string;
}