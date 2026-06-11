// Define un campo dentro de una proyección:
// de dónde viene en el raw result y cómo se llama en el output.
export interface ProjectionFieldDefinition {
  readonly outputName: string;   // nombre en el DTO de salida
  readonly sourcePath:  string;  // path en el raw result (ej: 'property_title')
  readonly transform?:  (value: unknown) => unknown; // transformación opcional
}