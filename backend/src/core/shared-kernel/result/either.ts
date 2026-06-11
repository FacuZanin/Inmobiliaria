// backend/src/core/shared-kernel/result/either.ts
export type Left<L> = { readonly _tag: 'Left'; readonly left: L };
export type Right<R> = { readonly _tag: 'Right'; readonly right: R };
export type Either<L, R> = Left<L> | Right<R>;

export const Either = {
  left: <L>(left: L): Left<L> => ({ _tag: 'Left', left }),
  right: <R>(right: R): Right<R> => ({ _tag: 'Right', right }),
  isLeft: <L, R>(e: Either<L, R>): e is Left<L> => e._tag === 'Left',
  isRight: <L, R>(e: Either<L, R>): e is Right<R> => e._tag === 'Right',
};
