export class InvalidQueryDepthException extends Error {
  constructor() {
    super(
      'Maximum query depth exceeded',
    );
  }
}