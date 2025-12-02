import type {
  SwaggerTransform,
  SwaggerTransformObject,
} from '@fastify/swagger';
import type {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifySchemaCompiler,
  FastifyTypeProvider,
  RawServerBase,
  RawServerDefault,
} from 'fastify';
import type { FastifySerializerCompiler } from 'fastify/types/schema.js';
import type { $ZodRegistry, input, JSONSchema, output } from 'zod/v4/core';
import { $ZodType, globalRegistry, safeParse } from 'zod/v4/core';

import {
  createValidationError,
  InvalidSchemaError,
  ResponseSerializationError,
} from './errors.ts';
import { getOpenAPISchemaVersion, openAPISchemaPrune } from './openapi.ts';
import { zodRegistryToJson, zodSchemaToJson } from './zod-to-json.ts';

//=============================================================================
// #region Types
//=============================================================================

/**
 * FastifyPluginCallbackZod with Zod automatic type inference
 *
 * @example
 * ```typescript
 * import Fastify from 'fastify';
 * import { ZodTypeProvider } from "@marcalexiei/fastify-type-provider-zod";
 *
 * const app = Fastify()
 * app.withTypeProvider<ZodTypeProvider>()
 * ```
 */
export interface ZodTypeProvider extends FastifyTypeProvider {
  validator: this['schema'] extends $ZodType ? output<this['schema']> : unknown;
  serializer: this['schema'] extends $ZodType ? input<this['schema']> : unknown;
}

/**
 * FastifyPluginCallbackZod with Zod automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginCallbackZod } from "@marcalexiei/fastify-type-provider-zod"
 *
 * const plugin: FastifyPluginCallbackZod = (fastify, options, done) => {
 *   done()
 * }
 * ```
 */
export type FastifyPluginCallbackZod<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
> = FastifyPluginCallback<Options, Server, ZodTypeProvider>;

/**
 * FastifyPluginAsyncZod with Zod automatic type inference
 *
 * @example
 * ```typescript
 * import { FastifyPluginAsyncZod } from "@marcalexiei/fastify-type-provider-zod"
 *
 * const plugin: FastifyPluginAsyncZod = async (fastify, options) => {
 * }
 * ```
 */
export type FastifyPluginAsyncZod<
  Options extends FastifyPluginOptions = Record<never, never>,
  Server extends RawServerBase = RawServerDefault,
> = FastifyPluginAsync<Options, Server, ZodTypeProvider>;

//=============================================================================
// #endregion Types
//=============================================================================

function resolveSchema(
  maybeSchema: $ZodType | { properties: $ZodType },
): $ZodType {
  if (maybeSchema instanceof $ZodType) {
    return maybeSchema;
  }

  // I'm not sure about the need of this code.
  // Unit tests are not failing without it so keep it here for reference
  // if (
  //   'properties' in maybeSchema &&
  //   maybeSchema.properties instanceof $ZodType
  // ) {
  //   return maybeSchema.properties;
  // }

  throw new InvalidSchemaError(JSON.stringify(maybeSchema));
}

//=============================================================================
// #region Transform
//=============================================================================

interface CreateJsonSchemaTransformOptions {
  schemaRegistry?: $ZodRegistry<{ id?: string | undefined }>;
}

export const createJsonSchemaTransform = ({
  schemaRegistry = globalRegistry,
}: CreateJsonSchemaTransformOptions): SwaggerTransform => {
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: no other way
  return (transformData) => {
    if ('swaggerObject' in transformData) {
      throw new Error(
        'createJsonSchemaTransform - OpenAPI 2.0 is not supported',
      );
    }

    const { schema, url } = transformData;

    if (!schema) {
      return { schema, url };
    }

    const {
      hide,
      //
      params,
      headers,
      querystring,
      body,
      response,
      ...rest
    } = schema;

    if (hide) {
      return { schema: { hide }, url };
    }

    const transformed: Partial<{
      headers: JSONSchema.BaseSchema;
      querystring: JSONSchema.BaseSchema;
      body: JSONSchema.BaseSchema;
      params: JSONSchema.BaseSchema;
      response: Partial<Record<string, JSONSchema.BaseSchema>>;
      [key: string]: unknown;
    }> = { ...rest };

    type ZodSchemaRecord = Record<string, $ZodType>;

    const requestSchemas = {
      headers,
      querystring,
      body,
      params,
    } as ZodSchemaRecord;

    const openAPISchemaVersion = getOpenAPISchemaVersion(transformData);

    for (const [prop, maybeSchema] of Object.entries(requestSchemas)) {
      if (maybeSchema) {
        transformed[prop] = zodSchemaToJson(
          resolveSchema(maybeSchema),
          schemaRegistry,
          'input',
          openAPISchemaVersion,
        );
      }
    }

    if (response) {
      transformed.response = {};

      for (const [prop, maybeSchema] of Object.entries(response)) {
        transformed.response[prop] = zodSchemaToJson(
          resolveSchema(maybeSchema),
          schemaRegistry,
          'output',
          openAPISchemaVersion,
        );
      }
    }

    return { schema: transformed, url };
  };
};

