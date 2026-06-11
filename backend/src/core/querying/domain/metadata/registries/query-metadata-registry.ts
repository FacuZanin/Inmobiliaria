// backend/src/core/querying/domain/metadata/registries/query-metadata-registry.ts
import type { QueryFieldMetadata } from '../field/query-field-metadata';
import { QueryFieldNotFoundException } from '../exceptions/query-field-not-found.exception';

// Registry central de metadatos de campos de una entidad.
// Cada módulo (listings, users, etc.) crea su propio registro
// con los campos que expone para filtering/sorting/selection.
//
// Ejemplo de uso en el módulo listings:
//   const registry = new QueryMetadataRegistry<ListingField>([
//     { field: 'price',     type: 'number', databasePath: 'listing.price',
//       filterable: true, sortable: true,
//       allowedOperators: ['eq','gt','lt','gte','lte','between'] },
//     { field: 'status',    type: 'enum',   databasePath: 'listing.status',
//       filterable: true, allowedOperators: ['eq','in','neq'] },
//     { field: 'address',   type: 'string', databasePath: 'listing.address',
//       filterable: true, allowedOperators: ['contains','startsWith'] },
//   ]);
export class QueryMetadataRegistry<TField extends string = string> {
  private readonly fields = new Map<TField, QueryFieldMetadata<TField>>();

  constructor(fields: readonly QueryFieldMetadata<TField>[] = []) {
    for (const field of fields) {
      this.fields.set(field.field, field);
    }
  }

  register(field: QueryFieldMetadata<TField>): void {
    this.fields.set(field.field, field);
  }

  getField(field: TField): QueryFieldMetadata<TField> | undefined {
    return this.fields.get(field);
  }

  getFieldOrThrow(field: TField): QueryFieldMetadata<TField> {
    const metadata = this.fields.get(field);
    if (!metadata) {
      throw new QueryFieldNotFoundException(field);
    }
    return metadata;
  }

  getFilterableFields(): QueryFieldMetadata<TField>[] {
    return Array.from(this.fields.values()).filter((f) => f.filterable);
  }

  getSortableFields(): QueryFieldMetadata<TField>[] {
    return Array.from(this.fields.values()).filter((f) => f.sortable);
  }

  hasField(field: TField): boolean {
    return this.fields.has(field);
  }

  getAllFields(): QueryFieldMetadata<TField>[] {
    return Array.from(this.fields.values());
  }
}
