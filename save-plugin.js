// save-plugin.js
// Vite plugin that exposes a /save-projects POST endpoint on the dev server.
// The endpoint writes the posted JSON directly to ./src/data/projects.json (creating the folder if necessary).
//
// NOTE: This is intentionally a dev-only convenience. Do NOT expose this in production.

import fs from 'fs/promises';
import path from 'path';

export function saveProjects() {
  return {
    name: 'save-projects-plugin',
    configureServer(server) {
      // Use the Connect-style middleware available as server.middlewares
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || !req.url.startsWith('/save-projects')) {
          return next();
        }

        // Collect request body
        try {
          let body = '';
          await new Promise((resolve, reject) => {
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', resolve);
            req.on('error', reject);
          });

          // Basic validation: ensure valid JSON
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (err) {
            res.statusCode = 400;
            res.end(`Invalid JSON payload: ${err.message}`);
            return;
          }

          // Ensure data directory exists and write file
          const outDir = path.resolve(process.cwd(), 'src', 'data');
          const outFile = path.join(outDir, 'projects.json');

          try {
            await fs.mkdir(outDir, { recursive: true });
            // Write pretty JSON (4-space)
            await fs.writeFile(outFile, JSON.stringify(parsed, null, 4), 'utf8');
            server.config.logger.info(`[save-projects-plugin] Saved ${outFile}`);
            res.statusCode = 200;
            res.end('ok');
            return;
          } catch (writeErr) {
            server.config.logger.error(`[save-projects-plugin] Failed to write file: ${writeErr.message}`);
            res.statusCode = 500;
            res.end(`Failed to write file: ${writeErr.message}`);
            return;
          }
        } catch (err) {
          server.config.logger.error(`[save-projects-plugin] Request handling failed: ${err.message}`);
          res.statusCode = 500;
          res.end(`Request handling failed: ${err.message}`);
          return;
        }
      });
    }
  };
}