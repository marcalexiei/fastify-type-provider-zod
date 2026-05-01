---
'@marcalexiei/fastify-type-provider-zod': patch
---

fix(zodSchemaToJson): replace fragile JSON stringify/regex/parse ref substitution with a safe recursive object walk

The previous approach could silently corrupt output if a string value inside a schema happened to contain the internal placeholder marker. The new implementation only substitutes actual `$ref` string values.