export const jsonSchemaTransform: SwaggerTransform = createJsonSchemaTransform(
  {},
);

interface CreateJsonSchemaTransformObjectOptions {
  schemaRegistry?: $ZodRegistry<{ id?: string | undefined }>;
}

export const createJsonSchemaTransformObject = (
  options: CreateJsonSchemaTransformObjectOptions,
): SwaggerTransformObject => {
  const { schemaRegistry = globalRegistry } = options;

  return (documentObject) => {
    /* v8 ignore next 5 -- @preserve */
    if ('swaggerObject' in documentObject) {
      throw new Error(
        'createJsonSchemaTransformObject - OpenAPI 2.0 is not supported',
      );
    }

    const openAPISchemaVersion = getOpenAPISchemaVersion(documentObject);

    const inputSchemas = zodRegistryToJson(
      schemaRegistry,
      'input',
      openAPISchemaVersion,
    );
    const outputSchemas = zodRegistryToJson(
      schemaRegistry,
      'output',
      openAPISchemaVersion,
    );

    for (const key of Object.keys(outputSchemas)) {
      if (inputSchemas[key]) {
        throw new Error(
          `Cannot create schema "${key}": Name already taken by another user defined schema.`,
        );
      }
    }

    const assembledDocument = {
      ...documentObject.openapiObject,
      components: {
        ...documentObject.openapiObject.components,
        schemas: {
          ...documentObject.openapiObject.components?.schemas,
          ...inputSchemas,
          ...outputSchemas,
        },
      },
    };

    const cleanedDocument = openAPISchemaPrune(
      assembledDocument,
    ) as ReturnType<SwaggerTransformObject>;

    return cleanedDocument;
  };
};

export const jsonSchemaTransformObject: SwaggerTransformObject =
  createJsonSchemaTransformObject({});

//=============================================================================
// #endregion Transform
//=============================================================================

//=============================================================================
// #region Compiler
//=============================================================================

export const validatorCompiler: FastifySchemaCompiler<$ZodType> = ({
  schema: maybeSchema,
}) => {
  //
  return (data) => {
    const schema = resolveSchema(maybeSchema);

    const result = safeParse(schema, data);
    if (result.error) {
      return { error: createValidationError(result.error) as unknown as Error };
    }

    return { value: result.data };
  };
};

// biome-ignore-start lint/suspicious/noExplicitAny: Same as json stringify
// #region ZodSerializerCompilerOptions
export interface ZodSerializerCompilerOptions {
  replacer?: (this: any, key: string, value: any) => any;
}
// #endregion ZodSerializerCompilerOptions
// biome-ignore-end lint/suspicious/noExplicitAny: Same as json stringify

type ZodFastifySerializerCompiler = FastifySerializerCompiler<
  $ZodType | { properties: $ZodType }
>;

export const createSerializerCompiler: (
  options?: ZodSerializerCompilerOptions,
) => ZodFastifySerializerCompiler = (options) => {
  //
  return ({ schema: maybeSchema, method, url }) => {
    //
    return (data) => {
      const schema = resolveSchema(maybeSchema);

      const result = safeParse(schema, data);
      if (result.error) {
        throw new ResponseSerializationError(method, url, {
          cause: result.error,
        });
      }

      return JSON.stringify(result.data, options?.replacer);
    };
  };
};

export const serializerCompiler: ZodFastifySerializerCompiler =
  createSerializerCompiler();

//=============================================================================
// #endregion Compiler
//=============================================================================
