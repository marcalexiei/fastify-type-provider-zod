import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import fastify from 'fastify';
import { assertType, describe, expectTypeOf, it } from 'vitest';
import { z } from 'zod/v4';

import type { ZodTypeProvider } from '../src/index.ts';
import {
  createSerializerCompiler,
  createValidatorCompiler,
} from '../src/index.ts';

describe('index', () => {
  it('FastifyZodInstance is compatible with FastifyInstance', () => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();

    type FastifyZodInstance = FastifyInstance<
      RawServerDefault,
      RawRequestDefaultExpression,
      RawReplyDefaultExpression,
      FastifyBaseLogger,
      ZodTypeProvider
    >;

    assertType<FastifyZodInstance>(
      app.setValidatorCompiler(createValidatorCompiler()),
    );
    assertType<FastifyZodInstance>(
      app.setSerializerCompiler(createSerializerCompiler()),
    );

    expectTypeOf(app).toExtend<FastifyInstance>();
    expectTypeOf(app).toExtend<FastifyZodInstance>();
  });

  it('should infer route types from zod schema', () => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();

    app.route({
      method: 'GET',
      url: '/',
      // Define your schema
      schema: {
        querystring: z.object({
          name: z.string().min(4),
        }),
        response: {
          200: z.string(),
        },
      },
      handler: (req, res) => {
        expectTypeOf(req.query.name).toBeString();
        res.send('string');
      },
    });
  });
});
