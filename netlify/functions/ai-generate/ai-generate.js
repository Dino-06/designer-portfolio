// Netlify Function: /.netlify/functions/ai-generate
export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { target, tone, length, project, section } = body;

    const system = buildSystemPrompt();
    const user = buildUserPrompt({ target, tone, length, project, section });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream AI error', detail: errText }) };
    }

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (err) {
    console.error('[AI generate] error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Generation failed' }) };
  }
}

function buildSystemPrompt() {
  return `You are a UX copywriter. Write clear, concise, user-centered copy for design case studies.
- Prefer plain language.
- Avoid buzzwords.
- Include context and outcomes when available.
- Keep length within requested limits.
- Preserve any provided facts; do not invent metrics.`;
}

function buildUserPrompt({ target, tone, length, project, section }) {
  const toneStr = tone || 'professional';
  const lenStr = length || 'short';
  const base = [
    `Target: ${target}`,
    `Tone: ${toneStr}`,
    `Length: ${lenStr}`,
    `Project: ${project?.title || ''} (${project?.category || ''} • ${project?.year || ''})`,
    project?.client ? `Client: ${project.client}` : '',
    project?.role ? `Role: ${project.role}` : '',
    project?.duration ? `Duration: ${project.duration}` : '',
    project?.brief ? `Existing brief: ${project.brief}` : '',
    section?.title ? `Section: ${section.title}` : '',
    section?.content ? `Existing section content: ${section.content}` : '',
    section?.mediaItems?.length ? `Media: ${section.mediaItems.map(m => (m.isVideo ? 'video' : 'image')).join(', ')}` : ''
  ].filter(Boolean).join('\n');

  const instruction = target === 'brief'
    ? `Write a 2–3 sentence project brief describing the problem, approach, and outcome.`
    : `Write a concise paragraph for this section that explains intent, decisions, and results.`;

  return `${base}\n\n${instruction}\nReturn only the copy, no markdown headings.`;
}