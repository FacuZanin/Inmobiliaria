// backend/src/core/domain/specification/or.specification.ts
import { Specification } from './specification.base';

export class OrSpecification<T> extends Specification<T> {
  constructor(
    private readonly left:  Specification<T>,
    private readonly right: Specification<T>,
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.left.isSatisfiedBy(candidate) ||
      this.right.isSatisfiedBy(candidate)
    );
  }
}