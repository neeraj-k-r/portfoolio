// portfoolio.me wildcard worker — *.portfoolio.me → approved Supabase profiles (free, no Netlify Pro)
// Deploy: npx wrangler deploy (see wrangler.toml). Route: *.portfoolio.me/*
// Data: Supabase REST (public read of approved rows only — RLS enforced) + seed JSON fallback.
const SUPABASE_URL = 'https://oorcivmymcokbjiawkig.supabase.co';
const SUPABASE_KEY = 'sb_publishable_u3HhZlncnGcg_UBT4G3N-Q_3uE5Qh63'; // publishable by design; RLS is the lock
const ORIGIN = 'https://portfoolio.me';
const RESERVED = new Set(['www', 'app', 'api', 'admin', 'mail', 'blog', 'portfoolio', 'netlify']);

const SEC_HEADERS = {
  'Content-Security-Policy': "default-src 'self' https://portfoolio.me https://*.portfoolio.me; script-src 'self' 'unsafe-inline' https://portfoolio.me https://*.portfoolio.me https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://portfoolio.me https://*.portfoolio.me https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; font-src 'self' https://portfoolio.me https://*.portfoolio.me https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://portfoolio.me https://*.portfoolio.me https://oorcivmymcokbjiawkig.supabase.co https://*.supabase.co https://res.cloudinary.com https://api.cloudinary.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function wShowInsta(p) {
  if (!p || !p.instagram) return false;
  if (p.showInstagram === false || p.show_instagram === false) return false;
  return true;
}
const ICONS = {
  campus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v5"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><path d="M12 9V6"/><circle cx="12" cy="4.5" r="1.2"/><circle cx="9.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><path d="M9.5 16.5h5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20v-6M11 20V6M17 20v-9"/><path d="M3 20h18"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-5 4 5 4M16 8l5 4-5 4"/></svg>',
};
function iconFor(pr) {
  const t = ((pr.title || '') + ' ' + (pr.tags || []).join(' ')).toLowerCase();
  if (/campus|college|student|school/.test(t)) return ICONS.campus;
  if (/ai|interview|bot|agent|robot/.test(t)) return ICONS.bot;
  if (/dash|lead|analy|chart|crm|sales/.test(t)) return ICONS.chart;
  return ICONS.code;
}
function dpProjectIcon(pr) {
  const t = (((pr.title || '') + ' ' + (pr.tags || []).join(' ') + ' ' + techsOf(pr).join(' '))).toLowerCase();
  if (/campus|college|student|school|education/.test(t)) return '<i class="fa-solid fa-graduation-cap"></i>';
  if (/ai|interview|bot|agent|robot|brain|llm|gpt/.test(t)) return '<i class="fa-solid fa-robot"></i>';
  if (/dash|lead|analy|chart|crm|sales|finance|stock/.test(t)) return '<i class="fa-solid fa-chart-line"></i>';
  if (/health|med|fit|hospital|care/.test(t)) return '<i class="fa-solid fa-heart-pulse"></i>';
  if (/whatsapp|chat|support|message|social/.test(t)) return '<i class="fa-solid fa-comments"></i>';
  if (/game|monopoly|play|fun|arcade/.test(t)) return '<i class="fa-solid fa-gamepad"></i>';
  if (/web|app|site|frontend|design|ui/.test(t)) return '<i class="fa-solid fa-laptop-code"></i>';
  return '<i class="fa-solid fa-code"></i>';
}

async function getProfile(sub) {
  // 1) Supabase: approved rows are publicly readable
  try {
    const fullSelect = 'username,name,title,tagline,email,phone,location,github,linkedin,instagram,show_instagram,template,skills,projects,avatar_url,site_type,site_path,experience,education,resume,track,works';
    // Fallback select for DBs where the owner never re-ran supabase-schema.sql
    // (missing site_type / resume columns). PostgREST 400s the whole query
    // when any selected column is absent, so retry with v1 core columns.
    const coreSelect = 'username,name,title,tagline,email,phone,location,github,linkedin,template,skills,projects,avatar_url';
    const fetchSel = async (sel) => {
      const url = `${SUPABASE_URL}/rest/v1/profiles?username=eq.${encodeURIComponent(sub)}&status=eq.approved&select=${sel}`;
      const r = await fetch(url, { headers: { apikey: SUPABASE_KEY, Accept: 'application/json' } });
      if (!r.ok) return null;
      const rows = await r.json();
      return rows.length ? rows[0] : null;
    };
    let row = await fetchSel(fullSelect);
    if (!row) row = await fetchSel(coreSelect);
    if (row) {
      if (row.avatar_url && !row.avatarUrl) row.avatarUrl = row.avatar_url;
      if (row.avatarUrl && !row.avatar_url) row.avatar_url = row.avatarUrl;
      if (typeof row.show_instagram === 'boolean' && typeof row.showInstagram === 'undefined') row.showInstagram = row.show_instagram;
      if (typeof row.showInstagram === 'boolean' && typeof row.show_instagram === 'undefined') row.show_instagram = row.showInstagram;
      // Self-heal legacy rows: a visual-only template implies the visual track
      if (row.track !== 'visual' && ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom'].includes(String(row.template || '').toLowerCase())) row.track = 'visual';
      if (row.track !== 'visual') row.track = 'tech';
      return row;
    }
  } catch {}
  // 2) seed showcase files on the origin site
  try {
    const r = await fetch(`${ORIGIN}/profiles/${encodeURIComponent(sub)}.json`);
    if (r.ok) {
      const seed = await r.json();
      if (seed) {
        if (seed.avatar_url && !seed.avatarUrl) seed.avatarUrl = seed.avatar_url;
        if (seed.avatarUrl && !seed.avatar_url) seed.avatar_url = seed.avatarUrl;
        if (typeof seed.show_instagram === 'boolean' && typeof seed.showInstagram === 'undefined') seed.showInstagram = seed.show_instagram;
        if (typeof seed.showInstagram === 'boolean' && typeof seed.show_instagram === 'undefined') seed.show_instagram = seed.showInstagram;
      }
      return seed;
    }
  } catch {}
  return null;
}

// ---- Prebuilt upload hosting: proxy files from public storage bucket ----
// Layout: portfolio-sites / sites/<username>/<path>. Relative asset URLs in the
// user's index.html resolve against the subdomain, so every path lands here.
const SITES_BUCKET = 'portfolio-sites';
function siteMime(path) {
  const ext = String(path || '').split('.').pop().toLowerCase().split('?')[0];
  const map = { html: 'text/html;charset=UTF-8', htm: 'text/html;charset=UTF-8', css: 'text/css',
    js: 'text/javascript', json: 'application/json', svg: 'image/svg+xml', png: 'image/png',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
    ico: 'image/x-icon', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf',
    txt: 'text/plain', mp4: 'video/mp4' };
  return map[ext] || 'application/octet-stream';
}
async function serveUploadedSite(sub, pathname) {
  let rel = decodeURIComponent(pathname || '/').replace(/^\/+/, '') || 'index.html';
  if (rel.includes('..') || /[\0<>]/.test(rel)) return null;
  if (rel.endsWith('/')) rel += 'index.html';
  const tryFetch = async (key) => {
    const r = await fetch(
      `${SUPABASE_URL}/storage/v1/object/public/${SITES_BUCKET}/sites/${encodeURIComponent(sub)}/${key.split('/').map(encodeURIComponent).join('/')}`);
    if (!r.ok) return null;
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      headers: {
        'content-type': r.headers.get('content-type') || siteMime(key),
        'cache-control': /\.html?$/.test(key) ? 'public, max-age=60' : 'public, max-age=86400',
        ...SEC_HEADERS,
      },
    });
  };
  // exact asset first, then SPA fallback to index.html for extensionless routes
  return (await tryFetch(rel))
    || (/\.[\w]{1,5}$/.test(rel) ? null : await tryFetch('index.html'));
}

