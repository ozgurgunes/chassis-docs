import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@assets': path.resolve('../vendor/tokens/dist/assets/web/chassis-docs'),
      },
    },
  },
});
