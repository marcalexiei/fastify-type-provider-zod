import type { ZodTypeProvider } from '@marcalexiei/fastify-type-provider-zod';
import {
  serializerCompiler,
  validatorCompiler,
} from '@marcalexiei/fastify-type-provider-zod';
import Fastify from 'fastify';
import { z } from 'zod';

const app = Fastify({ logger: true });

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().route({
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
    res.send(req.query.name);
  },
});

const url = await app.listen({ port: 4949 });

app.log.info(`Documentation running at ${url}`);
