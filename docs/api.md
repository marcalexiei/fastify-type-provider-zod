# API

## `createValidatorCompiler`

Creates a compiler function that validates Fastify request data using Zod schemas.

Pass the returned function to Fastify’s [`setValidatorCompiler`](https://fastify.dev/docs/latest/Reference/Server/#setvalidatorcompiler).

## `createSerializerCompiler`

Creates a function that can be used as a response serializer compiler, validating responses using Zod.

Pass the returned function to Fastify’s [`setSerializerCompiler`](https://fastify.dev/docs/latest/Reference/Server/#serializercompiler).

Supported options:

<<< ../src/core.ts#ZodSerializerCompilerOptions

## `createJsonSchemaTransform`

Creates a method to transform Zod schemas into JSON Schema.

Supported options:

<<< ../src/core.ts#CreateJsonSchemaTransformOptions

## `createJsonSchemaTransformObject`

Same as `createJsonSchemaTransform`, but returns an object containing both the transform and a reference resolver.

Supported options:

<<< ../src/core.ts#CreateJsonSchemaTransformObjectOptions

## `hasZodFastifySchemaValidationErrors`

Utility to detect whether an error comes from Zod schema validation.

See: [Customizing error responses](/examples.html#customizing-error-responses)

## `isResponseSerializationError`

Utility to detect whether an error was thrown by Zod during response serialization.

See: [Customizing error responses](/examples.html#customizing-error-responses)
