import type { FastifySchemaValidationError } from 'fastify';
import { describe, expectTypeOf, it } from 'vitest';

import type { ZodFastifySchemaValidationError } from '../src/index.ts';
import { hasZodFastifySchemaValidationErrors } from '../src/index.ts';

describe('ZodFastifySchemaValidationError type', () => {
  it('should be assignable to FastifySchemaValidationError', () => {
    expectTypeOf<ZodFastifySchemaValidationError>().toExtend<FastifySchemaValidationError>();
  });

  // oxlint-disable-next-line vitest/prefer-describe-function-title -- typecheck mode prints a function title as compiled code
  describe('hasZodFastifySchemaValidationErrors', () => {
    it('should narrow type to ZodFastifySchemaValidationError', () => {
      const error: unknown = {};
      // oxlint-disable-next-line vitest/no-conditional-in-test -- the guard is what narrows the type under test
      if (hasZodFastifySchemaValidationErrors(error)) {
        expectTypeOf<ZodFastifySchemaValidationError>().toEqualTypeOf(error.validation[0]);

        for (const validationError of error.validation) {
          expectTypeOf<ZodFastifySchemaValidationError>().toEqualTypeOf(validationError);
        }
      }
    });
  });
});
