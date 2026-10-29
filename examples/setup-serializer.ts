import type { ZodSerializerCompilerOptions } from '@marcalexiei/fastify-type-provider-zod';
import {
  createSerializerCompiler,
  createValidatorCompiler,
} from '@marcalexiei/fastify-type-provider-zod';
import Fastify from 'fastify';

const app = Fastify({ logger: true });

const replacer: ZodSerializerCompilerOptions['replacer'] = function replacer(
  this: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  const original = this[key];
  if (original instanceof Date) {
    return { _date: original.toISOString() };
  }
  return value;
};

// Create a custom serializer compiler
const customSerializerCompiler = createSerializerCompiler({ replacer });

// Add schema validator and serializer
app.setValidatorCompiler(createValidatorCompiler());
app.setSerializerCompiler(customSerializerCompiler);

// ...

const url = await app.listen({ port: 4949 });

app.log.info(`Documentation running at ${url}`);
