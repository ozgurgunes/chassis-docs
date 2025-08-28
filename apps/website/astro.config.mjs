import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@assets': path.resolve('../vendor/tokens/dist/assets/web/chassis-docs'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Suppress Sass deprecation warnings for @import
          quietDeps: true,
          verbose: false,
          logger: {
            warn: function(message) {
              // Suppress deprecation warnings about @import
              if (message.includes('deprecat') || message.includes('@import')) {
                return;
              }
              console.warn(message);
            }
          }
        },
      },
    },
  },
});
