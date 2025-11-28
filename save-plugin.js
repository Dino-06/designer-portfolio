// save-plugin.js
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'src/data/projects.json');

export function saveProjects() {
  return {
    name: 'save-projects-plugin',
    configureServer(server) {
      server.middlewares.use('/save-projects', async (req, res) => {
        if (req.method === 'POST') {
          try {
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }

            // Write the raw JSON string to the data file
            fs.writeFileSync(DATA_FILE, body);

            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Projects saved successfully.' }));
          } catch (error) {
            console.error('File write error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Failed to save projects to disk.' }));
          }
        } else {
          res.statusCode = 405; // Method Not Allowed
          res.end();
        }
      });
    }
  };
}