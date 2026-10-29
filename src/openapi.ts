/* oxlint-disable no-continue -- hate nested cycles with lot of conditions */
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

  /* v8 ignore next -- @preserve */
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

function collectRefs(schema: unknown, skipDefs = true): Set<string> {
  const refs = new Set<string>();
  const seen = new WeakSet();

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') {
      return;
    }
    if (seen.has(node)) {
      /* v8 ignore next -- @preserve */
      return;
    }
    seen.add(node);

    if (Array.isArray(node)) {
      for (const item of node) {
        walk(item);
      }
      return;
    }

    const record = node as Record<string, unknown>;

    if (record.$ref && typeof record.$ref === 'string') {
      refs.add(record.$ref);
    }

    for (const [key, value] of Object.entries(record)) {
      if (skipDefs && key === 'components') {
        // don't walk into definitions/components directly
        continue;
      }
      walk(value);
    }
  };

  walk(schema);

  return refs;
}

type ComponentsLike = { schemas?: Record<string, unknown> } | undefined;

const REF_MATCH_WITH_GROUP = /^#\/components\/schemas\/(?<name>.+)$/;
const REF_MATCH_START = /^#\/components\/schemas\//;

function resolveTransitiveRefs(
  schema: Record<string, unknown>,
  initialRefs: Set<string>,
): Set<string> {
  const allRefs = new Set(initialRefs);
  const container = (schema.components as ComponentsLike)?.schemas;
  let changed = true;

  while (changed) {
    changed = false;
    for (const ref of allRefs) {
      const name = REF_MATCH_WITH_GROUP.exec(ref)?.groups?.name;
      /* v8 ignore next -- @preserve */
      if (!name) {
        continue;
      }

      const def = container?.[name];
      if (!def) {
        /* v8 ignore next -- @preserve */
        continue;
      }

      const newRefs = collectRefs(def, false);
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

export function openAPISchemaPrune(schema: JSONSchema.JSONSchema): JSONSchema.JSONSchema {
  const directRefs = collectRefs(schema); // this skips definitions
  const usedRefs = resolveTransitiveRefs(schema, directRefs);

  const usedDefs = new Set([...usedRefs].map((ref) => ref.replace(REF_MATCH_START, '')));

  // oxlint-disable-next-line unicorn/prefer-structured-clone -- the copy must hold only what JSON keeps
  const newSchema = JSON.parse(JSON.stringify(schema)) as JSONSchema.JSONSchema;

  const components = newSchema.components as ComponentsLike;

  if (components?.schemas) {
    components.schemas = Object.fromEntries(
      Object.entries(components.schemas).filter(([key]) => usedDefs.has(key)),
    );
  }

  return newSchema;
}

//=============================================================================
// #endregion Prune
//=============================================================================
