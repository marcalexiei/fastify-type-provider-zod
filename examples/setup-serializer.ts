import type { ZodSerializerCompilerOptions } from '@marcalexiei/fastify-type-provider-zod';
import {
  createSerializerCompiler,
  createValidatorCompiler,
} from '@marcalexiei/fastify-type-provider-zod';
import Fastify from 'fastify';

const app = Fastify({ logger: true });

const replacer: ZodSerializerCompilerOptions['replacer'] = function (
  key,
  value,
) {
  if (this[key] instanceof Date) {
    return { _date: value.toISOString() };
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
