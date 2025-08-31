import UnpluginIsolatedDecl from 'unplugin-isolated-decl/vite';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: { entry: 'src/index.ts' },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: ['fastify', /zod\/v4*?/, '@fastify/swagger', '@fastify/error'],
      output: [
        {
          preserveModules: true,
          entryFileNames: 'cjs/[name].cjs',
          format: 'cjs',
        },
        {
          preserveModules: true,
          entryFileNames: 'esm/[name].js',
          format: 'es',
        },
      ],
    },
  },
  plugins: [UnpluginIsolatedDecl() as Plugin],
});
