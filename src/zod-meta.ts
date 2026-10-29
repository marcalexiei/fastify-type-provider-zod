import type { JSONSchemaMeta } from 'zod/v4/core';

/**
 * Use this interface to type-check your data or define your custom schema
 */
export interface ZodOpenApiSchemaMetadata extends JSONSchemaMeta {
  /**
   * Use this to add examples to the generated openAPI spec
   */
  example?: unknown;
}

declare module 'zod/v4/core' {
  // oxlint-disable-next-line typescript/no-empty-object-type -- augments zod's own `GlobalMeta`
  interface GlobalMeta extends ZodOpenApiSchemaMetadata {}
}
