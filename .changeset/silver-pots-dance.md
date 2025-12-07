---
"@marcalexiei/fastify-type-provider-zod": major
---

feat!: remove default compilers and schema transforms in favour of create methods

`validatorCompiler` and `serializerCompiler` are no longer exported.
You can get them by calling directly `createValidatorCompiler` and `createSerializerCompiler`.

```diff
 import {
-  serializerCompiler,
-  validatorCompiler,
+  createSerializerCompiler,
+  createValidatorCompiler,
 } from '@marcalexiei/fastify-type-provider-zod';

- app.setValidatorCompiler(validatorCompiler);
- app.setSerializerCompiler(serializerCompiler);
+ app.setValidatorCompiler(createValidatorCompiler());
+ app.setSerializerCompiler(createSerializerCompiler());
```

The same changes affects `jsonSchemaTransform` and `jsonSchemaTransformObject`

```diff
 import {
-  jsonSchemaTransform,
-  jsonSchemaTransformObject,
+  createJsonSchemaTransform,
+  createJsonSchemaTransformObject,
 } from '../src/index.ts';

// ...

 await app.register(fastifySwagger, {
   openapi: createOpenAPIDoc(),
-  transform: jsonSchemaTransform,
-  transformObject: jsonSchemaTransformObject,
+  transform: createJsonSchemaTransform(),
+  transformObject: createJsonSchemaTransformObject(),
 });
```

If you were relying on `createJsonSchemaTransform` and `createJsonSchemaTransformObject` already,
you don't have to change anything.
