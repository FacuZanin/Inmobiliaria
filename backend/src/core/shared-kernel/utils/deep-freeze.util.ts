// backend/src/core/shared-kernel/utils/deep-freeze.util.ts
// Congela recursivamente un objeto para garantizar inmutabilidad en runtime.
// Usado en ValueObject.constructor() además de Object.freeze() superficial.
// Importante en value objects compuestos como Address { street, city, country }.
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.getOwnPropertyNames(obj).forEach((name) => {
    const value = (obj as Record<string, unknown>)[name];
    if (value && typeof value === 'object') {
      deepFreeze(value as object);
    }
  });
  return Object.freeze(obj);
}