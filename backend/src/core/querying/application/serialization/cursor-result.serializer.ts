import { CursorResponse } from '../../contracts/cursor-response';

export class CursorResultSerializer {
  serialize<TResult>(
    payload: CursorResponse<TResult>,
  ): CursorResponse<TResult> {
    return payload;
  }
}