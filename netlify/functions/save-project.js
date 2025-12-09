// Netlify Function: Save projects.json to GitHub repo via Contents API
// Env vars required: GITHUB_TOKEN, REPO_OWNER, REPO_NAME, BRANCH (default 'main'), ADMIN_KEY (optional but recommended)
const GITHUB_API = 'https://api.github.com';

export async function handler(event) {
  // CORS
  const origin = event.headers.origin || '';
  const allowedOrigin = process.env.ALLOWED_ORIGIN || ''; // e.g., https://dinoagrela.netlify.app
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin || origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  // Optional: simple auth (note: putting a secret in the client is not truly secure)
  const adminKey = process.env.ADMIN_KEY;
  if (adminKey) {
    const provided = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
    if (!provided || provided !== adminKey) {
      return { statusCode: 401, headers: corsHeaders, body: 'Unauthorized' };
    }
  }

  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const branch = process.env.BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    return { statusCode: 500, headers: corsHeaders, body: 'Missing repo config' };
  }

  let json;
  try {
    json = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON body' };
  }

  // Minimal validation to prevent bad writes
  if (!Array.isArray(json)) {
    return { statusCode: 400, headers: corsHeaders, body: 'Root must be an array' };
  }

  try {
    // 1) Get current file to obtain sha (required for update)
    const contentsPath = 'projects.json';
    const getUrl = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(contentsPath)}?ref=${encodeURIComponent(branch)}`;
    let sha = undefined;
    const getResp = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'netlify-fn' },
    });
    if (getResp.status === 200) {
      const getData = await getResp.json();
      sha = getData.sha;
    } else if (getResp.status !== 404) {
      const text = await getResp.text();
      return { statusCode: 502, headers: corsHeaders, body: `GitHub read failed: ${text}` };
    }

    // 2) PUT new content
    const contentB64 = Buffer.from(JSON.stringify(json, null, 2), 'utf8').toString('base64');
    const putUrl = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(contentsPath)}`;
    const putResp = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'netlify-fn',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'chore(admin): update projects.json via Netlify function',
        content: contentB64,
        sha, // omit if file does not exist
        branch,
      }),
    });

    if (!putResp.ok) {
      const text = await putResp.text();
      return { statusCode: 502, headers: corsHeaders, body: `GitHub write failed: ${text}` };
    }

    const result = await putResp.json();
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, commit: result.commit?.sha || null }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: `Server error: ${String(err)}` };
  }
}