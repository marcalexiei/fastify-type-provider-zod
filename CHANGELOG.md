# @marcalexiei/fastify-type-provider-zod

## 3.0.0

### Major Changes

- [#73](https://github.com/marcalexiei/fastify-type-provider-zod/pull/73) [`cb77e48`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/cb77e488b219ecba673093a82611da7fa5ff1012) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: requires fastify ^5.5.0

- [#78](https://github.com/marcalexiei/fastify-type-provider-zod/pull/78) [`aea3dd5`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/aea3dd571421ac9aeee87ee98ccf4626545e0397) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: remove default compilers and schema transforms in favour of create methods

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

### Minor Changes

- [#79](https://github.com/marcalexiei/fastify-type-provider-zod/pull/79) [`faaf873`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/faaf87310b146ec7da72c031e80b6d2b844096fb) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: add API page

- [#75](https://github.com/marcalexiei/fastify-type-provider-zod/pull/75) [`a225c43`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/a225c43c8ad66c314131c1b03013bba42709ee41) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(createJsonSchemaTransformObject): add `setIdAsTitleInSchemas`

- [#80](https://github.com/marcalexiei/fastify-type-provider-zod/pull/80) [`760385e`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/760385ecab8cc3717625281029b5b052e9bcbf91) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(package): set `sideEffect` to `false`

## 2.0.2

### Patch Changes

- [#72](https://github.com/marcalexiei/fastify-type-provider-zod/pull/72) [`e887d2a`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/e887d2ad082c19499ab150291df4c138315e2704) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: add err.validationContext to schema validation error message strings

- [#69](https://github.com/marcalexiei/fastify-type-provider-zod/pull/69) [`4cafc79`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/4cafc793ae225d53fefb3b38ab50fb669727c0e0) Thanks [@marcalexiei](https://github.com/marcalexiei)! - refactor: use for-of instead of for-in

## 2.0.1

### Patch Changes

- [`6d95ca1`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/6d95ca19f3558158e22c587066c50d33d718ec51) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: switch to release helper (userland is not affected)

- [#58](https://github.com/marcalexiei/fastify-type-provider-zod/pull/58) [`5165282`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/5165282fdcae115683763e95a6378630616c7bbb) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: enable trusted publishing (userland is not affected)

- [#57](https://github.com/marcalexiei/fastify-type-provider-zod/pull/57) [`135aa7c`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/135aa7cb7b32db7728cfdb1c64a02c08dce85984) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(examples): uniform examples code style and enable logger

## 2.0.0

### Major Changes

- [#47](https://github.com/marcalexiei/fastify-type-provider-zod/pull/47) [`f52fbb7`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/f52fbb7411730856245afb96cde98f78d8dad1ef) Thanks [@marcalexiei](https://github.com/marcalexiei)! - Remove `skipList` from `createJsonSchemaTransform` options

  You can rely on `route.schema.hide` property to have the same behavior.

  More info can be found on the issue: <https://github.com/marcalexiei/fastify-type-provider-zod/issues/46>

- [#40](https://github.com/marcalexiei/fastify-type-provider-zod/pull/40) [`70e1e03`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/70e1e03308bd42eadef6564bc95c3f41ba8b96ea) Thanks [@marcalexiei](https://github.com/marcalexiei)! - Use Zod’s built-in `toJSONSchema` with the `openapi-3.0` target instead of relying on a custom conversion from `draft-2020-12` to OpenAPI 3.0.

  > [!WARNING] > **Breaking Change**
  >
  > - Dropped support for `zod@3`
  > - Requires **`zod@4.1.4` or later**
  >
  > Why not `^4.1.0`? Versions before `4.1.4` contain bugs that affect `openapi-3.0` schema output.
  >
  > See [issue #37](https://github.com/marcalexiei/fastify-type-provider-zod/issues/37) for more details.

## 1.2.3

### Patch Changes

- [#42](https://github.com/marcalexiei/fastify-type-provider-zod/pull/42) [`a70297d`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/a70297d3ae426155399fad02db242b350d82673c) Thanks [@marcalexiei](https://github.com/marcalexiei)! - refactor(openapi): improve prune algorithm

## 1.2.2

### Patch Changes

- [#39](https://github.com/marcalexiei/fastify-type-provider-zod/pull/39) [`11681ac`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/11681acd7e99412d1ae6550ba2a08e28ae59c94b) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(openapi): prune only unused schemas from `components.schemas`

- [`77a9ff2`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/77a9ff2998ff3a2b319708f11c953a7424c2b109) Thanks [@marcalexiei](https://github.com/marcalexiei)! - refactor(errors): use destructuring instead of `omit` helper

## 1.2.1

### Patch Changes

- [`d306d4c`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/d306d4c4f1666bd9ab5d30f0445d75e6550609d6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(openapi): handle metadata consistently across global and custom schema registries

- [`8676dcc`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/8676dcc24dcc807787d606959fb85d0ab779885a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(examples): refine examples with schema refs

## 1.2.0

### Minor Changes

- [`af64b3b`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/af64b3b32a1f5d105af4e6f0be9f51073fbdf82e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(openapi): support `description` and `examples` from schema `meta`

## 1.1.0

### Minor Changes

- [`539a190`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/539a190a629e32813fe26a4e80c706ea50dab2c9) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: use vitepress alpha

- [`4e81268`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/4e81268e781a4b7fa499f730ac88a4d3ce825b35) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(core): use `interface` instead of `type` when possible

### Patch Changes

- [`7bca7bc`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/7bca7bc0f3defecdba2bea1cffdc66c012ea1286) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(README): update badge style

## 1.0.6

### Patch Changes

- [`2b836ab`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/2b836ab6e48220c27c24c40182806a65aba547a3) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(package): update homepage field

- [`d9c5eb0`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/d9c5eb0c3b309969a4259f1cdac3aa051af8a290) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(setup): correct install scripts

## 1.0.5

### Patch Changes

- [`28a10bc`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/28a10bc2d9098b0fb34d0966d56eca07ed784514) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: fix docs deploy after release

## 1.0.4

### Patch Changes

- [`71cc85c`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/71cc85c6ac75da5919e83d7864a06740954f5227) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: add favicon

- [`a7eab5d`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/a7eab5dec609753b76ed14a20e40fa3c9e56558b) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: add search, edit links and lastUpdated timestamp

## 1.0.3

### Patch Changes

- [`12c81aa`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/12c81aa176d5c17b7c3a8f44d01562bf1b633d88) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: documentation should be deployed only when package is released, not always

  No code changes affecting user land have been made

## 1.0.2

### Patch Changes

- [#12](https://github.com/marcalexiei/fastify-type-provider-zod/pull/12) [`2ca0c88`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/2ca0c88b5fa89e77bf7a2f6ab373e7d30ce39506) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: add documentation site and deploy after package release

  No code changes affecting user land have been made

## 1.0.1

### Patch Changes

- [#10](https://github.com/marcalexiei/fastify-type-provider-zod/pull/10) [`9f01742`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/9f017426e8814ae05fcb293b16eb4acdf5e9ca31) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(types): add file extensions to avoid node16 resolution errors

## 1.0.0

### Major Changes

- [`5d09f19`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/5d09f19e161b8d51668c77e513609ba0681c9b57) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: initial release

### Minor Changes

- [`89e5b5f`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/89e5b5fcae72311667accb765bd795ebfcb38fd8) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: improve support for openAPI 3.0

### Patch Changes

- [`a12a379`](https://github.com/marcalexiei/fastify-type-provider-zod/commit/a12a379c5fa706d2cfc63ad712c93e82b36d3474) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: throw FST_ERR_INVALID_SCHEMA error when a non-zod object is provided as schema
