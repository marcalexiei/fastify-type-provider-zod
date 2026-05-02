import { oxfmtConfig } from '@marcalexiei/oxfmt-config';
import { defineConfig } from 'oxfmt';

// biome-ignore lint/style/noDefaultExport: config
export default defineConfig({
  ...oxfmtConfig,
  ignorePatterns: ['CHANGELOG.md'],
}) as ReturnType<typeof defineConfig>;
