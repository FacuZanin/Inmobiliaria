// backend\src\shared\utils\transformers\string.transformers.ts
import { TransformFnParams } from 'class-transformer';

export function capitalizeTransform({
  value,
}: TransformFnParams): string {
  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  );
}

export function uppercaseTransform({
  value,
}: TransformFnParams): string {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().toUpperCase();
}

export function lowercaseTransform({
  value,
}: TransformFnParams): string {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().toLowerCase();
}