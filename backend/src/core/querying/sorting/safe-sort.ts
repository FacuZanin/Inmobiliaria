export class SafeSort {
  static resolve<TField extends string>(
    requestedField: TField | undefined,
    allowedFields: readonly TField[],
    defaultField: TField,
  ): TField {
    if (requestedField && allowedFields.includes(requestedField)) {
      return requestedField;
    }

    return defaultField;
  }
}
