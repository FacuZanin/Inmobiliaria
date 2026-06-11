export interface QueryContext {
  readonly tenantId?: string;

  readonly viewerId?: string;

  readonly locale?: string;

  readonly timezone?: string;

  readonly roles?: readonly string[];

  readonly permissions?: readonly string[];

  readonly scopes?: readonly string[];

  readonly requestId?: string;
}
