import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod/v4';
import type { ZodTypeProvider } from '../src/index.ts';
import {
  createSerializerCompiler,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
} from '../src/index.ts';

describe('response schema', () => {
  describe('does not fail on empty response schema (204)', () => {
    let app: FastifyInstance;
    beforeAll(async () => {
      app = Fastify();
      app.setValidatorCompiler(validatorCompiler);
      app.setSerializerCompiler(serializerCompiler);

      app
        .withTypeProvider<ZodTypeProvider>()
        .route({
          method: 'GET',
          url: '/',
          schema: {
            response: {
              204: z.undefined().describe('test'),
            },
          },
          handler: (_req, res) => {
            res.status(204).send();
          },
        })
        .route({
          method: 'GET',
          url: '/incorrect',
          schema: {
            response: {
              204: z.undefined().describe('test'),
            },
          },
          handler: (_req, res) => {
            // @ts-expect-error
            res.status(204).send({ id: 1 });
          },
        });

      app.setErrorHandler((err, _req, reply) => {
        if (isResponseSerializationError(err)) {
          return reply.code(500).send({
            error: 'Internal Server Error',
            message: "Response doesn't match the schema",
            statusCode: 500,
            details: {
              issues: err.cause.issues,
              method: err.method,
              url: err.url,
            },
          });
        }
        throw err;
      });
      await app.ready();

      return async () => {
        await app.close();
      };
    });

    it('returns 204', async () => {
      const response = await app.inject().get('/');

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual('');
    });

    it('throws on non-empty', async () => {
      const response = await app.inject().get('/incorrect');

      expect(response.statusCode).toBe(500);
      expect(response.json()).toMatchInlineSnapshot(`
        {
          "details": {
            "issues": [
              {
                "code": "invalid_type",
                "expected": "undefined",
                "message": "Invalid input: expected undefined, received object",
                "path": [],
              },
            ],
            "method": "GET",
            "url": "/incorrect",
          },
          "error": "Internal Server Error",
          "message": "Response doesn't match the schema",
          "statusCode": 500,
        }
      `);
    });
  });

  describe('correctly processes response schema (string)', () => {
    let app: FastifyInstance;
    beforeAll(async () => {
      const REPLY_SCHEMA = z.string();

      app = Fastify();
      app.setValidatorCompiler(validatorCompiler);
      app.setSerializerCompiler(serializerCompiler);

      app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/',
        schema: {
          response: {
            200: REPLY_SCHEMA,
          },
        },
        handler: (_req, res) => {
          res.send('test');
        },
      });

      app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/incorrect',
        schema: {
          response: {
            200: REPLY_SCHEMA,
          },
        },
        handler: (_req, res) => {
          // @ts-expect-error need to test error
          res.send({ name: 'test' });
        },
      });

      await app.ready();

      return async () => {
        await app.close();
      };
    });

    it('returns 200 on correct response', async () => {
      const response = await app.inject().get('/');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual('test');
    });

    it('returns 500 on incorrect response', async () => {
      const response = await app.inject().get('/incorrect');

      expect(response.statusCode).toBe(500);
      expect(response.json()).toMatchInlineSnapshot(
        `
        {
          "code": "FST_ERR_RESPONSE_SERIALIZATION",
          "error": "Internal Server Error",
          "message": "Response doesn't match the schema",
          "statusCode": 500,
        }
      `,
      );
    });
  });

  describe('correctly processes response schema (object)', () => {
    let app: FastifyInstance;
    beforeEach(async () => {
      const REPLY_SCHEMA = z.object({
        name: z.string(),
      });

      app = Fastify();
      app.setValidatorCompiler(validatorCompiler);
      app.setSerializerCompiler(serializerCompiler);

      app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/',
        schema: {
          response: {
            200: REPLY_SCHEMA,
          },
        },
        handler: (_req, res) => {
          res.send({
            name: 'test',
          });
        },
      });

      app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/incorrect',
        schema: {
          response: {
            200: REPLY_SCHEMA,
          },
        },
        handler: (_req, res) => {
          // @ts-expect-error passing string to a object schema to test errors
          res.send('test');
        },
      });

      await app.ready();

      return async (): Promise<void> => {
        await app.close();
      };
    });

    it('returns 200 for correct response', async () => {
      const response = await app.inject().get('/');

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        name: 'test',
      });
    });
  });

  describe('correctly replaces date in stringified response', () => {
    let app: FastifyInstance;
    beforeAll(async () => {
      const REPLY_SCHEMA = z.object({
        createdAt: z.date(),
      });

      app = Fastify();
      app.setValidatorCompiler(validatorCompiler);

      const serializerCompilerCustom = createSerializerCompiler({
        replacer(key: string, value: unknown): unknown {
          if (this[key] instanceof Date) {
            return { _date: this[key].toISOString() };
          }
          return value;
        },
      });

      app.setSerializerCompiler(serializerCompilerCustom);

      app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/',
        schema: {
          response: {
            200: REPLY_SCHEMA,
          },
        },
        handler: (_req, res) => {
          res.send({
            createdAt: new Date('2021-01-01T00:00:00Z'),
          });
        },
      });

      await app.ready();

      return async () => {
        await app.close();
      };
    });

    it('returns 200 for correct response', async () => {
      const response = await app.inject().get('/');

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        createdAt: { _date: '2021-01-01T00:00:00.000Z' },
      });
    });
  });

  describe('should return a FST_ERR_INVALID_SCHEMA error when a non-zod schema is provided', () => {
    let app: FastifyInstance;
    beforeEach(async () => {
      app = Fastify();
      app.setValidatorCompiler(validatorCompiler);
      app.setSerializerCompiler(serializerCompiler);

      app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: '/invalid',
        schema: {
          response: {
            200: { notZod: true },
          },
        },
        handler: (_, res) => {
          res.send({ test: 's' });
        },
      });

      await app.ready();

      return async () => {
        await app.close();
      };
    });

    it('works', async () => {
      const res = await app.inject().get('/invalid');

      expect(res.statusCode).toBe(500);
      expect(res.json()).toMatchInlineSnapshot(`
      {
        "code": "FST_ERR_INVALID_SCHEMA",
        "error": "Internal Server Error",
        "message": "Invalid schema passed: {"notZod":true}",
        "statusCode": 500,
      }
    `);
    });
  });
});
