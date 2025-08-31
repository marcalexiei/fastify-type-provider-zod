import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import type { JSONSchema } from 'zod/v4/core';

export type OpenAPISchemaVersion = '3.0' | '3.1';

export const getOpenAPISchemaVersion = (documentObject: {
  openapiObject: Partial<OpenAPIV3.Document | OpenAPIV3_1.Document>;
}): OpenAPISchemaVersion => {
  const openapiVersion = documentObject.openapiObject.openapi;

  if (openapiVersion?.startsWith('3.1')) {
    return '3.1';
  }

  if (openapiVersion?.startsWith('3.0')) {
    return '3.0';
  }

  /* v8 ignore next 2 */
  throw new Error('Unsupported OpenAPI document object');
};

export const removeJSONSchemaPropertiesNotUsedByOpenAPI = (
  jsonSchema: JSONSchema.BaseSchema,
  options: { openAPISchemaVersion: OpenAPISchemaVersion },
): JSONSchema.BaseSchema => {
  // keeping this around just in case of additional customization based on open api version
  const { openAPISchemaVersion: _ } = options;

  const clone = { ...jsonSchema };

  delete clone.$schema;
  delete clone.$id;
  delete clone.id;

  return clone;
};

//=============================================================================
// #region Prune
//=============================================================================

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: can't simplify further
function collectRefs(
  schema: Record<string, unknown>,
  refs = new Set<string>(),
  seen = new WeakSet<Record<string, unknown>>(),
  skipDefs = true,
): Set<string> {
  if (!schema || typeof schema !== 'object') {
    return refs;
  }
  if (seen.has(schema)) {
    return refs;
  }
  seen.add(schema);

  if (schema.$ref && typeof schema.$ref === 'string') {
    refs.add(schema.$ref);
  }

  for (const key of Object.keys(schema)) {
    if (skipDefs && key === 'components') {
      // don't walk into definitions/components directly
      continue;
    }
    const value = schema[key];
    if (Array.isArray(value)) {
      for (const v of value) {
        collectRefs(v, refs, seen, skipDefs);
      }
      continue;
    }

    if (typeof value === 'object') {
      collectRefs(value as Record<string, unknown>, refs, seen, skipDefs);
    }
  }

  return refs;
}

const REF_MATCH_WITH_GROUP = /^#\/(components\/schemas)\/(.+)$/;
const REF_MATCH_START = /^#\/components\/schemas\//;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: can't simplify further
function resolveTransitiveRefs(
  schema: Record<string, unknown>,
  initialRefs: Set<string>,
) {
  const allRefs = new Set(initialRefs);
  let changed = true;

  // biome-ignore lint/nursery/noUnnecessaryConditions: changed is reassigned below
  while (changed) {
    changed = false;
    for (const ref of [...allRefs]) {
      const match = ref.match(REF_MATCH_WITH_GROUP);
      if (!match) {
        continue;
      }

      const [, , name] = match;
      // @ts-expect-error
      const container = schema.components?.schemas;

      const def = container?.[name];
      if (!def) {
        continue;
      }

      const newRefs = collectRefs(def, new Set(), new WeakSet(), false);
      // allow walking into defs once referenced
      for (const nr of newRefs) {
        if (!allRefs.has(nr)) {
          allRefs.add(nr);
          changed = true;
        }
      }
    }
  }

  return allRefs;
}

export function openAPISchemaPrune(
  schema: JSONSchema.JSONSchema,
): JSONSchema.JSONSchema {
  const directRefs = collectRefs(schema); // this skips definitions
  const usedRefs = resolveTransitiveRefs(schema, directRefs);

  const usedDefs = new Set(
    [...usedRefs].map((r) => r.replace(REF_MATCH_START, '')),
  );

  const newSchema: JSONSchema.JSONSchema = JSON.parse(JSON.stringify(schema));

  type SchemaLike = Record<string, Record<string, unknown>>;
  const componentsSchemas = (newSchema.components as SchemaLike)?.schemas;

  if (componentsSchemas) {
    for (const key of Object.keys(componentsSchemas)) {
      if (!usedDefs.has(key)) {
        delete componentsSchemas[key as keyof typeof componentsSchemas];
      }
    }
  }

  return newSchema;
}

// const schema = {
//   type: 'object',
//   properties: {
//     node: {}
//     // node: { $ref: '#/components/schemas/Node' },
//   },
//   components: {
//     schemas: {
//       Node: {
//         type: 'object',
//         properties: {
//           value: { type: 'string' },
//           children: {
//             type: 'array',
//             items: { $ref: '#/components/schemas/Node' }, // self-ref only
//           },
//         },
//       },
//       Unused: { type: 'number' },
//     },
//   },
// };

// console.log(openAPISchemaPrune(schema));

//=============================================================================
// #endregion Prune
//=============================================================================
