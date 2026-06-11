import { TranslatedQueryResult } from '@/core/querying/application/execution/result/translated-query-result';

export interface QueryTranslator<
  TQuery,
  TExecutionPlan,
> {
  translate(
    query: Readonly<TQuery>,
  ): TranslatedQueryResult<TExecutionPlan>;
}