function head(p, tpl) {
  return `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — ${esc(p.title)} | portfoolio.me</title>
<meta name="description" content="${esc(p.tagline || p.title || '')}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Tajawal:wght@300;400;500;700;800;900&family=Fira+Code:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/templates.css"><link rel="stylesheet" href="/resume.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script></head>`;
}
function nav(p) {
  return `<nav><a class="logo" href="${ORIGIN}/"><img class="brand-logo" src="/favicon.png" alt="portfoolio logo" width="24" height="24" style="vertical-align:middle"><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
  <div style="display:flex;gap:10px"><a class="btn btn-ghost btn-sm" href="${ORIGIN}/">Make yours</a>
  ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}">Hire ${esc((p.name || '').split(' ')[0])}</a>` : ''}</div></nav>`;
}
function foot(p) {
  return `<footer><div class="wrap foot"><div>© ${new Date().getFullYear()} <b>${esc(p.name)}</b> via <b>portfoolio.me</b></div>
  <div class="socials">${p.github ? `<a href="${esc(p.github)}"><i class="fa-brands fa-github"></i></a>` : ''}${p.linkedin ? `<a href="${esc(p.linkedin)}"><i class="fa-brands fa-linkedin"></i></a>` : ''}${wShowInsta(p) ? `<a href="${esc(p.instagram)}"><i class="fa-brands fa-instagram"></i></a>` : ''}${p.email ? `<a href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i></a>` : ''}</div></div></footer>`;
}
function projectsFor(p, tpl) {
  // mirror frontend/templates.js per-template project styles so subdomain == trial
  if (tpl === 'afterglow') {
    return (p.projects || []).map((pr, i) => `
    <div class="ag-row"><span class="ag-num">${String(i + 1).padStart(2, '0')}</span>
    <div style="flex:1;min-width:220px"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    <div class="tags">${techsOf(pr).map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>
    <div style="display:flex;gap:8px;align-items:center;flex-shrink:0"><a class="btn btn-primary btn-sm" href="${esc(pr.url)}">View →</a>${pr.demoUrl ? `<a class="btn btn-ghost btn-sm" href="${esc(pr.demoUrl)}">Demo</a>` : ''}</div></div>`).join('');
  }
  if (tpl === 'ultraviolet') {
    return (p.projects || []).map((pr) => `
    <div class="uv-row"><div style="flex:1;min-width:200px">
    <p class="mono" style="font-size:12px;color:#e0aaff">~/signal/${esc(pr.title.toLowerCase().replace(/\s+/g, '-'))}</p>
    <h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p></div>
    <div style="display:flex;gap:8px;align-items:center;flex-shrink:0"><a href="${esc(pr.url)}" style="font-weight:800">open →</a>${pr.demoUrl ? `<a href="${esc(pr.demoUrl)}" style="font-weight:800">demo →</a>` : ''}</div></div>`).join('');
  }
  if (tpl === 'minimal') {
    return (p.projects || []).map((pr) => `
    <div class="card"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    <div class="tags">${techsOf(pr).map((t) => `<a href="/skills/${encodeURIComponent(t.toLowerCase())}" style="text-decoration:none"><span>${esc(t)}</span></a>`).join('')}</div>
    <div style="margin-top:10px"><a class="btn btn-ghost btn-sm" href="${esc(pr.url)}">View project →</a>${pr.demoUrl ? ` <a class="btn btn-ghost btn-sm" href="${esc(pr.demoUrl)}">Demo →</a>` : ''}</div></div>`).join('');
  }
  if (tpl === 'terminal') {
    return (p.projects || []).map((pr) => `
    <div class="card"><p class="mono" style="color:#4ade80">$ open ${esc(pr.title.toLowerCase().replace(/\s+/g, '-'))}</p>
    <h3>> ${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    <p class="mono" style="font-size:12.5px;color:#86efac">${techsOf(pr).map(esc).join(' • ')}</p>
    <a class="btn btn-ghost btn-sm" href="${esc(pr.url)}">$ visit --url →</a></div>`).join('');
  }
  if (tpl === 'editorial') {
    return (p.projects || []).map((pr, i) => `
    <div class="card" style="margin-bottom:12px"><p class="mono" style="font-size:12px;opacity:.7">No. ${String(i + 1).padStart(2, '0')}</p>
    <h3 style="font-size:24px">${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    <p style="font-size:13px"><i>${techsOf(pr).map(esc).join(' · ')}</i></p>
    <p><a href="${esc(pr.url)}" style="font-weight:800">Read the story →</a>${pr.demoUrl ? ` &nbsp;·&nbsp; <a href="${esc(pr.demoUrl)}" style="font-weight:800">Live demo →</a>` : ''}</p></div>`).join('');
  }
  if (tpl === 'brutalist') {
    return (p.projects || []).map((pr) => `
    <div class="card"><h3 style="font-size:22px">■ ${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    <p>${techsOf(pr).map((t) => `<a href="/skills/${encodeURIComponent(t.toLowerCase())}" style="text-decoration:none"><span class="badge">${esc(t)}</span></a>`).join(' ')}</p>
    <p><a class="btn btn-primary btn-sm" href="${esc(pr.url)}">CODE →</a> ${pr.demoUrl ? `<a class="btn btn-ghost btn-sm" href="${esc(pr.demoUrl)}">DEMO →</a>` : ''}</p></div>`).join('');
  }
  if (tpl === 'motion') {
    const grads = ['linear-gradient(135deg,#ff6a3d,#ffb36b)','linear-gradient(135deg,#3d5afe,#8ab4ff)','linear-gradient(135deg,#00bfa5,#b9f6ca)','linear-gradient(135deg,#8e24aa,#f48fb1)','linear-gradient(135deg,#f9a825,#ffe082)','linear-gradient(135deg,#00838f,#4dd0e1)'];
    return (p.projects || []).map((pr, i) => `
    <li class="rv" style="--d:${i * 60}ms"><a class="row" href="${esc(pr.url || '#')}" data-g="${grads[i % grads.length]}">
      <b>${String(i + 1).padStart(2, '0')}</b>
      <h3>${esc(pr.title)}</h3>
      <span>${techsOf(pr).slice(0, 2).map(esc).join(' · ')}</span>
      <span>${pr.repo && pr.repo.updatedAt ? esc(String(pr.repo.updatedAt).slice(0, 4)) : new Date().getFullYear()}</span>
    </a></li>`).join('');
  }
  if (tpl === 'darkpro') {
    return (p.projects || []).map((pr) => {
      const screenshot = pr.image || pr.imageUrl || pr.screenshot || (pr.repo && pr.repo.screenshot ? pr.repo.screenshot : '');
      return `
    <li class="proj-item"><a href="${esc(pr.url || '#')}" target="_blank" rel="noopener">
      <figure class="proj-img${screenshot ? '' : ' proj-img-placeholder'}">
        ${screenshot
          ? `<div class="proj-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></div><img src="${esc(screenshot)}" alt="${esc(pr.title)}" loading="lazy">`
          : `<div class="proj-placeholder"><div class="proj-placeholder-icon">${dpProjectIcon(pr)}</div><span class="proj-placeholder-title">${esc(pr.title)}</span></div><div class="proj-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>`}
      </figure>
      <h3 class="proj-title">${esc(pr.title)}</h3>
      <p class="proj-cat">${techsOf(pr).slice(0, 2).map(esc).join(' • ') || 'Project'}</p></a></li>`;
    }).join('');
  }
  if (tpl === 'fullpage') {
    return (p.projects || []).map((pr) => `
    <div class="fp-slide"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc || pr.title || '')}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="btn btn-ghost btn-sm" href="${esc(pr.url || '#')}" target="_blank" rel="noopener">View →</a>
        ${pr.demoUrl ? `<a class="btn btn-primary btn-sm" href="${esc(pr.demoUrl)}" target="_blank" rel="noopener">Demo →</a>` : ''}
      </div></div>`).join('');
  }
  return cards(p);
}
function cards(p) {
  return (p.projects || []).map((pr, i) => {
    const techs = techsOf(pr);
    const gh = pr.repo ? `<span class="badge" style="font-size:11px" title="Repository retrieved from GitHub — not a skill endorsement">✓ GitHub Verified</span>` : '';
    const live = pr.demoUrl ? `<a class="badge" style="font-size:11px" href="${esc(pr.demoUrl)}">↗ Live Demo</a>` : '';
    const meta = pr.repo ? `<small style="color:var(--muted);font-size:11.5px">${esc(pr.repo.fullName || '')}${pr.repo.updatedAt ? ` • updated ${esc(String(pr.repo.updatedAt).slice(0, 7))}` : ''}</small>` : '';
    return `
    <article class="proj"><div class="proj-top p${(i % 6) + 1}"><div class="proj-art">${iconFor(pr)}</div><div class="stars">${esc(pr.stars || 'Live')}</div></div>
    <div class="proj-body"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    ${techs.length ? `<div class="tags">${techs.map((t) => `<a href="/skills/${encodeURIComponent(t.toLowerCase())}" style="text-decoration:none"><span>${esc(t)}</span></a>`).join('')}</div>` : ''}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:2px;align-items:center">${gh}${live}${meta}</div>
    <div class="proj-actions"><a class="primary" href="${esc(pr.url)}" target="_blank" rel="noopener">View code</a>${pr.demoUrl ? `<a href="${esc(pr.demoUrl)}" target="_blank" rel="noopener">Demo</a>` : ''}</div></div></article>`;
  }).join('');
}
function skillEvidence(p) {
  // local derivation mirroring frontend/evidence.js (worker has no shared imports)
  const map = new Map();
  (p.projects || []).forEach((pr) => {
    techsOf(pr).forEach((t) => {
      const k = t.toLowerCase();
      if (!map.has(k)) map.set(k, { name: t, n: 0, repos: 0 });
      const e = map.get(k);
      e.n += 1;
      if (pr.repo) e.repos += 1;
    });
  });
  return Array.from(map.values()).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
}
function skillsSection(p) {
  if (p.skillsDisplay === 'simple') {
    return `<section class="wrap" style="padding-top:10px"><span class="eyebrow">● Skills</span>
    <h2 class="title">What I <span class="grad">work with</span></h2>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${(p.skills || []).map((s) => `<span class="badge">✦ ${esc(s)}</span>`).join('') || '<p>No skills listed yet.</p>'}</div></section>`;
  }
  const ev = skillEvidence(p);
  if (!ev.length) {
    return `<section class="wrap" style="padding-top:10px"><span class="eyebrow">● Skills</span>
    <h2 class="title">Don't list it. <span class="grad">Prove it.</span></h2>
    <p style="color:var(--muted)">No evidence yet — skills appear here once projects are tagged with technologies.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${(p.skills || []).map((s) => `<span class="badge">✦ ${esc(s)}</span>`).join('')}</div></section>`;
  }
  return `<section class="wrap" style="padding-top:10px"><span class="eyebrow">● Skills</span>
  <h2 class="title">Don't list it. <span class="grad">Prove it.</span></h2>
  <div class="proj-grid" style="grid-template-columns:repeat(3,1fr);margin-top:14px">${ev.map((s) => `
    <a class="card" style="display:block;padding:18px" href="/skills/${encodeURIComponent(s.name.toLowerCase())}">
      <h3 style="font-size:17px">${esc(s.name)}</h3>
      <p style="color:var(--muted);font-size:13px;margin:4px 0 0">${s.n} project${s.n > 1 ? 's' : ''}${s.repos ? ` · ${s.repos} repositor${s.repos > 1 ? 'ies' : 'y'}` : ''}</p>
      <span style="color:#22d3ee;font-size:13px;font-weight:800">View evidence →</span>
    </a>`).join('')}</div></section>`;
}
function pageGallery(p, wIdx) {
  const vtpl = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom', 'motion'].includes(String(p.template || '').toLowerCase()) ? String(p.template).toLowerCase() : 'gallery';
  const works = Array.isArray(p.works) ? p.works.filter(w => w && w.imageUrl) : [];
  const i = parseInt(wIdx, 10);
  const w = (!isNaN(i) && works[i]) ? works[i] : null;
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar
    ? `<img src="${esc(avatar)}" alt="${esc(p.name || '')}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 14px;display:block;border:3px solid rgba(255,255,255,.2)">`
    : '';
  const letter = esc((p.name || '?').trim().charAt(0).toUpperCase());
  const countLabel = `${works.length} work${works.length === 1 ? '' : 's'}`;
  const emptyMsg = '<p>No works published yet.</p>';
  const body = w
    ? `<section class="wrap" style="padding:140px 0 20px;max-width:900px">
      ${w.category ? `<span class="badge">✦ ${esc(w.category)}</span>` : ''}
      <h1 style="font-size:clamp(32px,5vw,52px);margin:10px 0">${esc(w.title || 'Untitled')}</h1>
      ${w.desc ? `<p style="color:var(--muted);font-size:16px">${esc(w.desc)}</p>` : ''}
      <img src="${esc(w.imageUrl)}" alt="${esc(w.title || '')}" style="width:100%;border-radius:18px;margin-top:18px">
      <p style="margin-top:16px"><a class="btn btn-ghost btn-sm" href="/">← ${esc(p.name)}</a></p></section>`
    : vtpl === 'museum'
    ? `<header class="wrap gal-museum-head">
      ${avatar ? `<img class="museum-portrait" src="${esc(avatar)}" alt="${esc(p.name || '')}">` : `<div class="museum-portrait museum-portrait-fallback">${letter}</div>`}
      <p class="museum-kicker">— EXHIBITION —</p>
      <h1>${esc(p.name)}</h1>
      <p class="museum-sub">${esc(p.title || '')}</p>
      <p class="museum-meta">${esc(p.location || '')} · ${countLabel}</p>
    </header>
    <section class="wrap museum-hang">${works.map((k, n) => `
      <a class="museum-piece" href="/?w=${n}" style="text-decoration:none;color:inherit">
        <div class="museum-frame"><img src="${esc(k.imageUrl)}" alt="${esc(k.title || '')}" loading="lazy"></div>
        <div class="museum-plaque">
          <span class="museum-no">${String(n + 1).padStart(2, '0')}</span>
          <div class="museum-plaque-text"><b>${esc(k.title || 'Untitled')}</b>${k.category ? `<small>${esc(k.category)}</small>` : ''}</div>
        </div>
      </a>`).join('') || emptyMsg}</section>`
    : vtpl === 'catalog'
    ? `<header class="wrap gal-catalog-head">
      <p class="cat-kicker">— CATALOGUE —</p>
      <h1>${esc(p.name)}</h1>
      <p class="cat-sub">${esc(p.title || '')}</p>
      <p class="cat-meta">${esc(p.location || '')} · ${countLabel}</p>
      ${avatar ? `<img class="cat-portrait" src="${esc(avatar)}" alt="${esc(p.name || '')}">` : ''}
    </header>
    <section class="wrap cat-index">${works.map((k, n) => `
      <a class="cat-row" href="/?w=${n}" style="text-decoration:none;color:inherit">
        <span class="cat-no">${String(n + 1).padStart(2, '0')}</span>
        <div class="cat-thumb"><img src="${esc(k.imageUrl)}" alt="${esc(k.title || '')}" loading="lazy"></div>
        <div class="cat-text"><b>${esc(k.title || 'Untitled')}</b>${k.category ? `<small>${esc(k.category)}</small>` : ''}${k.desc ? `<p>${esc(k.desc)}</p>` : ''}</div>
        <span class="cat-arrow">→</span>
      </a>`).join('') || emptyMsg}</section>`
    : vtpl === 'bloom'
    ? `<header class="wrap gal-bloom-head">
      <div class="bloom-orb"></div>
      ${avatar ? `<img class="bloom-portrait" src="${esc(avatar)}" alt="${esc(p.name || '')}">` : `<div class="bloom-portrait bloom-portrait-fallback">${letter}</div>`}
      <h1>${esc(p.name)}</h1>
      <p class="bloom-sub">${esc(p.title || '')}</p>
      <p class="bloom-meta">${esc(p.location || '')} · ${countLabel}</p>
    </header>
    <section class="wrap bloom-masonry">${works.map((k, n) => `
      <a class="bloom-tile ${n % 5 === 0 ? 'tall' : ''}" href="/?w=${n}" style="text-decoration:none;color:inherit">
        <img src="${esc(k.imageUrl)}" alt="${esc(k.title || '')}" loading="lazy">
        <div class="bloom-cap"><b>${esc(k.title || 'Untitled')}</b>${k.category ? `<small>${esc(k.category)}</small>` : ''}</div>
      </a>`).join('') || emptyMsg}</section>`
    : vtpl === 'motion'
    ? `<div id="bar" aria-hidden="true"></div><div class="blob" aria-hidden="true"></div><div class="pv" aria-hidden="true"><i></i></div>
       <nav class="motion-nav pad"><a class="logo" href="/">${esc(p.name)}</a>
       <nav><a class="hide" href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav></nav>
       <main id="top">
       <div class="hero pad"><h1 class="lx-title" aria-label="${esc(p.name || p.title || 'Portfolio')}">
         <span class="w"><span style="--i:0">${esc((p.name || p.title || 'Portfolio').split(' ').slice(0, Math.max(1, Math.ceil((p.name || p.title || 'Portfolio').split(' ').length / 2))).join(' '))}</span></span>
         ${(p.name || p.title || 'Portfolio').split(' ').slice(Math.max(1, Math.ceil((p.name || p.title || 'Portfolio').split(' ').length / 2))).length ? `<span class="w"><span style="--i:1">${esc((p.name || p.title || 'Portfolio').split(' ').slice(Math.max(1, Math.ceil((p.name || p.title || 'Portfolio').split(' ').length / 2))).join(' '))}</span></span>` : ''}</h1>
         <div class="hero-meta"><p class="rv" style="--d:700ms">${esc(p.title ? `${p.title}${p.tagline ? ' — ' + p.tagline : ''}` : (p.tagline || ''))}</p>
         <div class="scroll rv" style="--d:900ms"><i></i>Scroll</div></div></div>
       <section class="pad" id="work"><p class="eyebrow rv">Selected work</p>
         <ul class="work-rows">${works.map((k, n) => `
           <li class="rv" style="--d:${n * 60}ms"><a class="row" href="/?w=${n}" data-g="${esc(k.imageUrl)}">
             <b>${String(n + 1).padStart(2, '0')}</b>
             <h3>${esc(k.title || 'Untitled')}</h3>
             <span>${k.category ? esc(k.category) : ''}</span>
             <span>${k.year ? esc(String(k.year)) : '↗'}</span>
           </a></li>`).join('') || '<li class="rv">No works yet.</li>'}</ul></section>
       <section class="pad" id="about"><p class="eyebrow rv">About</p>
         <p class="lead rv">${esc(p.tagline || p.title || '')}</p>
         ${avatar ? `<img src="${esc(avatar)}" alt="${esc(p.name)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:20px 0;border:3px solid rgba(255,255,255,.2)">` : ''}
       </section>
       <section class="pad contact" id="contact"><p class="eyebrow rv">Say hello</p>
         <a class="big rv" href="mailto:${esc(p.email || '')}">${esc(p.name || 'Get in touch')}</a>
         <div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap">
           ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i> Email</a>` : ''}
           ${p.github ? `<a class="btn btn-ghost btn-sm" href="${esc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
           ${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${esc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
           ${wShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${esc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
         </div></section>
       </main>
       <footer class="pad"><span>© ${new Date().getFullYear()} ${esc(p.name)}</span><span>Built with portfoolio.me</span></footer>`
    : `<header class="wrap" style="padding:140px 0 10px;text-align:center">
      ${face}
      <h1 style="font-size:clamp(36px,5vw,56px)">${esc(p.name)}</h1>
      <p style="color:var(--muted);font-size:17px">${esc(p.title || '')}</p>
      <p style="color:var(--muted);font-size:14px;margin-top:6px">${esc(p.location || '')} · ${countLabel}</p></header>
    <section class="wrap" style="padding-top:10px"><div class="works-grid" style="margin-top:18px">${works.map((k, n) => `
      <a class="work-card" href="/?w=${n}" style="text-decoration:none;color:inherit"><img src="${esc(k.imageUrl)}" alt="${esc(k.title || '')}" loading="lazy">
      <div class="work-meta"><b>${esc(k.title || 'Untitled')}</b>${k.category ? `<small>${esc(k.category)}</small>` : ''}</div></a>`).join('') || emptyMsg}</div></section>`;
  if (vtpl === 'motion') {
    return `<!DOCTYPE html><html lang="en">${head(p, 'motion')}<body class="portfolio-view" data-template="motion">${body}<script>
      (function(){
        var bar=document.getElementById('bar');
        function onScroll(){
          var max=document.documentElement.scrollHeight-document.documentElement.clientHeight;
          if(max>0&&bar)bar.style.transform='scaleX('+(window.scrollY/max)+')';
        }
        window.addEventListener('scroll',onScroll,{passive:true});
        onScroll();
        var obs=new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
        },{rootMargin:'0px 0px -8% 0px'});
        document.querySelectorAll('.rv').forEach(function(el){ obs.observe(el); });
        if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
          var blob=document.querySelector('.blob');
          var pv=document.querySelector('.pv');
          var pi=pv?pv.firstElementChild:null;
          var tx=window.innerWidth/2,ty=window.innerHeight/3,bx=tx,by=ty,px=tx,py=ty,raf=0;
          function loop(){
            bx+=(tx-bx)*0.06;by+=(ty-by)*0.06;
            if(blob)blob.style.transform='translate3d('+(bx-blob.offsetWidth/2)+'px,'+(by-blob.offsetHeight/2)+'px,0)';
            if(pv){ px+=(tx-px)*0.12;py+=(ty-py)*0.12; pv.style.transform='translate3d('+(px+24)+'px,'+(py-90)+'px,0)'; }
            raf=(Math.abs(tx-bx)+Math.abs(ty-by)>0.5)?requestAnimationFrame(loop):0;
          }
          raf=requestAnimationFrame(loop);
          window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
          document.querySelectorAll('.row').forEach(function(a){
            a.addEventListener('pointerenter',function(){
              if(pi&&a.dataset.g){ pi.style.backgroundImage='url('+a.dataset.g+')'; pi.style.backgroundSize='cover'; pi.style.backgroundPosition='center'; }
              if(pv)pv.classList.add('on');
            });
            a.addEventListener('pointerleave',function(){ if(pv)pv.classList.remove('on'); });
          });
        }
      })();
    </script></body></html>`;
  }
  return `<!DOCTYPE html><html lang="en">${head(p, 'midnight')}<body class="portfolio-view" data-template="${vtpl}"><div class="bg-fx"></div><div class="blob"></div><div class="pv"><i></i></div><div id="bar" aria-hidden="true"></div>${nav(p)}${body}${foot(p)}<script>(function(){const template=document.body.dataset.template;const isVisual=['gallery','studio','noir','museum','catalog','bloom','motion'].includes(template);if(!isVisual)return;const bar=document.getElementById('bar');const onScroll=()=>{const max=document.documentElement.scrollHeight-document.documentElement.clientHeight;if(max>0&&bar)bar.style.transform='scaleX('+(scrollY/max)+')';if(bar)bar.style.background='#4f46e5'};window.addEventListener('scroll',onScroll,{passive:true});onScroll();const blob=document.querySelector('.blob');const pv=document.querySelector('.pv');const pi=pv?.firstElementChild;let tx=innerWidth/2,ty=innerHeight/3,bx=tx,by=ty,px=tx,py=ty,raf=0;const loop=()=>{bx+=(tx-bx)*0.06;by+=(ty-by)*0.06;if(blob)blob.style.transform='translate3d('+(bx-blob.offsetWidth/2)+'px,'+(by-blob.offsetHeight/2)+'px,0)';if(pv){px+=(tx-px)*0.12;py+=(ty-py)*0.12;pv.style.transform='translate3d('+(px+24)+'px,'+(py-90)+'px,0)'}raf=(Math.abs(tx-bx)+Math.abs(ty-by)>0.5)?requestAnimationFrame(loop):0};raf=requestAnimationFrame(loop);addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop);},{passive:true});document.querySelectorAll('.row').forEach(a=>{a.addEventListener('pointerenter',()=>{if(pi){pi.style.backgroundImage='url('+a.dataset.g+')';pi.style.backgroundSize='cover';pi.style.backgroundPosition='center'}if(pv)pv.classList.add('on')});a.addEventListener('pointerleave',()=>{if(pv)pv.classList.remove('on')})});if('IntersectionObserver'in window){const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -20px 0px',threshold:0.01});document.querySelectorAll('.rv').forEach(el=>{io.observe(el);const r=el.getBoundingClientRect();if(r.top<window.innerHeight&&r.bottom>0)el.classList.add('in')})}else{document.querySelectorAll('.rv').forEach(el=>el.classList.add('in'))}})();</script></body></html>`;
}
function pageModerncv(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Full Stack Developer & UI/UX Designer');
  const desc = esc(p.tagline || 'Passionate developer creating exceptional digital experiences with modern technologies.');
  const aboutText = esc(p.bio || p.desc || p.tagline || "I'm a passionate Full Stack Developer with over 5 years of experience in building modern web applications and mobile solutions. I specialize in JavaScript technologies, React, Node.js, and creating beautiful user interfaces.");
  const email = esc(p.email || 'developer@example.com');
  const phone = esc(p.phone || '+966 50 123 4567');
  const location = esc(p.location || 'Riyadh, Saudi Arabia');

  const avatarHtml = (p.avatarUrl || p.avatar_url)
    ? `<img src="${esc(p.avatarUrl || p.avatar_url)}" alt="${name}" class="profile-img" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
    : `<div class="profile-placeholder"><i class="fas fa-code"></i></div>`;

  const userSkills = Array.isArray(p.skills) && p.skills.length ? p.skills : ['React', 'Node.js', 'TypeScript'];
  const codeSkills = userSkills.slice(0, 3).map((s) => `'${esc(s)}'`).join(', ');

  const feDefaults = [
    { name: 'React', pct: 95 },
    { name: 'Vue.js', pct: 85 },
    { name: 'TypeScript', pct: 90 },
    { name: 'Next.js', pct: 88 }
  ];
  const beDefaults = [
    { name: 'Node.js', pct: 92 },
    { name: 'Express', pct: 90 },
    { name: 'MongoDB', pct: 85 },
    { name: 'PostgreSQL', pct: 80 }
  ];
  const toolDefaults = [
    { name: 'Git', pct: 95 },
    { name: 'Docker', pct: 75 },
    { name: 'AWS', pct: 70 },
    { name: 'Figma', pct: 88 }
  ];

  function renderSkillCategory(items) {
    return items.map((s) => `
      <div class="skill-item" data-skill="${esc(s.name)}" data-percent="${s.pct}">
        <div class="skill-header">
          <span class="skill-name">${esc(s.name)}</span>
          <span class="skill-percent">0%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress"></div>
        </div>
      </div>`).join('');
  }

  let expList = [];
  if (Array.isArray(p.experience) && p.experience.length) {
    expList = p.experience.map((e) => ({
      year: `${esc(e.start || '2022')} - ${e.current ? 'Present' : esc(e.end || 'Present')}`,
      isCurrent: Boolean(e.current),
      title: esc(e.role || e.title || 'Developer'),
      company: esc(e.company || 'Tech Company Inc.'),
      desc: esc(e.desc || 'Developed and maintained modern web applications.'),
      achievements: Array.isArray(e.achievements) ? e.achievements.map((a) => esc(a)) : [],
      tags: Array.isArray(e.tags) ? e.tags.map((t) => esc(t)) : (Array.isArray(e.technologies) ? e.technologies.map((t) => esc(t)) : ['React', 'Node.js', 'TypeScript'])
    }));
  } else {
    expList = [
      {
        year: '2022 - Present',
        isCurrent: true,
        title: 'Senior Full Stack Developer',
        company: 'Tech Company Inc.',
        desc: 'Leading a team of developers in building complex web applications using React and Node.js. Developing advanced user interfaces and optimizing performance. Implementing microservices architecture and CI/CD pipelines.',
        achievements: ['Led team of 5 developers', 'Improved performance by 40%', 'Deployed 20+ production apps'],
        tags: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS']
      },
      {
        year: '2020 - 2022',
        isCurrent: false,
        title: 'Frontend Developer',
        company: 'Digital Solutions',
        desc: 'Developed interactive user interfaces using React and Vue.js. Worked on improving user experience and performance optimization. Collaborated with designers to implement pixel-perfect designs.',
        achievements: ['Built 15+ responsive websites', 'Reduced load time by 50%'],
        tags: ['React', 'Vue.js', 'JavaScript', 'SASS', 'Webpack']
      },
      {
        year: '2018 - 2020',
        isCurrent: false,
        title: 'Junior Developer',
        company: 'Creative Studio',
        desc: 'Developed websites using HTML, CSS, and JavaScript. Learned best practices in web development. Worked on various client projects and gained experience in modern web technologies.',
        achievements: ['Completed 30+ projects', 'Learned modern frameworks'],
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap']
      }
    ];
  }

  const expHtml = expList.map((e) => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <div class="timeline-year">${e.year}</div>
          ${e.isCurrent ? '<div class="timeline-badge">Current</div>' : ''}
        </div>
        <h3 class="timeline-title">${e.title}</h3>
        <div class="timeline-company"><i class="fas fa-building"></i> ${e.company}</div>
        <p class="timeline-description">${e.desc}</p>
        ${e.achievements.length ? `
        <div class="timeline-achievements">
          ${e.achievements.map((a) => `<div class="achievement-item"><i class="fas fa-check-circle"></i><span>${a}</span></div>`).join('')}
        </div>` : ''}
        <div class="timeline-tags">
          ${e.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');

  let projList = [];
  if (Array.isArray(p.projects) && p.projects.length) {
    projList = p.projects.map((pr, i) => ({
      title: esc(pr.title || `Project ${i + 1}`),
      desc: esc(pr.desc || 'A modern web application built with clean architecture and cutting-edge technologies.'),
      tags: Array.isArray(pr.technologies || pr.tags) ? (pr.technologies || pr.tags).map((t) => esc(t)) : ['React', 'TypeScript', 'Node.js'],
      url: pr.demoUrl || pr.url || '#',
      repo: (pr.repo && pr.repo.url) || (pr.url && pr.url.includes('github') ? pr.url : '#'),
      icon: pr.icon || (i % 3 === 0 ? 'fa-shopping-cart' : i % 3 === 1 ? 'fa-tasks' : 'fa-blog')
    }));
  } else {
    projList = [
      {
        title: 'E-Commerce Platform',
        desc: 'A complete e-commerce platform with payment integration and advanced inventory management.',
        tags: ['React', 'Node.js', 'MongoDB'],
        url: '#',
        repo: '#',
        icon: 'fa-shopping-cart'
      },
      {
        title: 'Task Management App',
        desc: 'A web application for task management with real-time synchronization and modern design.',
        tags: ['React', 'Firebase', 'TypeScript'],
        url: '#',
        repo: '#',
        icon: 'fa-tasks'
      },
      {
        title: 'Blog Platform',
        desc: 'A modern blog platform with CMS features and beautiful UI design.',
        tags: ['Next.js', 'Prisma', 'PostgreSQL'],
        url: '#',
        repo: '#',
        icon: 'fa-blog'
      }
    ];
  }

  const projHtml = projList.map((pr) => `
    <div class="project-card">
      <div class="project-image">
        <div class="project-overlay">
          <div class="project-links">
            <a href="${esc(pr.url)}" target="_blank" rel="noopener" class="project-link" title="View Project"><i class="fas fa-external-link-alt"></i></a>
            <a href="${esc(pr.repo)}" target="_blank" rel="noopener" class="project-link" title="View Code"><i class="fab fa-github"></i></a>
          </div>
        </div>
        <div class="project-placeholder"><i class="fas ${pr.icon || 'fa-code'}"></i></div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${pr.title}</h3>
        <p class="project-description">${pr.desc}</p>
        <div class="project-tags">${pr.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </div>`).join('');

  const projCount = (p.projects && p.projects.length) || 50;
  const expCount = (p.experience && p.experience.length ? (p.experience.length + 2) : 5);

  const moderncvScript = `<script>
  (function(){
    var AppState = {
      currentLang: 'en',
      currentTheme: 'dark',
      currentSection: 'home',
      isMenuOpen: false,
      isLoaded: false
    };

    function setLanguage(lang) {
      AppState.currentLang = lang;
      var html = document.documentElement;
      var body = document.body;
      if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        body.setAttribute('data-lang', 'ar');
        body.setAttribute('data-dir', 'rtl');
      } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        body.setAttribute('data-lang', 'en');
        body.setAttribute('data-dir', 'ltr');
      }
      var textElements = document.querySelectorAll('[data-text-en], [data-text-ar]');
      textElements.forEach(function(el) {
        var en = el.getAttribute('data-text-en');
        var ar = el.getAttribute('data-text-ar');
        if (AppState.currentLang === 'ar' && ar) el.textContent = ar;
        else if (AppState.currentLang === 'en' && en) el.textContent = en;
      });
      var placeholderElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
      placeholderElements.forEach(function(el) {
        var enP = el.getAttribute('data-placeholder-en');
        var arP = el.getAttribute('data-placeholder-ar');
        if (AppState.currentLang === 'ar' && arP) el.setAttribute('placeholder', arP);
        else if (AppState.currentLang === 'en' && enP) el.setAttribute('placeholder', enP);
      });
      var langToggle = document.getElementById('langToggle');
      if (langToggle) {
        var langText = langToggle.querySelector('.lang-text');
        if (langText) langText.textContent = AppState.currentLang === 'en' ? 'AR' : 'EN';
      }
    }

    function setTheme(theme) {
      AppState.currentTheme = theme;
      document.body.setAttribute('data-theme', theme);
      var themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        var icon = themeToggle.querySelector('i');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    function initNavigation() {
      var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
      navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var targetId = link.getAttribute('href');
          var targetSection = document.querySelector(targetId);
          if (targetSection) {
            var header = document.querySelector('.main-header');
            var headerHeight = header ? header.offsetHeight : 80;
            var targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            link.classList.add('active');
            if (AppState.isMenuOpen) toggleMobileMenu();
          }
        });
      });

      window.addEventListener('scroll', function() {
        var sections = document.querySelectorAll('section[id]');
        var scrollPosition = window.scrollY + 120;
        sections.forEach(function(section) {
          var top = section.offsetTop;
          var height = section.offsetHeight;
          var id = section.getAttribute('id');
          if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(function(l) {
              if (l.getAttribute('data-section') === id) l.classList.add('active');
              else l.classList.remove('active');
            });
          }
        });

        var header = document.querySelector('.main-header');
        if (header) {
          if (window.scrollY > 50) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
        }
      });
    }

    function toggleMobileMenu() {
      AppState.isMenuOpen = !AppState.isMenuOpen;
      var navMenu = document.getElementById('navMenu');
      var menuToggle = document.getElementById('menuToggle');
      if (navMenu) navMenu.classList.toggle('active', AppState.isMenuOpen);
      if (menuToggle) menuToggle.classList.toggle('active', AppState.isMenuOpen);
    }

    function generateParticles() {
      var container = document.getElementById('particles');
      if (!container) return;
      var symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';', ':', '&', '|', '%', '$', '#', '@'];
      for (var i = 0; i < 20; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = (Math.random() * 100) + '%';
        p.style.animationDelay = (Math.random() * 15) + 's';
        p.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(p);
      }
    }

    function initAnimations() {
      var loader = document.getElementById('loader');
      var loaderPercent = document.getElementById('loaderPercent');
      var progress = 0;
      var progressInterval = setInterval(function() {
        progress += Math.random() * 18;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          setTimeout(function() {
            if (loader) {
              loader.style.opacity = '0';
              setTimeout(function() { loader.classList.add('hidden'); }, 500);
            }
            playHeroAnimations();
          }, 300);
        }
        if (loaderPercent) loaderPercent.textContent = Math.floor(progress) + '%';
      }, 80);
    }

    function playHeroAnimations() {
      if (typeof anime === 'undefined') {
        var heroDesc = document.querySelector('.hero-description');
        if (heroDesc) heroDesc.style.opacity = '1';
        return;
      }
      var nameVal = document.getElementById('heroNameVal');
      if (nameVal) {
        var fullText = nameVal.textContent;
        nameVal.textContent = '';
        anime({
          targets: { value: 0 },
          value: fullText.length,
          duration: 1400,
          delay: 400,
          easing: 'easeInOutQuad',
          update: function(anim) {
            var len = Math.floor(anim.animatables[0].target.value);
            nameVal.textContent = fullText.substring(0, len);
          }
        });
      }
      anime({ targets: '.hero-title', opacity: [0, 1], translateX: [-30, 0], delay: 700, duration: 900, easing: 'easeOutExpo' });
      anime({ targets: '.hero-description', opacity: [0, 1], translateY: [20, 0], delay: 1000, duration: 900, easing: 'easeOutExpo' });
      anime({ targets: '.hero-buttons .btn', opacity: [0, 1], scale: [0.85, 1], delay: anime.stagger(120, {start: 1300}), duration: 700, easing: 'easeOutBack' });
      anime({ targets: '.hero-social .social-icon', opacity: [0, 1], scale: [0, 1], rotate: [90, 0], delay: anime.stagger(80, {start: 1600}), duration: 600, easing: 'easeOutBack' });
      anime({ targets: '#profileImage', opacity: [0, 1], scale: [0.85, 1], delay: 800, duration: 1200, easing: 'easeOutElastic(1, .8)' });
      anime({ targets: '.floating-badge', opacity: [0, 1], scale: [0, 1], delay: anime.stagger(200, {start: 1200}), duration: 700, easing: 'easeOutBack' });
    }

    function initObservers() {
      var skillItems = document.querySelectorAll('.skill-item');
      if (skillItems.length) {
        var skillObs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var item = entry.target;
              var bar = item.querySelector('.skill-progress');
              var pctEl = item.querySelector('.skill-percent');
              var pct = parseInt(item.getAttribute('data-percent') || 0, 10);
              if (bar) {
                if (typeof anime !== 'undefined') {
                  anime({ targets: bar, width: ['0%', pct + '%'], duration: 1800, easing: 'easeOutExpo', delay: 200 });
                  anime({ targets: { v: 0 }, v: pct, duration: 1800, easing: 'easeOutExpo', delay: 200, update: function(a) { if (pctEl) pctEl.textContent = Math.floor(a.animatables[0].target.v) + '%'; } });
                } else {
                  bar.style.width = pct + '%';
                  if (pctEl) pctEl.textContent = pct + '%';
                }
              }
              skillObs.unobserve(item);
            }
          });
        }, { threshold: 0.3 });
        skillItems.forEach(function(i) { skillObs.observe(i); });
      }

      var stats = document.querySelectorAll('.stat-number');
      if (stats.length) {
        var statObs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var count = parseInt(el.getAttribute('data-count') || 0, 10);
              if (typeof anime !== 'undefined') {
                anime({ targets: { v: 0 }, v: count, duration: 1800, easing: 'easeOutExpo', update: function(a) { el.textContent = Math.floor(a.animatables[0].target.v); } });
              } else {
                el.textContent = count;
              }
              statObs.unobserve(el);
            }
          });
        }, { threshold: 0.4 });
        stats.forEach(function(s) { statObs.observe(s); });
      }
    }

    function init() {
      var savedLang = localStorage.getItem('portfolio-lang');
      var savedTheme = localStorage.getItem('portfolio-theme');
      if (savedLang) setLanguage(savedLang);
      if (savedTheme) setTheme(savedTheme);

      var langBtn = document.getElementById('langToggle');
      if (langBtn) {
        langBtn.onclick = function() {
          var nl = AppState.currentLang === 'en' ? 'ar' : 'en';
          setLanguage(nl);
          localStorage.setItem('portfolio-lang', nl);
        };
      }

      var themeBtn = document.getElementById('themeToggle');
      if (themeBtn) {
        themeBtn.onclick = function() {
          var nt = AppState.currentTheme === 'dark' ? 'light' : 'dark';
          setTheme(nt);
          localStorage.setItem('portfolio-theme', nt);
        };
      }

      var menuBtn = document.getElementById('menuToggle');
      if (menuBtn) menuBtn.onclick = toggleMobileMenu;

      var contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.onsubmit = function(e) {
          e.preventDefault();
          var msg = AppState.currentLang === 'ar' ? 'تم إرسال الرسالة بنجاح!' : 'Message sent successfully!';
          alert(msg);
          contactForm.reset();
        };
      }

      initNavigation();
      generateParticles();
      initAnimations();
      initObservers();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  </script>`;

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
${head(p, 'moderncv')}
<body class="body-main" data-template="moderncv" data-theme="dark" data-lang="en" data-dir="ltr">
  <!-- Loading Screen -->
  <div class="loader-screen" id="loader">
    <div class="loader-content">
      <div class="loader-code-text">
        <div class="code-line" data-line="1">const portfolio = {</div>
        <div class="code-line" data-line="2">  loading: true,</div>
        <div class="code-line" data-line="3">  status: 'initializing...'</div>
        <div class="code-line" data-line="4">};</div>
      </div>
      <div class="loader-spinner-wrapper">
        <div class="loader-spinner"></div>
      </div>
      <div class="loader-progress-wrapper">
        <div class="loader-progress-bar"></div>
      </div>
      <div class="loader-percentage" id="loaderPercent">0%</div>
    </div>
  </div>

  <!-- Navigation Header -->
  <header class="main-header" id="header">
    <nav class="nav-container">
      <div class="nav-brand">
        <div class="brand-logo">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">Dev</span>
          <span class="logo-bracket">/&gt;</span>
        </div>
      </div>
      <div class="nav-menu" id="navMenu">
        <a href="#home" class="nav-link active" data-section="home"><i class="fas fa-home"></i><span class="nav-text" data-text-en="Home" data-text-ar="الرئيسية">Home</span></a>
        <a href="#about" class="nav-link" data-section="about"><i class="fas fa-user"></i><span class="nav-text" data-text-en="About" data-text-ar="عني">About</span></a>
        <a href="#skills" class="nav-link" data-section="skills"><i class="fas fa-code"></i><span class="nav-text" data-text-en="Skills" data-text-ar="المهارات">Skills</span></a>
        <a href="#experience" class="nav-link" data-section="experience"><i class="fas fa-briefcase"></i><span class="nav-text" data-text-en="Experience" data-text-ar="الخبرة">Experience</span></a>
        <a href="#projects" class="nav-link" data-section="projects"><i class="fas fa-rocket"></i><span class="nav-text" data-text-en="Projects" data-text-ar="المشاريع">Projects</span></a>
        <a href="#contact" class="nav-link" data-section="contact"><i class="fas fa-envelope"></i><span class="nav-text" data-text-en="Contact" data-text-ar="التواصل">Contact</span></a>
      </div>
      <div class="nav-controls">
        <button class="lang-toggle" id="langToggle" title="Toggle Language"><i class="fas fa-language"></i><span class="lang-text">AR</span></button>
        <button class="theme-toggle" id="themeToggle" title="Toggle Theme"><i class="fas fa-moon"></i></button>
        <button class="menu-toggle" id="menuToggle" title="Toggle Menu"><span></span><span></span><span></span></button>
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Hero Section -->
    <section id="home" class="hero-section">
      <div class="hero-background">
        <div class="code-grid-bg"></div>
        <div class="floating-particles" id="particles"></div>
      </div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-greeting">
            <span class="greeting-text" data-text-en="Hello, I'm" data-text-ar="مرحباً، أنا">Hello, I'm</span>
            <span class="greeting-cursor">|</span>
          </div>
          <h1 class="hero-name" id="heroName">
            <span class="name-prefix">const</span>
            <span class="name-operator">=</span>
            <span class="name-value" id="heroNameVal">${name}</span>
            <span class="name-suffix">;</span>
          </h1>
          <div class="hero-title">
            <span class="title-prefix">//</span>
            <span class="title-text" data-text-en="${title}" data-text-ar="${title}">${title}</span>
          </div>
          <p class="hero-description" data-text-en="${desc}" data-text-ar="${desc}">
            ${desc}
          </p>
          <div class="hero-buttons">
            <a href="#contact" class="btn btn-primary"><span data-text-en="Get In Touch" data-text-ar="تواصل معي">Get In Touch</span><i class="fas fa-arrow-right"></i></a>
            <a href="#projects" class="btn btn-secondary"><span data-text-en="View Projects" data-text-ar="عرض المشاريع">View Projects</span><i class="fas fa-code"></i></a>
          </div>
          <div class="hero-social">
            ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="social-icon" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
            ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" class="social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener" class="social-icon" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
            ${wShowInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank" rel="noopener" class="social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
            ${p.email ? `<a href="mailto:${email}" class="social-icon" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
          </div>
        </div>
        <div class="hero-image-wrapper">
          <div class="hero-image-container">
            <div class="profile-image-glow"></div>
            <div class="profile-image-frame">
              <div class="profile-image" id="profileImage">
                ${avatarHtml}
              </div>
            </div>
            <div class="floating-badge badge-1"><i class="fab fa-react"></i><div class="badge-content"><span class="badge-title">React</span><span class="badge-libs">Redux, Router, Hooks</span></div></div>
            <div class="floating-badge badge-2"><i class="fab fa-node-js"></i><div class="badge-content"><span class="badge-title">Node.js</span><span class="badge-libs">Express, Socket.io, MongoDB</span></div></div>
            <div class="floating-badge badge-3"><i class="fab fa-js"></i><div class="badge-content"><span class="badge-title">JavaScript</span><span class="badge-libs">ES6+, TypeScript, jQuery</span></div></div>
          </div>
        </div>
      </div>
      <div class="scroll-indicator"><div class="scroll-mouse"><div class="scroll-wheel"></div></div><span class="scroll-text" data-text-en="Scroll Down" data-text-ar="انتقل للأسفل">Scroll Down</span></div>
    </section>

    <!-- About Section -->
    <section id="about" class="section about-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">01</span>
          <h2 class="section-title"><span class="title-bracket">&lt;</span><span class="title-text" data-text-en="About Me" data-text-ar="عني">About Me</span><span class="title-bracket">/&gt;</span></h2>
          <div class="section-line"></div>
        </div>
        <div class="about-content">
          <div class="about-text-wrapper">
            <div class="about-intro">
              <p class="about-text" data-text-en="${aboutText}" data-text-ar="${aboutText}">
                ${aboutText}
              </p>
            </div>
            <div class="about-stats">
              <div class="stat-item"><div class="stat-number" data-count="${projCount}">0</div><div class="stat-label" data-text-en="Projects" data-text-ar="مشروع">Projects</div></div>
              <div class="stat-item"><div class="stat-number" data-count="${expCount}">0</div><div class="stat-label" data-text-en="Years Experience" data-text-ar="سنوات خبرة">Years Experience</div></div>
              <div class="stat-item"><div class="stat-number" data-count="30">0</div><div class="stat-label" data-text-en="Happy Clients" data-text-ar="عميل سعيد">Happy Clients</div></div>
            </div>
          </div>
          <div class="about-image-wrapper">
            <div class="about-image-container">
              <div class="code-block">
                <div class="code-line"><span class="code-keyword">const</span> <span class="code-variable">developer</span> <span class="code-operator">=</span> <span class="code-brace">{</span></div>
                <div class="code-line indent"><span class="code-property">name</span><span class="code-operator">:</span> <span class="code-string">'${name}'</span><span class="code-comma">,</span></div>
                <div class="code-line indent"><span class="code-property">skills</span><span class="code-operator">:</span> <span class="code-bracket">[</span><span class="code-string">${codeSkills}</span><span class="code-bracket">]</span><span class="code-comma">,</span></div>
                <div class="code-line indent"><span class="code-property">passion</span><span class="code-operator">:</span> <span class="code-string">'Coding'</span></div>
                <div class="code-line"><span class="code-brace">}</span><span class="code-semicolon">;</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section skills-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2 class="section-title"><span class="title-bracket">&lt;</span><span class="title-text" data-text-en="Skills" data-text-ar="المهارات">Skills</span><span class="title-bracket">/&gt;</span></h2>
          <div class="section-line"></div>
        </div>
        <div class="skills-grid">
          <div class="skill-category">
            <h3 class="category-title" data-text-en="Frontend" data-text-ar="الواجهة الأمامية">Frontend</h3>
            <div class="skill-items">${renderSkillCategory(feDefaults)}</div>
          </div>
          <div class="skill-category">
            <h3 class="category-title" data-text-en="Backend" data-text-ar="الخلفية">Backend</h3>
            <div class="skill-items">${renderSkillCategory(beDefaults)}</div>
          </div>
          <div class="skill-category">
            <h3 class="category-title" data-text-en="Tools & Others" data-text-ar="الأدوات وغيرها">Tools & Others</h3>
            <div class="skill-items">${renderSkillCategory(toolDefaults)}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="section experience-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">03</span>
          <h2 class="section-title"><span class="title-bracket">&lt;</span><span class="title-text" data-text-en="Experience" data-text-ar="الخبرة">Experience</span><span class="title-bracket">/&gt;</span></h2>
          <div class="section-line"></div>
        </div>
        <div class="timeline">${expHtml}</div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section projects-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">04</span>
          <h2 class="section-title"><span class="title-bracket">&lt;</span><span class="title-text" data-text-en="Projects" data-text-ar="المشاريع">Projects</span><span class="title-bracket">/&gt;</span></h2>
          <div class="section-line"></div>
        </div>
        <div class="projects-grid">${projHtml}</div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section contact-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-number">05</span>
          <h2 class="section-title"><span class="title-bracket">&lt;</span><span class="title-text" data-text-en="Contact" data-text-ar="التواصل">Contact</span><span class="title-bracket">/&gt;</span></h2>
          <div class="section-line"></div>
        </div>
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-envelope"></i></div>
              <div class="contact-details">
                <h4 class="contact-label" data-text-en="Email" data-text-ar="البريد الإلكتروني">Email</h4>
                <a href="mailto:${email}" class="contact-value">${email}</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-phone"></i></div>
              <div class="contact-details">
                <h4 class="contact-label" data-text-en="Phone" data-text-ar="الهاتف">Phone</h4>
                <a href="tel:${phone}" class="contact-value">${phone}</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
              <div class="contact-details">
                <h4 class="contact-label" data-text-en="Location" data-text-ar="الموقع">Location</h4>
                <span class="contact-value" data-text-en="${location}" data-text-ar="${location}">${location}</span>
              </div>
            </div>
          </div>
          <form class="contact-form" id="contactForm">
            <div class="form-group"><input type="text" class="form-input" placeholder="Name" data-placeholder-en="Name" data-placeholder-ar="الاسم" required></div>
            <div class="form-group"><input type="email" class="form-input" placeholder="Email" data-placeholder-en="Email" data-placeholder-ar="البريد الإلكتروني" required></div>
            <div class="form-group"><input type="text" class="form-input" placeholder="Subject" data-placeholder-en="Subject" data-placeholder-ar="الموضوع" required></div>
            <div class="form-group"><textarea class="form-input form-textarea" rows="5" placeholder="Message" data-placeholder-en="Message" data-placeholder-ar="الرسالة" required></textarea></div>
            <button type="submit" class="btn btn-primary btn-submit"><span data-text-en="Send Message" data-text-ar="إرسال الرسالة">Send Message</span><i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-text-wrapper">
          <p class="footer-text">
            <span class="footer-copyright">© ${new Date().getFullYear()} ${name} Portfolio</span>
            <span class="footer-divider">•</span>
            <span class="footer-built">Built with passion and code</span>
          </p>
          <p class="footer-author">
            <span class="footer-by-text" data-text-en="by" data-text-ar="بواسطة">by</span>
            <a href="${esc(p.linkedin || '#')}" target="_blank" rel="noopener noreferrer" class="footer-author-link">
              <i class="fas fa-code"></i>
              <span>${name}</span>
            </a>
          </p>
        </div>
        <div class="footer-social">
          ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="footer-social-link"><i class="fab fa-linkedin-in"></i></a>` : ''}
          ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
          ${p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
        </div>
      </div>
    </div>
  </footer>

  ${moderncvScript}
</body>
</html>`;
}
function page(p, url) {
  const qTpl = url ? (url.searchParams.get('template') || url.searchParams.get('t')) : null;
  const tpl = String(qTpl || p.template || 'midnight').toLowerCase();
  if (tpl === 'moderncv') {
    return pageModerncv(p);
  }
  const reqTab = url ? (url.searchParams.get('tab') || url.searchParams.get('page')) : null;
  const dpTab = ['about', 'portfolio', 'resume', 'contact'].includes(String(reqTab).toLowerCase()) ? String(reqTab).toLowerCase() : 'about';
  const skills = (p.skills || []).map((s) => `<span class="badge">${esc(s)}</span>`).join('');
  const bodyAttr = ` class="portfolio-view" data-template="${tpl}"`;
  const hero = tpl === 'afterglow'
    ? `<header class="hero wrap"><div class="ag-split"><div>
       <p class="mono ag-kicker">— GOLDEN HOUR, SHIPPED —</p>
       <h1>${esc(p.name)}</h1><div class="ag-sunbar"></div>
       <p class="sub">${esc(p.title)} — ${esc(p.tagline || '')}</p>
       <div class="hero-cta" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Say hello</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GitHub</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}">LinkedIn</a>` : ''}${wShowInsta(p) ? `<a class="btn btn-ghost" href="${esc(p.instagram)}">Instagram</a>` : ''}</div></div>
       ${p.avatarUrl ? `<div class="ag-sunring"><img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}"></div>` : '<div class="ag-sunring ag-sunring-empty"></div>'}
       </div></header>`
    : tpl === 'ultraviolet'
    ? `<section class="wrap" style="padding:140px 0 20px"><div class="uv-grid">
       <aside class="uv-rail">${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}">` : `<div class="uv-orb">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</div>`}
       <h1>${esc(p.name)}</h1><p class="mono uv-status">◉ signal: strong</p>
       <div class="uv-links">${p.email ? `<a href="mailto:${esc(p.email)}">email →</a>` : ''}${p.github ? `<a href="${esc(p.github)}">github →</a>` : ''}${p.linkedin ? `<a href="${esc(p.linkedin)}">linkedin →</a>` : ''}${wShowInsta(p) ? `<a href="${esc(p.instagram)}">instagram →</a>` : ''}</div></aside>
       <div><p class="mono" style="font-size:13px;color:#e0aaff">◈ ${esc(p.title)}</p>
       <p style="margin-top:10px;font-size:19px">${esc(p.tagline || '')}</p>
       <div style="margin-top:26px;height:2px;background:linear-gradient(90deg,transparent,#b5179e,#4cc9f0,transparent)"></div></div>
       </div></section>`
    : tpl === 'tidepool'
    ? `<section class="wrap" style="padding:140px 0 20px"><div class="card"><p class="mono" style="color:#80ffdb">○ depth: portfolio trench · pressure: nominal</p>
       <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:8px">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:112px;height:112px;border-radius:50%;object-fit:cover;border:2px solid #80ffdb;box-shadow:0 0 32px rgba(46,196,182,.7);flex-shrink:0">` : ''}
       <div style="flex:1;min-width:240px"><h1 style="font-size:clamp(38px,6vw,64px)">${esc(p.name)}</h1>
       <p class="mono">${esc(p.title)} — ${esc(p.location || 'remote reef')}</p></div></div>
       <p style="margin-top:10px">${esc(p.tagline || '')}</p><p style="margin-top:12px">${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}">Send a bubble</a>` : ''} ${p.github ? `<a class="btn btn-ghost btn-sm" href="${esc(p.github)}">GitHub</a>` : ''} ${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${esc(p.linkedin)}">LinkedIn</a>` : ''} ${wShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${esc(p.instagram)}">Instagram</a>` : ''}</p></div></section>`
    : tpl === 'aurora'
    ? `<header class="hero wrap"><div style="text-align:center;padding:50px 0 10px">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block">` : ''}
       <p class="mono" style="letter-spacing:3px;font-size:12px;opacity:.8">PORTFOLIO</p>
       <h1 style="font-size:clamp(44px,7vw,84px)">${esc(p.name)}</h1>
       <p class="sub" style="margin:12px auto;max-width:560px">${esc(p.title)} — ${esc(p.tagline || '')}</p>
       <div class="hero-cta" style="justify-content:center;display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Get in touch</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GitHub</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}">LinkedIn</a>` : ''}${wShowInsta(p) ? `<a class="btn btn-ghost" href="${esc(p.instagram)}">Instagram</a>` : ''}</div></div></header>`
    : tpl === 'editorial'
    ? `<section class="wrap" style="padding:140px 0 20px;max-width:760px">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;margin-bottom:12px">` : ''}
       <p class="mono" style="font-size:13px">The portfolio of</p>
       <h1 style="font-size:clamp(44px,7vw,76px)">${esc(p.name)}</h1>
       <h2 style="font-size:22px;font-style:italic">${esc(p.title)}</h2>
       <p style="font-size:18px;margin-top:10px">${esc(p.tagline || '')}</p><p style="margin-top:12px">${p.email ? `<a href="mailto:${esc(p.email)}" style="font-weight:800">${esc(p.email)}</a>` : ''}${p.github ? ` · <a href="${esc(p.github)}" style="font-weight:800">GitHub</a>` : ''}${p.linkedin ? ` · <a href="${esc(p.linkedin)}" style="font-weight:800">LinkedIn</a>` : ''}${wShowInsta(p) ? ` · <a href="${esc(p.instagram)}" style="font-weight:800">Instagram</a>` : ''}</p></section>`
    : tpl === 'brutalist'
    ? `<section class="wrap" style="padding:140px 0 20px">
       <span class="badge">● OPEN FOR WORK</span>
       <div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin-top:12px">
       <div style="flex:1;min-width:260px;">
       <h1 style="font-size:clamp(46px,8vw,96px);text-transform:uppercase">${esc(p.name)}</h1>
       <h2 style="font-size:clamp(20px,3vw,30px);background:#000;color:#fef08a;display:inline-block;padding:6px 14px;margin-top:10px">${esc(p.title)}</h2>
       <p class="sub" style="margin-top:12px;font-weight:600">${esc(p.tagline || '')}</p>
       <div style="margin-top:12px">${(p.skills || []).map((s) => `<a href="/skills/${encodeURIComponent(String(s).toLowerCase())}" style="text-decoration:none"><span class="badge">★ ${esc(s)}</span></a>`).join(' ')}</div>
       <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">HIRE ME</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GITHUB</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}">LINKEDIN</a>` : ''}${wShowInsta(p) ? `<a class="btn btn-ghost" href="${esc(p.instagram)}">INSTAGRAM</a>` : ''}</div>
       </div>
       ${p.avatarUrl ? `<div class="brut-portrait"><img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}"></div>` : ''}
       </div></section>`
    : tpl === 'motion'
    ? `<div id="bar" aria-hidden="true"></div><div class="blob" aria-hidden="true"></div><div class="pv" aria-hidden="true"><i></i></div>
       <nav class="motion-nav pad"><a class="logo" href="/">${esc(p.name)}</a>
       <nav><a class="hide" href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav></nav>
       <main id="top">
       <div class="hero pad"><h1 class="lx-title" aria-label="${esc(p.name || p.title || 'Portfolio')}">
         <span class="w"><span style="--i:0">${esc((p.name || p.title || 'Portfolio').split(' ').slice(0, Math.max(1, Math.ceil((p.name || p.title || 'Portfolio').split(' ').length / 2))).join(' '))}</span></span>
         ${(p.name || p.title || 'Portfolio').split(' ').slice(Math.max(1, Math.ceil((p.name || p.title || 'Portfolio').split(' ').length / 2))).length ? `<span class="w"><span style="--i:1">${esc((p.name || p.title || 'Portfolio').split(' ').slice(Math.max(1, Math.ceil((p.name || p.title || 'Portfolio').split(' ').length / 2))).join(' '))}</span></span>` : ''}</h1>
         <div class="hero-meta"><p class="rv" style="--d:700ms">${esc(p.title ? `${p.title}${p.tagline ? ' — ' + p.tagline : ''}` : (p.tagline || ''))}</p>
         <div class="scroll rv" style="--d:900ms"><i></i>Scroll</div></div></div>
       <section class="pad" id="work"><p class="eyebrow rv">Selected work</p>
         <ul class="work-rows">${projectsFor(p, tpl) || '<li class="rv">No projects yet.</li>'}</ul></section>
       ${resumeTeaser(p)}
       <section class="pad" id="about"><p class="eyebrow rv">About</p>
         <p class="lead rv">${esc(p.tagline || p.title || '')}</p>
         ${(p.skills || []).length ? `<div class="skills rv">${(p.skills || []).map((s) => `<span class="skill">${esc(s)}</span>`).join('')}</div>` : ''}</section>
       <section class="pad contact" id="contact"><p class="eyebrow rv">Say hello</p>
          <a class="big rv" href="mailto:${esc(p.email || '')}">${esc(p.name || 'Get in touch')}</a>
          <div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap">
            ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i> Email</a>` : ''}
            ${p.github ? `<a class="btn btn-ghost btn-sm" href="${esc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
            ${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${esc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
            ${wShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${esc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
          </div></section>
       </main>
       <footer class="pad"><span>© ${new Date().getFullYear()} ${esc(p.name)}</span><span>Built with portfoolio.me</span></footer>`
    : tpl === 'darkpro'
    ? `<main class="dp-shell">
       <aside class="dp-sidebar">
         <div class="dp-info"><figure class="dp-avatar">${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}">` : `<span>${esc((p.name || '?').trim().charAt(0).toUpperCase())}</span>`}</figure>
         <div class="dp-ident"><h1 class="dp-name">${esc(p.name)}</h1><p class="dp-title">${esc(p.title)}</p></div></div>
         <div class="dp-sep"></div>
         <ul class="dp-contacts">
           ${p.email ? `<li><i class="fa-regular fa-envelope"></i><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>` : ''}
           ${p.phone ? `<li><i class="fa-solid fa-phone"></i><a href="tel:${esc(p.phone)}">${esc(p.phone)}</a></li>` : ''}
           ${p.location ? `<li><i class="fa-solid fa-location-dot"></i><span>${esc(p.location)}</span></li>` : ''}
           ${p.github ? `<li><i class="fa-brands fa-github"></i><a href="${esc(p.github)}">GitHub</a></li>` : ''}
           ${p.linkedin ? `<li><i class="fa-brands fa-linkedin"></i><a href="${esc(p.linkedin)}">LinkedIn</a></li>` : ''}</ul>
         <div class="dp-sep"></div>
         <ul class="dp-social">
           ${p.github ? `<li><a href="${esc(p.github)}"><i class="fa-brands fa-github"></i></a></li>` : ''}
           ${p.linkedin ? `<li><a href="${esc(p.linkedin)}"><i class="fa-brands fa-linkedin"></i></a></li>` : ''}
           ${wShowInsta(p) ? `<li><a href="${esc(p.instagram)}"><i class="fa-brands fa-instagram"></i></a></li>` : ''}
           ${p.email ? `<li><a href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i></a></li>` : ''}</ul>
       </aside>
       <div class="dp-main">
         <nav class="dp-nav"><ul><li><button class="dp-nav-link ${dpTab === 'about' ? 'active' : ''}" data-dp-page="about">About</button></li>
           <li><button class="dp-nav-link ${dpTab === 'portfolio' ? 'active' : ''}" data-dp-page="portfolio">Portfolio</button></li>
           <li><button class="dp-nav-link ${dpTab === 'resume' ? 'active' : ''}" data-dp-page="resume">Resume</button></li>
           <li><button class="dp-nav-link ${dpTab === 'contact' ? 'active' : ''}" data-dp-page="contact">Contact</button></li></ul></nav>
         <article class="dp-page ${dpTab === 'about' ? 'active' : ''}" data-dp-content="about"><h2 class="dp-h2">About me</h2>
           <p class="dp-text">${esc(p.tagline || p.title || '')}</p>
           ${(p.skills || []).length ? `<h3 class="dp-h3">My Skills</h3><ul class="dp-skills">${(p.skills || []).map((s) => `<li><span class="skill-name">${esc(s)}</span></li>`).join('')}</ul>` : ''}</article>
         <article class="dp-page ${dpTab === 'portfolio' ? 'active' : ''}" data-dp-content="portfolio"><h2 class="dp-h2">Portfolio</h2>
           <ul class="dp-projects">${projectsFor(p, tpl) || '<li class="dp-text">No projects yet.</li>'}</ul></article>
         <article class="dp-page ${dpTab === 'resume' ? 'active' : ''}" data-dp-content="resume">
           ${resumeTeaser(p)}
         </article>
         <article class="dp-page ${dpTab === 'contact' ? 'active' : ''}" data-dp-content="contact"><h2 class="dp-h2">Contact</h2>
           <div class="dp-contact-links">
             ${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">SEND MESSAGE</a>` : ''}
             ${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
             ${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
             ${wShowInsta(p) ? `<a class="btn btn-ghost" href="${esc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
           </div></article>
       </div></main>`
    : tpl === 'fullpage'
    ? `<div class="fp-nav"><a class="fp-logo" href="/"><img class="brand-logo" src="/favicon.png" alt="portfoolio.me" width="30" height="30">${esc(p.name)}</a>
       <ul class="fp-links"><li><a href="#fp-about">ABOUT</a></li><li><a href="#fp-work">PORTFOLIO</a></li><li><a href="#fp-contact">CONTACT</a></li></ul></div>
       <div class="fp-fullpage">
       <section class="fp-section fp-hero" id="fp-about"><h1 class="fp-h1">${esc((p.name || '').toUpperCase())}</h1>
         <p class="fp-typed">${esc(p.title || '')}</p><a class="fp-scroll" href="#fp-work"><i class="fa-solid fa-chevron-down"></i></a></section>
       <section class="fp-section" id="fp-work"><h2 class="fp-h2">PROJECTS</h2>
         <div class="fp-slider">${projectsFor(p, tpl) || '<p class="fp-text">No projects yet.</p>'}</div></section>
       ${resumeTeaser(p)}
       <section class="fp-section" id="fp-about2"><h2 class="fp-h2">ABOUT ME</h2>
         <p class="fp-text">${esc(p.tagline || p.title || '')}</p>
         ${(p.skills || []).length ? `<div class="fp-skills">${(p.skills || []).map((s) => `<span class="fp-skill">${esc(s)}</span>`).join('')}</div>` : ''}</section>
       <section class="fp-section" id="fp-contact"><h2 class="fp-h2">CONTACT ME</h2>
         <p class="fp-text">${esc(p.tagline || 'Let us build something together.')}</p>
         <div class="fp-contact-links">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">SEND MESSAGE</a>` : ''}
           ${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
           ${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}</div></section>
       </div>`
    : tpl === 'minimal'
    ? `<section class="wrap" style="padding:140px 0 30px"><div class="card">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:96px;height:96px;border-radius:16px;object-fit:cover;margin-bottom:10px">` : ''}
       <h1 style="font-size:clamp(36px,5vw,56px)">${esc(p.name)}</h1>
       <h2 style="font-size:20px">${esc(p.title)}</h2><p style="margin:10px 0">${esc(p.tagline || '')}</p>
       <div class="badges" style="justify-content:flex-start">${skills}</div>
       <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}">Email me</a>` : ''}${p.github ? `<a class="btn btn-ghost btn-sm" href="${esc(p.github)}">GitHub</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${esc(p.linkedin)}">LinkedIn</a>` : ''}${wShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${esc(p.instagram)}">Instagram</a>` : ''}</div></div></section>`
    : tpl === 'terminal'
    ? `<section class="wrap" style="padding:140px 0 30px"><div class="card"><p class="mono">$ whoami</p>
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:96px;height:96px;border-radius:12px;object-fit:cover;margin:10px 0">` : ''}
       <h1>${esc(p.name)} <span>@${esc(p.username)}</span></h1><p class="mono">${esc(p.title)}</p><p>${esc(p.tagline || '')}</p></div>
       <div class="card" style="margin-top:14px"><p class="mono">$ ls --skills</p><div style="margin-top:8px">${skills}</div></div></section>`
    : `<header class="hero wrap"><div class="hero-grid"><div>
       ${p.available === false ? '' : '<div class="pill"><span class="dot"></span> Open to work</div>'}
       <h1>Hi, I'm <span class="grad">${esc(p.name)}</span><br>${esc(p.title)}</h1>
       <p class="sub">${esc(p.tagline || '')}</p>
       <div class="hero-cta">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Email me</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GitHub</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}">LinkedIn</a>` : ''}${wShowInsta(p) ? `<a class="btn btn-ghost" href="${esc(p.instagram)}">Instagram</a>` : ''}</div>
       <div class="hero-meta">${p.location ? `<span>${esc(p.location)}</span>` : ''} ${p.email ? `<span>${esc(p.email)}</span>` : ''} ${p.phone ? `<span>${esc(p.phone)}</span>` : ''}</div></div>
       <div class="visual"><div class="avatar-card"><div class="avatar-inner">
         ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:132px;height:132px;border-radius:50%;object-fit:cover">` : `<div style="width:120px;height:120px;border-radius:50%;margin:0 auto;display:grid;place-items:center;font-size:52px;color:#fff;background:linear-gradient(135deg,#6c6cf5,#22d3ee)">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</div>`}
         <h3>${esc(p.name)}</h3><p class="mono">@${esc(p.username)} • portfoolio.me</p><div class="badges">${skills}</div>
       </div></div></div></div></header>`;
  const gridCls = (tpl === 'minimal' || tpl === 'terminal' || tpl === 'brutalist') ? 'dir-grid' : (tpl === 'tidepool' ? 'proj-grid tp-zig' : 'proj-grid');
  // These three templates render their own full page layout (no standard sections)
  if (tpl === 'motion') {
    const motionScript = `<script>
    (function(){
      var bar=document.getElementById('bar');
      function onScroll(){
        var max=document.documentElement.scrollHeight-document.documentElement.clientHeight;
        if(max>0&&bar)bar.style.transform='scaleX('+(window.scrollY/max)+')';
      }
      window.addEventListener('scroll',onScroll,{passive:true});
      onScroll();
      var obs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}
        });
      },{rootMargin:'0px 0px -8% 0px'});
      document.querySelectorAll('.rv').forEach(function(el){obs.observe(el);});
      if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
        var blob=document.querySelector('.blob');
        var pv=document.querySelector('.pv');
        var pi=pv?pv.firstElementChild:null;
        var tx=window.innerWidth/2,ty=window.innerHeight/3;
        var bx=tx,by=ty,px=tx,py=ty,raf=0;
        function loop(){
          bx+=(tx-bx)*0.06;by+=(ty-by)*0.06;
          if(blob)blob.style.transform='translate3d('+(bx-blob.offsetWidth/2)+'px,'+(by-blob.offsetHeight/2)+'px,0)';
          if(pv){
            px+=(tx-px)*0.12;py+=(ty-py)*0.12;
            pv.style.transform='translate3d('+(px+24)+'px,'+(py-90)+'px,0)';
          }
          raf=(Math.abs(tx-bx)+Math.abs(ty-by)>0.5)?requestAnimationFrame(loop):0;
        }
        raf=requestAnimationFrame(loop);
        window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
        document.querySelectorAll('.row').forEach(function(a){
          a.addEventListener('pointerenter',function(){if(pi&&a.dataset.g)pi.style.background=a.dataset.g;if(pv)pv.classList.add('on');});
          a.addEventListener('pointerleave',function(){if(pv)pv.classList.remove('on');});
        });
      }
    })();
    </script>`;
    return `<!DOCTYPE html><html lang="en">${head(p, tpl)}<body${bodyAttr}>${hero}${motionScript}</body></html>`;
  }
  if (tpl === 'darkpro' || tpl === 'fullpage') {
    const dpScript = tpl === 'darkpro' ? `<script>
    function switchDpTab(k){
      document.querySelectorAll('[data-dp-page]').forEach(function(x){x.classList.toggle('active',x.dataset.dpPage===k)});
      document.querySelectorAll('[data-dp-content]').forEach(function(pg){pg.classList.toggle('active',pg.dataset.dpContent===k)});
    }
    document.querySelectorAll('[data-dp-page]').forEach(function(b){
      b.onclick=function(e){if(e)e.preventDefault();try{history.replaceState(null,'','#'+b.dataset.dpPage)}catch(err){}switchDpTab(b.dataset.dpPage);window.scrollTo(0,0)};
    });
    function syncHash(){
      var h=(location.hash||'').replace('#','').toLowerCase();
      if(['about','portfolio','resume','contact'].indexOf(h)!==-1){switchDpTab(h);}
    }
    window.addEventListener('hashchange',syncHash);
    syncHash();
    </script>` : '';
    return `<!DOCTYPE html><html lang="en">${head(p, tpl)}<body${bodyAttr}>${hero}${foot(p)}${dpScript}</body></html>`;
  }
  return `<!DOCTYPE html><html lang="en">${head(p, tpl)}<body${bodyAttr}><div class="bg-fx"></div>${nav(p)}${hero}
  ${skillsSection(p)}
  <section class="wrap" style="padding-top:10px"><span class="eyebrow">● Projects</span>
  <h2 class="title">Work that <span class="grad">speaks</span></h2>
  <div class="${gridCls}" style="margin-top:22px">${projectsFor(p, tpl) || '<p>No projects yet.</p>'}</div></section>
  ${resumeTeaser(p)}
  <section class="wrap"><div class="card" style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
  <div><h3>Like this portfolio?</h3><p>Claim yours free at <b>portfoolio.me</b>.</p></div>
  <a class="btn btn-primary" href="${ORIGIN}/">Create mine</a></div></section>${foot(p)}</body></html>`;
}

function resumeTheme(p) {
  const t = String((p.resume && p.resume.theme) || 'ats').toLowerCase();
  return ['ats', 'modern', 'midnight', 'terminal'].includes(t) ? t : 'ats';
}
function resumeBullets(desc) {
  const lines = String(desc || '').split('\n').map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return '';
  if (lines.length === 1) return `<p class="rs-p">${esc(lines[0])}</p>`;
  return `<ul class="rs-ul">${lines.map((l) => `<li>${esc(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>`;
}
function resumeBody(p) {
  // server mirror of frontend/resume.js docBody (worker has no shared imports)
  const summary = String((p.resume && p.resume.summary) || p.tagline || '').trim();
  const exps = Array.isArray(p.experience) ? p.experience : [];
  const edus = Array.isArray(p.education) ? p.education : [];
  const skills = (p.skills || []).filter(Boolean);
  const projs = (p.projects || []).slice(0, 6);
  const sec = (t) => `<h2 class="rs-sec-h">${t}</h2>`;
  const contact = [p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : '',
    p.phone ? `<span>${esc(p.phone)}</span>` : '', p.location ? `<span>${esc(p.location)}</span>` : '',
    p.github ? `<a href="${esc(p.github)}">GitHub</a>` : '', p.linkedin ? `<a href="${esc(p.linkedin)}">LinkedIn</a>` : '']
    .filter(Boolean).join(' &nbsp;•&nbsp; ');
  const dl = (e) => [e.start, e.current ? 'Present' : e.end].filter(Boolean).map(esc).join(' – ');
  return `
  <div class="rs-head"><h1 class="rs-name">${esc(p.name || p.username)}</h1>
  <p class="rs-title">${esc(p.title || '')}</p><p class="rs-contact">${contact}</p></div>
  ${summary ? `${sec('Summary')}<p class="rs-p">${esc(summary)}</p>` : ''}
  ${skills.length ? `${sec('Skills')}<p class="rs-p">${skills.map(esc).join(' • ')}</p>` : ''}
  ${sec('Experience')}
  ${exps.length ? exps.map((e) => `<div class="rs-item"><div class="rs-item-top"><b>${esc(e.role || 'Role')} — ${esc(e.company || '')}</b><span class="rs-dates">${dl(e)}</span></div>${resumeBullets(e.desc)}</div>`).join('')
    : '<p class="rs-p rs-dim">No roles listed yet.</p>'}
  ${sec('Education')}
  ${edus.length ? edus.map((e) => `<div class="rs-item"><div class="rs-item-top"><b>${esc(e.school || '')}</b><span class="rs-dates">${esc([e.start, e.end].filter(Boolean).join(' – '))}</span></div><p class="rs-p">${esc([e.degree, e.field].filter(Boolean).join(', '))}</p></div>`).join('')
    : '<p class="rs-p rs-dim">No education listed yet.</p>'}
  ${projs.length ? `${sec('Projects')}${projs.map((pr) => `<div class="rs-item"><div class="rs-item-top"><b>${esc(pr.title)}</b>${pr.url && pr.url !== '#' ? `<a href="${esc(pr.url)}">Code →</a>` : ''}</div><p class="rs-p">${esc(pr.desc || '')}</p></div>`).join('')}` : ''}`;
}
function pageResume(p) {
  const theme = resumeTheme(p);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Resume — ${esc(p.name)} | portfoolio.me</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/resume.css"></head>
<body class="portfolio-view rs-page rs-${theme}"><div class="bg-fx"></div>${nav(p)}
<div style="max-width:860px;margin:0 auto;padding:120px 16px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
<a href="/" style="font-weight:800">← ${esc(p.name)}</a>
<span style="margin-left:auto;display:flex;gap:10px"><a href="/" style="font-weight:700">Portfolio</a><a href="javascript:window.print()" style="font-weight:800">⬇ Print / PDF</a></span></div>
<main class="rs-doc rs-${theme}">${resumeBody(p)}
<p class="rs-foot">Resume auto-built from <b>portfoolio.me</b> profile · ${esc(p.username)}.portfoolio.me</p></main>
<div style="text-align:center;padding:0 0 40px"><a href="javascript:window.print()" style="font-weight:800">⬇ Print / Save as PDF</a></div>${foot(p)}</body></html>`;
}
function resumeTeaser(p) {
  const exps = Array.isArray(p.experience) ? p.experience : [];
  return `<section class="wrap" style="padding-top:10px"><span class="eyebrow">● Resume</span>
  <h2 class="title">Hire-ready <span class="grad">resume</span></h2>
  <div class="card"><div style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
  <div><h3>📄 ${esc(p.name)} — ${esc(p.title)}</h3>
  <p style="color:var(--muted);font-size:13.5px;margin-top:4px">${exps.length ? `${exps.length} role${exps.length > 1 ? 's' : ''} · ` : ''}${(p.skills || []).length} skills · ${(p.projects || []).length} projects · theme: ${resumeTheme(p).toUpperCase()}</p></div>
  <div style="display:flex;gap:8px"><a class="btn btn-primary btn-sm" href="/resume">View resume →</a></div></div></div></section>`;
}

function techsOf(pr) {
  const out = [], seen = new Set();
  (pr.technologies || []).concat(pr.tags || []).forEach((t) => {
    const k = String(t || '').trim().toLowerCase();
    if (k && k !== 'fork' && !seen.has(k)) { seen.add(k); out.push(String(t).trim()); }
  });
  return out;
}
function pageSkill(p, skillName) {
  const key = String(skillName).toLowerCase();
  const list = (p.projects || []).filter((pr) => techsOf(pr).some((t) => t.toLowerCase() === key));
  const gh = list.filter((pr) => pr.repo).length, live = list.filter((pr) => pr.demoUrl).length;
  const tpl = (p.template || 'midnight').toLowerCase();
  const bodyAttr = ` class="portfolio-view" data-template="${tpl}"`;
  const rows = list.map((pr) => `
    <article class="proj"><div class="proj-body"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
    <div class="proj-actions"><a class="primary" href="${esc(pr.url)}">View project</a></div></div></article>`).join('');
  return `<!DOCTYPE html><html lang="en">${head(p)}<body${bodyAttr}><div class="bg-fx"></div>${nav(p)}
  <section class="wrap" style="padding:140px 0 20px"><span class="eyebrow">● Skill evidence</span>
  <h1 style="font-size:clamp(38px,6vw,60px)">${esc(skillName)}</h1>
  <p class="lead">Used in <b style="color:#fff">${list.length} project${list.length === 1 ? '' : 's'}</b> · GitHub repositories: <b style="color:#fff">${gh}</b> · Live: <b style="color:#fff">${live}</b></p>
  <div class="proj-grid" style="margin-top:22px">${rows || '<p>No evidence yet — connect a project to show this skill in use.</p>'}</div>
  <p style="margin-top:16px"><a class="btn btn-ghost btn-sm" href="/">← ${esc(p.name)}</a></p></section>${foot(p)}</body></html>`;
}

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const host = url.hostname.toLowerCase();
    const parts = host.split('.');
    let sub = null;
    if (host.endsWith('portfoolio.me') && parts.length === 3) sub = parts[0].toLowerCase();
    if (!sub || RESERVED.has(sub) || !/^[a-z0-9][a-z0-9-]{2,29}$/.test(sub)) {
      return Response.redirect(`${ORIGIN}/`, 302);
    }

    // Proxy shared static assets (CSS, icons, seeds) directly from ORIGIN so they serve same-origin on every subdomain
    if (
      url.pathname === '/style.css' ||
      url.pathname === '/templates.css' ||
      url.pathname === '/resume.css' ||
      url.pathname === '/ui.css' ||
      url.pathname === '/favicon.svg' ||
      url.pathname === '/favicon.png' ||
      url.pathname.startsWith('/profiles/') ||
      url.pathname.startsWith('/frontend/')
    ) {
      const assetRes = await fetch(`${ORIGIN}${url.pathname}`);
      if (assetRes.ok) {
        const ct = assetRes.headers.get('content-type') || siteMime(url.pathname);
        return new Response(assetRes.body, {
          status: assetRes.status,
          headers: {
            'content-type': ct,
            'cache-control': 'public, max-age=86400',
            'access-control-allow-origin': '*',
            ...SEC_HEADERS,
          },
        });
      }
    }

    const p = await getProfile(sub);
    if (!p) return Response.redirect(`${ORIGIN}/?claim=${encodeURIComponent(sub)}`, 302);
    // resume page works on every site type (built from profile data)
    if (url.pathname === '/resume' || url.pathname === '/resume/' || url.searchParams.get('resume')) {
      const html = pageResume(p);
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'public, max-age=300', ...SEC_HEADERS },
      });
    }
    // custom upload wins over builder templates — serve raw files incl. assets
    if (p.site_type === 'upload') {
      const hit = await serveUploadedSite(sub, url.pathname);
      if (hit) return hit;
      // storage empty / deleted → fall through to builder theme instead of 404
    }
    // visual track renders the gallery, not the code portfolio
    if (p.track === 'visual') {
      const html = pageGallery(p, url.searchParams.get('w'));
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'public, max-age=300', ...SEC_HEADERS },
      });
    }
    const m = url.pathname.match(/^\/skills\/([^/]+)\/?$/);
    const html = m ? pageSkill(p, decodeURIComponent(m[1])) : page(p, url);
    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'public, max-age=300', ...SEC_HEADERS },
    });
  },
};
