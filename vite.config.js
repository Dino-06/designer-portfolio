// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { saveProjects } from './save-plugin.js';

export default defineConfig({
  plugins: [
    svelte({
        // CRITICAL FIX: Add compatibility option to support the 'new App()' syntax
        compilerOptions: {
            compatibility: {
                componentApi: 4 
            }
        }
    }),
    tailwindcss(),
    svelte(),
    saveProjects() // Register our custom saving plugin
    
  ],
  // This setting tells the dev server to serve the admin portal at /admin
  server: {
    host: '0.0.0.0',
    port: 5173 
  }
});