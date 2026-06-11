import { FilterConditionNode } from '@/querying/domain/ast/filter/filter-condition-node';

import { FILTER_OPERATORS } from '@/querying/domain/ast/filter/filter-operator';

import { QUERY_FIELD_TYPES } from '@/querying/domain/metadata/field/query-field-type';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { InvalidFilterValueException } from '../exceptions/invalid-filter-value.exception';

export class FilterValueValidator<
  TField extends string = string,
> {
  constructor(
    private readonly registry: QueryMetadataRegistry<TField>,
  ) {}

  validate(
    condition: FilterConditionNode<TField>,
  ): void {
    const metadata =
      this.registry.getField(
        condition.field,
      );

    if (!metadata) {
      return;
    }

    const value = condition.value;

    switch (condition.operator) {
      case FILTER_OPERATORS.IS_NULL:
      case FILTER_OPERATORS.IS_NOT_NULL:
        this.validateNullabilityOperator(
          condition.field,
          value,
        );

        return;

      case FILTER_OPERATORS.IN:
      case FILTER_OPERATORS.NOT_IN:
        this.validateArrayOperator(
          condition.field,
          value,
        );

        return;

      case FILTER_OPERATORS.BETWEEN:
        this.validateBetweenOperator(
          condition.field,
          value,
        );

        return;
    }

    this.validateScalarValue(
      condition.field,
      metadata.type,
      value,
    );

    this.validateOperatorCompatibility(
      condition,
      metadata.type,
    );
  }

  private validateNullabilityOperator(
    field: TField,

    value: unknown,
  ): void {
    if (value !== null) {
      throw new InvalidFilterValueException(
        field,
      );
    }
  }

  private validateArrayOperator(
    field: TField,

    value: unknown,
  ): void {
    if (!Array.isArray(value)) {
      throw new InvalidFilterValueException(
        field,
      );
    }

    if (value.length === 0) {
      throw new InvalidFilterValueException(
        field,
      );
    }
  }

  private validateBetweenOperator(
    field: TField,

    value: unknown,
  ): void {
    if (!Array.isArray(value)) {
      throw new InvalidFilterValueException(
        field,
      );
    }

    if (value.length !== 2) {
      throw new InvalidFilterValueException(
        field,
      );
    }
  }

  private validateScalarValue(
    field: TField,

    type: string,

    value: unknown,
  ): void {
    if (Array.isArray(value)) {
      throw new InvalidFilterValueException(
        field,
      );
    }

    switch (type) {
      case QUERY_FIELD_TYPES.STRING:
      case QUERY_FIELD_TYPES.UUID:
      case QUERY_FIELD_TYPES.ENUM:
        if (
          typeof value !== 'string'
        ) {
          throw new InvalidFilterValueException(
            field,
          );
        }

        return;

      case QUERY_FIELD_TYPES.NUMBER:
        if (
          typeof value !== 'number'
        ) {
          throw new InvalidFilterValueException(
            field,
          );
        }

        return;

      case QUERY_FIELD_TYPES.BOOLEAN:
        if (
          typeof value !== 'boolean'
        ) {
          throw new InvalidFilterValueException(
            field,
          );
        }

        return;

      case QUERY_FIELD_TYPES.DATE:
        if (
          typeof value !== 'string'
        ) {
          throw new InvalidFilterValueException(
            field,
          );
        }

        return;
    }
  }

  private validateOperatorCompatibility(
    condition: FilterConditionNode<TField>,

    fieldType: string,
  ): void {
    const stringOperators = [
      FILTER_OPERATORS.CONTAINS,
      FILTER_OPERATORS.STARTS_WITH,
      FILTER_OPERATORS.ENDS_WITH,
    ];

    if (
      stringOperators.includes(
        condition.operator,
      ) &&
      fieldType !==
        QUERY_FIELD_TYPES.STRING
    ) {
      throw new InvalidFilterValueException(
        condition.field,
      );
    }
  }
}