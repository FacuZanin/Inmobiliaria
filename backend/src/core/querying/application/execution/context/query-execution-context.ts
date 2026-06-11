import {
  ExecutionContext,
  ExecutionContextMetadata,
} from '../contracts/execution-context';
import { QueryRequest } from '@/core/querying/domain/contracts/query-request';

export class QueryExecutionContextFactory {
  static create<TField extends string, TExecutionPlan = unknown>(
    request: QueryRequest<TField>,
  ): ExecutionContext<TField, TExecutionPlan> {
    return {
      queryNode: request.query,
      queryContext: request.context,
      metadata: {
        requestId: request.context?.requestId,
        startedAt: new Date(),
        stages: [],
      },
    };
  }

  static enrich<TField extends string, TExecutionPlan = unknown>(
    context: ExecutionContext<TField, TExecutionPlan>,
    values: Partial<Omit<ExecutionContext<TField, TExecutionPlan>, 'metadata'>>,
    stage: string,
  ): ExecutionContext<TField, TExecutionPlan> {
    return {
      ...context,
      ...values,
      metadata: this.enrichMetadata(context.metadata, stage),
    };
  }

  private static enrichMetadata(
    metadata: ExecutionContextMetadata,
    stage: string,
  ): ExecutionContextMetadata {
    return {
      ...metadata,
      stages: [...metadata.stages, stage],
    };
  }
}
