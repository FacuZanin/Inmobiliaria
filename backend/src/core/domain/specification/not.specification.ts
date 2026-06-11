// backend/src/core/domain/specification/not.specification.ts
import { Specification } from './specification.base';

export class NotSpecification<T> extends Specification<T> {
  constructor(private readonly inner: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.inner.isSatisfiedBy(candidate);
  }
}
