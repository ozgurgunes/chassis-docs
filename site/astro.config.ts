import { defineConfig } from 'astro/config'
import { chassis } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { algoliaPlugin } from './src/plugins/algolia-plugin'
import { stackblitzPlugin } from './src/plugins/stackblitz-plugin'

const isDev = process.env.NODE_ENV === 'development'

const site = isDev
  ? // In development mode, use the local dev server.
    'http://localhost:4323'
  : process.env.DEPLOY_PRIME_URL !== undefined
    ? // If deploying on Netlify, use the `DEPLOY_PRIME_URL` environment variable.
      process.env.DEPLOY_PRIME_URL
    : // Otherwise, use the `baseURL` value defined in the `config.yml` file.
      getConfig().baseURL

// https://astro.build/config
export default defineConfig({
  outDir: './dist',
  build: {
    assets: `assets`
  },
  integrations: [chassis()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism'
  },
  site,
  vite: {
    plugins: [algoliaPlugin(), stackblitzPlugin()],
    ssr: {
      noExternal: ['@astrojs/prism']
    // },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       // chunkFileNames: 'assets/js/[name].[hash].js',
    //       assetFileNames: (assetInfo) => {
    //         if (assetInfo.name?.endsWith('.css')) {
    //           return 'assets/css/docs.[hash].css'
    //         }
    //         return 'assets/[name].[hash][extname]'
    //       }
    //     }
    //   }
    }
  }
})
