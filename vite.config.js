// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { saveProjects } from './save-plugin.js';

export default defineConfig({
  plugins: [
    svelte({
      // Keep the compatibility option only once and avoid registering the plugin twice
      compilerOptions: {
        compatibility: {
          componentApi: 4
        }
      }
    }),
    tailwindcss(),
    saveProjects()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});