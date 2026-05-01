---
'@marcalexiei/fastify-type-provider-zod': patch
---

fix(createJsonSchemaTransformObject): improve error message when an output schema id conflicts with an auto-generated input schema name

The message now names the conflicting id and explains the `Input` suffix convention, instead of the generic "Name already taken by another user defined schema".
