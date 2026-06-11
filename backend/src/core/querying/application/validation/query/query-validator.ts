export interface QueryValidator<TQuery> {
  validate(query: Readonly<TQuery>): void;
}
