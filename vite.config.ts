import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, type PluginOption } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],

  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
