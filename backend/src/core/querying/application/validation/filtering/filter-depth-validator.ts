import { FilterGroupNode } from '@/core/querying/domain/ast/filter/filter-group-node';

import { FilterNode } from '@/core/querying/domain/ast/filter/filter-node';

import { InvalidQueryDepthException } from '../exceptions/invalid-query-depth.exception';

export class FilterDepthValidator<
  TField extends string = string,
> {
  constructor(
    private readonly maxDepth: number = 5,
  ) {}

  validate(
    node: FilterNode<TField>,
  ): void {
    this.validateDepth(node, 0);
  }

  private validateDepth(
    node: FilterNode<TField>,

    currentDepth: number,
  ): void {
    if (
      currentDepth >
      this.maxDepth
    ) {
      throw new InvalidQueryDepthException();
    }

    if (node.type !== 'group') {
      return;
    }

    for (const child of node.children) {
      this.validateDepth(
        child,
        currentDepth + 1,
      );
    }
  }
}