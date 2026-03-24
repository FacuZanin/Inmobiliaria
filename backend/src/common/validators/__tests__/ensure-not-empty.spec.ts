import { ensureNotEmpty } from '../ensure-not-empty';

describe('ensureNotEmpty', () => {
  it('throws when dto is empty', () => {
    expect(() => ensureNotEmpty({})).toThrow();
  });

  it('does not throw when dto has values', () => {
    expect(() => ensureNotEmpty({ name: 'John' })).not.toThrow();
  });
});
