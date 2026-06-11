export interface ComputedFieldBuilder<
  TResult = unknown,
> {
  compute(input: unknown): TResult;
}