# Admin Panel for Portfolio Projects

This admin panel lets you manage your `projects.json` used by the portfolio site.

## Features
- Load existing `projects.json`
- Add, edit, delete, hide projects
- Drag-and-drop project ordering
- Edit case study meta (client, role, duration, brief)
- Edit sections and media items (image/video URL, auto-embed handling)
- Autosave local drafts (no server required)
- Export updated JSON
- Optional POST to an API to save server-side

## Files
- `admin.html` — main admin panel UI
- `admin.js` — logic for loading, editing, and saving projects
- `admin.css` — minor custom styles (using Tailwind CDN for base styles)

## Setup (Static)
1. Copy `admin.html`, `admin.js`, `admin.css` to your site (same folder as `index.html` is fine).
2. Ensure your live `projects.json` is accessible at `/projects.json`. If it’s at another path, update `PROJECTS_JSON_PATH` in `admin.js`.
3. Open `admin.html` in your browser.
4. Load data, edit, and click “Export JSON” to download the updated file. Replace the server copy.

## Optional: API Mode
If you have a backend (Node/Express, etc.), expose an endpoint like:
POST `/admin/save-projects`
Body: JSON array of projects (same format as `projects.json`)
Auth: protect this via basic auth, token, or IP allowlist.

Then set `API_SAVE_ENDPOINT` in `admin.js`. Click “Save to Server”.

## Notes
- Your `index.html` looks for `ALL_PROJECTS` via `/projects_data.json` or `/src/data/projects.json`. The admin panel manages `/projects.json` by default. You can:
  - Either serve `projects.json` at `/projects_data.json`, or
  - Update `ensureAllProjectsLoaded()` candidates in `index.html` to include `/projects.json`.
- Video embed handling in your site supports YouTube/Vimeo and MP4. The admin panel allows marking `isVideo: true` and will align with your site’s `generateMediaHTML()`.

## Security
- If served publicly, the admin page should be protected. Options:
  - HTTP Basic auth via server
  - Behind a VPN/admin-only route
  - Static mode used locally only (open file on your machine), then upload JSON via SFTP or your CMS.

## Backups
- Use the “Export Backup” button to save snapshots with timestamps.
- Local drafts (autosave) are stored in `localStorage` under the key `admin_projects_draft`.

## Compatibility
- Tailwind CSS CDN is used (same as in your site)
- Tested on recent Chrome/Edge browsers
- No dependencies besides Tailwind CDN
