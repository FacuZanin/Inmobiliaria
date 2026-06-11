import { SortNode } from '@/querying/domain/ast/sorting/sort-node';
import { SortingNode } from '@/querying/domain/ast/sorting/sorting-node';
import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';
import { InvalidSortFieldException } from '../exceptions/invalid-sort-field.exception';

export class SortingValidator<TField extends string = string> {
  private static readonly MAX_SORT_FIELDS = 5;

  constructor(
    private readonly registry: QueryMetadataRegistry<TField>,
  ) {}

  /**
   * Valida un array de sort nodes.
   *
   * @param sorting - SortingNode = readonly SortNode[], no un SortNode individual
   * @throws {InvalidSortFieldException} si algún campo no es sortable
   */
  validate(sorting: SortingNode<TField>): void {
    if (sorting.length > SortingValidator.MAX_SORT_FIELDS) {
      throw new InvalidSortFieldException(
        `Too many sort fields: ${sorting.length} (max: ${SortingValidator.MAX_SORT_FIELDS})`,
      );
    }

    for (const sortNode of sorting) {
      this.validateSortNode(sortNode);
    }
  }

  private validateSortNode(sortNode: SortNode<TField>): void {
    const metadata = this.registry.getField(sortNode.field);

    if (!metadata) {
      throw new InvalidSortFieldException(sortNode.field);
    }

    if (!metadata.sortable) {
      throw new InvalidSortFieldException(
        `Field "${sortNode.field}" is not sortable`,
      );
    }
  }
}