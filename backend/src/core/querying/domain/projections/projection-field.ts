// backend\src\core\querying\projections\contracts\projection-field.ts
export interface ProjectionField<
  TValue = unknown,
> {
  readonly name: string;

  resolve(input: unknown): TValue;
}