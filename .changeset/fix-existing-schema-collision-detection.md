---
"@marcalexiei/fastify-type-provider-zod": patch
---

fix(createJsonSchemaTransformObject): throw when a generated schema name conflicts with a pre-existing schema in `openapiObject.components.schemas`

Previously, generated schemas silently overwrote user-provided ones, producing a corrupt OpenAPI document.
