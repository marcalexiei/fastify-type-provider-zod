import { oxfmtConfig } from '@marcalexiei/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...oxfmtConfig,
  ignorePatterns: ['CHANGELOG.md'],
}) as ReturnType<typeof defineConfig>;
