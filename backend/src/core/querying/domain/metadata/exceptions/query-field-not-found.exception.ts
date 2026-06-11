// backend\src\core\querying\metadata\exceptions\query-field-not-found.exception.ts
export class QueryFieldNotFoundException extends Error {
  constructor(field: string) {
    super(
      `Query field "${field}" is not registered`,
    );
  }
}