import { baseConfig } from '@marcalexiei/oxlint-config/base';
import { typescriptConfig } from '@marcalexiei/oxlint-config/typescript';
import { vitestConfig } from '@marcalexiei/oxlint-config/vitest';
import { defineConfig } from 'oxlint';

export default defineConfig({
  env: {
    node: true,
  },
  extends: [baseConfig, typescriptConfig],
  options: {
    reportUnusedDisableDirectives: 'error',
    typeAware: true,
  },
  rules: {
    // A module exports next to what it defines, so its shape reads top to bottom.
    'import/exports-last': 'off',
  },
  overrides: [
    {
      // The library supports both `zod` and `zod/mini`, so it only imports their shared core.
      // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously
      files: ['src/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['zod', 'zod/*', '!zod/v4/core'],
                message:
                  'This plugin supports both `zod` and `zod-mini`, so please import only from `zod/v4/core`',
              },
            ],
          },
        ],
      },
    },
    {
      // Tests exercise the public entry point, not the modules behind it.
      files: ['test/**', 'test-types/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['../src/*', '!../src/index.ts'],
                message: 'import only from `../src/index`',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.spec.ts', '**/*.spec-d.ts'],
      ...vitestConfig,
    },
    {
      // Type tests declare plugins that are never called, only checked against their types.
      files: ['test-types/**'],
      rules: {
        'typescript/require-await': 'off',
        'unicorn/consistent-function-scoping': 'off',
      },
    },
  ],
}) as ReturnType<typeof defineConfig>;
