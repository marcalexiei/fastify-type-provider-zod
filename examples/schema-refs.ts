import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { ZodTypeProvider } from '@marcalexiei/fastify-type-provider-zod';
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
} from '@marcalexiei/fastify-type-provider-zod';
import Fastify from 'fastify';
import { z } from 'zod';

const USER_SCHEMA = z
  .object({
    id: z.number().int().positive(),
    name: z.string().describe('The name of the user'),
  })
  .meta({
    id: 'User', // <--- THIS MUST BE UNIQUE AMONG SCHEMAS
    description: 'User information',
  });

const app = Fastify({ logger: true });
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SampleApi',
      description: 'Sample backend service',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
  transformObject: jsonSchemaTransformObject,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
});

app.after(() => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    schema: {
      response: {
        200: USER_SCHEMA.array(),
      },
    },
    handler: (_req, res) => {
      res.send([]);
    },
  });
});

await app.ready();

const url = await app.listen({ port: 4949 });

app.log.info(`Documentation running at ${url}`);
