# `@marcalexiei/fastify-type-provider-zod`

[![CI][CIBadge]][CIURL]
[![Checked with Biome][CheckerBadge]][CheckerURL]
[![npm version][npmVersionBadge]][npmVersionURL]
[![issues][issuesBadge]][issuesURL]

[CIBadge]: https://img.shields.io/github/actions/workflow/status/marcalexiei/fastify-type-provider-zod/CI.yml?style=for-the-badge&logo=github&event=push&label=CI
[CIURL]: https://github.com/marcalexiei/fastify-type-provider-zod/actions/workflows/CI.yml
[CheckerBadge]: https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=for-the-badge&logo=biome
[CheckerURL]: https://biomejs.dev
[npmVersionBadge]: https://img.shields.io/npm/v/@marcalexiei/fastify-type-provider-zod.svg?style=for-the-badge&logo=npm
[npmVersionURL]: https://www.npmjs.com/package/@marcalexiei/fastify-type-provider-zod
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/fastify-type-provider-zod.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/fastify-type-provider-zod/issues

By combining Zod with Fastify’s type providers, this package bridges the gap between static typing and runtime schema enforcement.

It supports automatic generation of JSON Schema from Zod, facilitating integration with OpenAPI 3.x via Fastify plugins like [`@fastify/swagger`](https://github.com/fastify/fastify-swagger) and [`@fastify/swagger-ui`](https://github.com/fastify/fastify-swagger-ui).

## Getting started

<https://marcalexiei.github.io/fastify-type-provider-zod/getting-started.html>

## Examples

<https://marcalexiei.github.io/fastify-type-provider-zod/examples.html>

## Credits

This project is built upon [turkerdev/fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod)
and wouldn’t be possible without the work of turkerdev and the contributions of the entire community behind it.

##  Reason

TL;DR; My contribution on the `turkerdev/fastify-type-provider-zod` repository are getting missed.

~~If this changes, I'm more than willing to merge the changes here back to the upstream repo.~~

As of 2025-08-31, no communication have come from the original repo maintainer.
Also some merged PRs (e.g.: [205](https://github.com/turkerdev/fastify-type-provider-zod/pull/205)) make the fork implementation incompatible with this repo.

<details>

<summary>More details</summary>

My contribution are getting missed: <https://github.com/turkerdev/fastify-type-provider-zod/pull/174#issuecomment-3023602822>

Recent PRs not opened by me are reviewed before mine: <https://github.com/turkerdev/fastify-type-provider-zod/pull/176#issuecomment-3018610310>

This happened in the same way here:

- My PR: <https://github.com/turkerdev/fastify-type-provider-zod/pull/196>
- Another PR opened 3 days later: <https://github.com/turkerdev/fastify-type-provider-zod/pull/197>

Ignored PRs:

- <https://github.com/turkerdev/fastify-type-provider-zod/pull/185> (re add CI tests for windows)
- <https://github.com/turkerdev/fastify-type-provider-zod/pull/186>
- <https://github.com/turkerdev/fastify-type-provider-zod/pull/194>

Ignored issues:

- <https://github.com/turkerdev/fastify-type-provider-zod/pull/181> - maintenance improvements
- <https://github.com/turkerdev/fastify-type-provider-zod/pull/190> - changelog request for 5.0.2

</details>

## Differences from `turkerdev/fastify-type-provider-zod`

1. Automated changelog using Changeset
2. CI tests also Windows
3. Less `any` in the source code
4. `oas-validator` (last release 4 years ago) replaced by `@seriousme/openapi-schema-validator`
   (which supports 3.1)
5. Using `swagger` object for OpenAPI standard throws an error instead of a warning
6. Uses `vitest` typechecking rather than `tsd`
7. Type tests are run on `node`, `node16`, `bundler` module resolutions
8. `createJsonSchemaTransform` `skipList` option has been removed in favor of `route.schema.hide`

---

As of 2025-08-31 the implementation from the original fork have diverged so I'll stop updating this section.
