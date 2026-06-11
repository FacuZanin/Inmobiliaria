// backend/src/core/querying/domain/ast/pagination/cursor/cursor-encoder.ts
import { CursorToken } from './cursor-token';

export interface CursorPayload {
  /** Nombre del campo por el que se ordena (ej: 'createdAt', 'price'). */
  readonly field: string;

  /** Valor del campo en el registro "pivot". */
  readonly value: string | number | Date;

  /** UUID del registro pivot para desambiguar igualdades de valor. */
  readonly id: string;
}

export class CursorEncoder {

  static encode(payload: CursorPayload): CursorToken {
    const json = JSON.stringify(payload);
    const encoded = Buffer.from(json, 'utf-8').toString('base64url');

    return encoded as CursorToken;
  }

  static decode(token: CursorToken): CursorPayload {
    try {
      const json = Buffer.from(token, 'base64url').toString('utf-8');
      const payload = JSON.parse(json) as unknown;

      return CursorEncoder.validatePayload(payload);
    } catch {
      throw new InvalidCursorTokenException(token);
    }
  }

  private static validatePayload(payload: unknown): CursorPayload {
    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('field' in payload) ||
      !('value' in payload) ||
      !('id' in payload)
    ) {
      throw new Error('Malformed cursor payload');
    }

    const p = payload as Record<string, unknown>;

    if (typeof p['field'] !== 'string' || typeof p['id'] !== 'string') {
      throw new Error('Malformed cursor payload');
    }

    return payload as CursorPayload;
  }
}

export class InvalidCursorTokenException extends Error {
  constructor(token: string) {
    super(`Invalid or malformed cursor token: "${token.substring(0, 20)}..."`);
    this.name = 'InvalidCursorTokenException';
  }
}