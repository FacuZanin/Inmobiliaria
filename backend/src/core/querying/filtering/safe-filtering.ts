export class SafeFiltering {
  static validateFields<TField extends string>(
    filters: readonly { field: TField }[],
    allowedFields: readonly TField[],
  ): void {
    const invalidField = filters.find(
      (filter) => !allowedFields.includes(filter.field),
    );

    if (invalidField) {
      throw new Error(`Invalid filter field: ${invalidField.field}`);
    }
  }
}
