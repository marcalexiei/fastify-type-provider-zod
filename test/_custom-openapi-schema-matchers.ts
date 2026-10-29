import { Validator } from '@seriousme/openapi-schema-validator';
import { expect } from 'vitest';

interface CustomMatchers<Result = unknown> {
  toBeValidOpenAPISchema: () => Promise<Result>;
}

// https://vitest.dev/guide/extending-matchers
// oxlint-disable id-length, typescript/no-explicit-any, typescript/no-empty-object-type -- must match vitest's own declarations to merge
declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
// oxlint-enable id-length, typescript/no-explicit-any, typescript/no-empty-object-type

const validator = new Validator();

expect.extend({
  async toBeValidOpenAPISchema(
    this: { isNot: boolean },
    openAPISpecs: Record<string, unknown>,
  ): Promise<{ pass: boolean; message: () => string }> {
    const res = await validator.validate(openAPISpecs);

    const messages = [
      `OpenAPI schema is${this.isNot ? '' : ' not'} valid against ${validator.version}`,
    ];

    if (!res.valid) {
      messages.push(JSON.stringify(res.errors, null, 2));
    }

    return {
      pass: res.valid,
      message: () => messages.join('\n'),
    };
  },
});
