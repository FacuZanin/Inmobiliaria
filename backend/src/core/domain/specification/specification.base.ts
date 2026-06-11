// backend/src/core/domain/specification/specification.base.ts
import { AndSpecification } from './and.specification';
import { OrSpecification } from './or.specification';
import { NotSpecification } from './not.specification';

export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): AndSpecification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): OrSpecification<T> {
    return new OrSpecification(this, other);
  }

  not(): NotSpecification<T> {
    return new NotSpecification(this);
  }
}
