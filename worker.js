// Cloudflare Worker — wildcard *.portfoolio.me → dynamic portfolios (free)
// Setup: wrangler, route *.portfoolio.me/* to this worker, KV namespace PROFILES
// v1 fallback: serves seed profiles; v2: read from KV (populated by builder API)
const SEED = {
  neerajkr: 'https://portfoolio.me/profiles/neerajkr.json',
  demo: 'https://portfoolio.me/profiles/demo.json',
};
const RESERVED = new Set(['www', 'app', 'api', 'admin', 'portfoolio']);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const host = url.hostname.toLowerCase();
    const parts = host.split('.');
    let sub = null;
    if (host.endsWith('portfoolio.me') && parts.length === 3) sub = parts[0];
    if (!sub || RESERVED.has(sub)) {
      return Response.redirect('https://portfoolio.me/', 302);
    }
    // 1. Try KV first (v2 permanent store)
    try {
      if (env.PROFILES) {
        const kv = await env.PROFILES.get(sub);
        if (kv) return render(JSON.parse(kv), sub);
      }
    } catch {}
    // 2. Fallback to seed JSON on origin
    try {
      const r = await fetch(SEED[sub] || `https://portfoolio.me/profiles/${sub}.json`);
      if (r.ok) return render(await r.json(), sub);
    } catch {}
    // 3. Claim page
    return Response.redirect(`https://portfoolio.me/?claim=${encodeURIComponent(sub)}`, 302);
  },
};

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function render(p, sub) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — ${esc(p.title)} | portfoolio.me</title>
<link rel="stylesheet" href="https://portfoolio.me/style.css"></head>
<body><div class="bg-fx"></div><div class="wrap" style="padding:120px 0 60px">
<div class="pill"><span class="dot"></span>${esc(sub)}.portfoolio.me</div>
<h1 style="font-size:clamp(38px,6vw,64px)">Hi, I'm <span class="grad">${esc(p.name)}</span><br>${esc(p.title)}</h1>
<p class="sub">${esc(p.tagline || '')}</p>
<p><a href="mailto:${esc(p.email)}" style="color:#22d3ee;font-weight:800">${esc(p.email || '')}</a> ${p.github ? `• <a href="${esc(p.github)}" style="color:#22d3ee;font-weight:800">GitHub</a>` : ''}</p>
<p style="margin-top:20px"><a href="https://portfoolio.me/">Create yours free →</a></p>
</div></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'public, max-age=300' } });
}
