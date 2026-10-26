// portfoolio.me wildcard worker — *.portfoolio.me → approved Supabase profiles (free, no Netlify Pro)
// Deploy: npx wrangler deploy (see wrangler.toml). Route: *.portfoolio.me/*
// Data: Supabase REST (public read of approved rows only — RLS enforced) + seed JSON fallback.
const SUPABASE_URL = 'https://oorcivmymcokbjiawkig.supabase.co';
const SUPABASE_KEY = 'sb_publishable_u3HhZlncnGcg_UBT4G3N-Q_3uE5Qh63'; // publishable by design; RLS is the lock
const ORIGIN = 'https://portfoolio.me';
const RESERVED = new Set(['www', 'app', 'api', 'admin', 'mail', 'blog', 'portfoolio', 'netlify']);

const SEC_HEADERS = {
  'Content-Security-Policy': "default-src 'self' https://portfoolio.me https://*.portfoolio.me; script-src 'self' 'unsafe-inline' https://portfoolio.me https://*.portfoolio.me https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://portfoolio.me https://*.portfoolio.me https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://unicons.iconscout.com https://unpkg.com https://cdn.jsdelivr.net; font-src 'self' https://portfoolio.me https://*.portfoolio.me https://fonts.gstatic.com https://cdnjs.cloudflare.com https://unicons.iconscout.com https://unpkg.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://portfoolio.me https://*.portfoolio.me https://oorcivmymcokbjiawkig.supabase.co https://*.supabase.co https://res.cloudinary.com https://api.cloudinary.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
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
      if (row.resume && typeof row.resume === 'object' && Array.isArray(row.resume.services) && (!row.services || !row.services.length)) {
        row.services = row.resume.services;
      }
      // Self-heal legacy rows: a visual-only template implies the visual track
      if (row.track !== 'visual' && ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom'].includes(String(row.template || '').toLowerCase())) row.track = 'visual';
      if (row.track !== 'visual') row.track = 'tech';

      // Check seed profile to backfill custom services or extra repos
      try {
        const sr = await fetch(`${ORIGIN}/profiles/${encodeURIComponent(sub)}.json`);
        if (sr.ok) {
          const seed = await sr.json();
          if (seed) {
            if ((!row.services || !row.services.length) && Array.isArray(seed.services) && seed.services.length) {
              row.services = seed.services;
              if (row.resume && typeof row.resume === 'object') row.resume.services = seed.services;
            }
            if ((!row.projects || !row.projects.length) && Array.isArray(seed.projects) && seed.projects.length) {
              row.projects = seed.projects;
            }
          }
        }
      } catch {}

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
        if (seed.resume && typeof seed.resume === 'object' && Array.isArray(seed.resume.services) && (!seed.services || !seed.services.length)) {
          seed.services = seed.resume.services;
        }
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
  const isMcv = tpl === 'moderncv';
  const mcvStyle = isMcv ? `
<style id="moderncv-contact-fix">
  body[data-template="moderncv"] form.contact-form,
  body[data-template="moderncv"] .contact-form,
  form.contact-form {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 1.5rem !important;
  }
  body[data-template="moderncv"] .contact-form .form-group {
    position: relative !important;
    width: 100% !important;
  }
  body[data-template="moderncv"] .contact-form .form-input,
  body[data-template="moderncv"] input.form-input,
  body[data-template="moderncv"] textarea.form-input {
    width: 100% !important;
    box-sizing: border-box !important;
    padding: 1rem 1.25rem !important;
    background: var(--bg-card, #131625) !important;
    border: 1px solid var(--border, rgba(255,255,255,0.08)) !important;
    border-radius: 12px !important;
    color: var(--text-primary, #ffffff) !important;
    font-family: var(--font-primary) !important;
    font-size: 1rem !important;
    line-height: 1.5 !important;
    transition: all var(--transition) !important;
    box-shadow: none !important;
  }
  body[data-template="moderncv"] .contact-form .form-input:focus,
  body[data-template="moderncv"] input.form-input:focus,
  body[data-template="moderncv"] textarea.form-input:focus {
    outline: none !important;
    border-color: var(--primary, #c084fc) !important;
    box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.25) !important;
    background: var(--bg-card, #131625) !important;
  }
  body[data-template="moderncv"] .contact-form input:-webkit-autofill,
  body[data-template="moderncv"] .contact-form textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #131625 inset !important;
    -webkit-text-fill-color: #ffffff !important;
  }
  body[data-template="moderncv"] .contact-status {
    padding: 1rem 1.25rem;
    border-radius: 12px;
    background: rgba(34, 197, 94, 0.12);
    border: 1px solid rgba(34, 197, 94, 0.35);
    color: #4ade80;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    line-height: 1.5;
  }
  body[data-template="moderncv"] .contact-status a {
    color: #fff;
    text-decoration: underline;
    font-weight: 600;
  }
</style>` : '';
  return `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — ${esc(p.title)} | portfoolio.me</title>
<meta name="description" content="${esc(p.tagline || p.title || '')}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Tajawal:wght@300;400;500;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&family=Turret+Road:wght@300;400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<link rel="stylesheet" href="/style.css?v=20261026a"><link rel="stylesheet" href="/templates.css?v=20261026a"><link rel="stylesheet" href="/resume.css?v=20261026a">
<script src="https://cdnjs.cloudflare.com/ajax/libs/mixitup/3.3.1/mixitup.min.js"></script>
<script src="https://unpkg.com/scrollreveal"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script></head>`;
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

  // --- REAL SKILLS DERIVATION (from user dashboard & projects) ---
  const skillMap = new Map();

  function addSkill(raw, bonusCount, isUserExplicit) {
    let name = String(raw || '').trim();
    if (!name || name.toLowerCase() === 'fork') return;
    const lower = name.toLowerCase();
    let canonical = name;
    let normKey = lower;
    if (lower === 'js') { normKey = 'javascript'; canonical = 'JavaScript'; }
    else if (lower === 'ts') { normKey = 'typescript'; canonical = 'TypeScript'; }
    else if (lower === 'react' || lower === 'reactjs') { normKey = 'react'; canonical = 'React'; }
    else if (lower === 'node' || lower === 'nodejs' || lower === 'node.js') { normKey = 'nodejs'; canonical = 'Node.js'; }
    else if (lower === 'next' || lower === 'nextjs' || lower === 'next.js') { normKey = 'nextjs'; canonical = 'Next.js'; }
    else if (lower === 'vue' || lower === 'vuejs' || lower === 'vue.js') { normKey = 'vuejs'; canonical = 'Vue.js'; }
    else if (lower === 'html' || lower === 'html5') { normKey = 'html'; canonical = 'HTML5'; }
    else if (lower === 'css' || lower === 'css3') { normKey = 'css'; canonical = 'CSS3'; }
    else if (lower === 'aws') { normKey = 'aws'; canonical = 'AWS'; }
    else if (lower === 'github' || lower === 'git') { normKey = 'git'; canonical = 'Git / GitHub'; }

    if (!skillMap.has(normKey)) {
      skillMap.set(normKey, { name: canonical, count: bonusCount, isExplicit: isUserExplicit });
    } else {
      const existing = skillMap.get(normKey);
      existing.count += bonusCount;
      if (isUserExplicit) existing.isExplicit = true;
    }
  }

  // 1. User Dashboard Skills (p.skills)
  (Array.isArray(p.skills) ? p.skills : []).forEach((s) => addSkill(s, 3, true));

  // 2. Project Technologies & Tags (p.projects)
  (Array.isArray(p.projects) ? p.projects : []).forEach((pr) => {
    const prTechs = Array.isArray(pr.technologies || pr.tags) ? (pr.technologies || pr.tags) : [];
    if (pr.repo && pr.repo.language) prTechs.push(pr.repo.language);
    prTechs.forEach((t) => addSkill(t, 1, false));
  });

  // 3. Resume Skills if present (p.resume.skills)
  if (p.resume && Array.isArray(p.resume.skills)) {
    p.resume.skills.forEach((s) => addSkill(s, 2, true));
  }

  const allSkillsList = Array.from(skillMap.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Categorize real skills
  const feKeywords = ['html', 'css', 'javascript', 'typescript', 'react', 'vuejs', 'angular', 'nextjs', 'svelte', 'tailwind', 'bootstrap', 'sass', 'redux', 'jquery'];
  const beKeywords = ['nodejs', 'express', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'go', 'golang', 'rust', 'c#', 'c++', '.net', 'php', 'laravel', 'ruby', 'rails', 'aws', 'gcp', 'azure', 'firebase', 'supabase', 'mongodb', 'postgres', 'mysql', 'sql', 'redis', 'graphql', 'api'];

  const feSkills = [];
  const beSkills = [];
  const toolSkills = [];

  allSkillsList.forEach((sk) => {
    const k = sk.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pct = Math.min(95, 80 + Math.min(15, sk.count * 4));
    const item = { name: sk.name, pct: pct, count: sk.count };

    if (feKeywords.some((w) => k.includes(w))) {
      feSkills.push(item);
    } else if (beKeywords.some((w) => k.includes(w))) {
      beSkills.push(item);
    } else {
      toolSkills.push(item);
    }
  });

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

  const categoryCards = [];
  if (feSkills.length) {
    categoryCards.push(`
      <div class="skill-category">
        <h3 class="category-title" data-text-en="Frontend" data-text-ar="الواجهة الأمامية">Frontend</h3>
        <div class="skill-items">${renderSkillCategory(feSkills)}</div>
      </div>`);
  }
  if (beSkills.length) {
    categoryCards.push(`
      <div class="skill-category">
        <h3 class="category-title" data-text-en="Backend & Cloud" data-text-ar="الخلفية والسحابة">Backend & Cloud</h3>
        <div class="skill-items">${renderSkillCategory(beSkills)}</div>
      </div>`);
  }
  if (toolSkills.length) {
    categoryCards.push(`
      <div class="skill-category">
        <h3 class="category-title" data-text-en="Tools & Others" data-text-ar="الأدوات وغيرها">Tools & Others</h3>
        <div class="skill-items">${renderSkillCategory(toolSkills)}</div>
      </div>`);
  }

  const skillsHtml = categoryCards.length
    ? `<div class="skills-grid">${categoryCards.join('')}</div>`
    : `<div class="skills-empty" style="text-align:center;padding:3rem 1.5rem;background:var(--bg-card);border:1px dashed var(--border);border-radius:16px;max-width:600px;margin:0 auto">
        <i class="fas fa-code" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:1rem;display:block"></i>
        <h3 style="font-size:1.2rem;color:var(--text-primary);margin-bottom:0.5rem;font-family:var(--font-code)" data-text-en="No skills added yet" data-text-ar="لا توجد مهارات مضافة بعد">No skills added yet</h3>
        <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.6" data-text-en="Add skills in your user dashboard or tag projects to display them here." data-text-ar="أضف مهاراتك من لوحة التحكم أو اربط المشاريع لعرضها هنا.">Add skills in your user dashboard or tag projects to display them here.</p>
      </div>`;

  function skillBadgeIcon(name) {
    const s = String(name || '').toLowerCase();
    if (s.includes('react')) return 'fab fa-react';
    if (s.includes('vue')) return 'fab fa-vuejs';
    if (s.includes('node')) return 'fab fa-node-js';
    if (s.includes('js') || s.includes('javascript')) return 'fab fa-js';
    if (s.includes('ts') || s.includes('typescript')) return 'fas fa-code';
    if (s.includes('python')) return 'fab fa-python';
    if (s.includes('html')) return 'fab fa-html5';
    if (s.includes('css')) return 'fab fa-css3-alt';
    if (s.includes('aws')) return 'fab fa-aws';
    if (s.includes('docker')) return 'fab fa-docker';
    if (s.includes('git')) return 'fab fa-git-alt';
    if (s.includes('figma')) return 'fab fa-figma';
    return 'fas fa-laptop-code';
  }

  const topSkills = allSkillsList.slice(0, 3);
  const floatingBadgesHtml = topSkills.map((sk, idx) => `
    <div class="floating-badge badge-${idx + 1}">
      <i class="${skillBadgeIcon(sk.name)}"></i>
      <div class="badge-content">
        <span class="badge-title">${esc(sk.name)}</span>
        <span class="badge-libs">${sk.count > 1 ? `${sk.count} projects` : 'Verified Skill'}</span>
      </div>
    </div>
  `).join('');

  const codeSkills = allSkillsList.length
    ? allSkillsList.slice(0, 4).map((s) => `'${esc(s.name)}'`).join(', ')
    : `'Coding'`;

  const rawExp = (Array.isArray(p.experience) && p.experience.length)
    ? p.experience
    : (p.resume && Array.isArray(p.resume.experience) && p.resume.experience.length)
      ? p.resume.experience
      : [];

  const expList = rawExp.map((e) => ({
    year: [e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || (e.year || 'Present'),
    isCurrent: Boolean(e.current || String(e.end || '').toLowerCase() === 'present'),
    title: e.role || e.title || 'Developer',
    company: e.company || '',
    desc: e.desc || '',
    achievements: Array.isArray(e.achievements)
      ? e.achievements.map((a) => String(a).trim()).filter(Boolean)
      : String(e.desc || '').split('\n').map((s) => s.trim().replace(/^[-•*]\s*/, '')).filter((s) => s.length > 5),
    tags: Array.isArray(e.tags) ? e.tags : (Array.isArray(e.technologies) ? e.technologies : [])
  }));

  const expHtml = expList.length
    ? `<div class="timeline">${expList.map((e) => `
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div class="timeline-year">${esc(e.year)}</div>
              ${e.isCurrent ? '<div class="timeline-badge">Current</div>' : ''}
            </div>
            <h3 class="timeline-title">${esc(e.title)}</h3>
            ${e.company ? `<div class="timeline-company"><i class="fas fa-building"></i> ${esc(e.company)}</div>` : ''}
            ${e.desc ? `<p class="timeline-description">${esc(e.desc)}</p>` : ''}
            ${e.achievements.length ? `
            <div class="timeline-achievements">
              ${e.achievements.map((a) => `<div class="achievement-item"><i class="fas fa-check-circle"></i><span>${esc(a)}</span></div>`).join('')}
            </div>` : ''}
            ${e.tags.length ? `
            <div class="timeline-tags">
              ${e.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
            </div>` : ''}
          </div>
        </div>`).join('')}</div>`
    : `<div class="timeline-empty" style="text-align:center;padding:3rem 1.5rem;background:var(--bg-card);border:1px dashed var(--border);border-radius:16px;max-width:600px;margin:0 auto">
        <i class="fas fa-briefcase" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:1rem;display:block"></i>
        <h3 style="font-size:1.2rem;color:var(--text-primary);margin-bottom:0.5rem;font-family:var(--font-code)" data-text-en="No experience listed yet" data-text-ar="لا توجد خبرات مدرجة بعد">No experience listed yet</h3>
        <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.6" data-text-en="Experience entries from resume will appear here once added." data-text-ar="ستظهر الخبرات من السيرة الذاتية هنا بمجرد إضافتها.">Experience entries from resume will appear here once added.</p>
      </div>`;

  let projList = [];
  if (Array.isArray(p.projects) && p.projects.length) {
    projList = p.projects.map((pr, i) => {
      const repoUrl = (pr.repo && pr.repo.fullName)
        ? `https://github.com/${pr.repo.fullName}`
        : ((pr.repo && pr.repo.url) || (pr.url && pr.url.includes('github') ? pr.url : '#'));
      const liveUrl = pr.demoUrl || pr.url || repoUrl;
      return {
        title: esc(pr.title || `Project ${i + 1}`),
        desc: esc(pr.desc || 'A web project showcasing development skills and clean architecture.'),
        tags: Array.isArray(pr.technologies || pr.tags) ? (pr.technologies || pr.tags).map((t) => esc(t)) : ['JavaScript'],
        url: liveUrl,
        repo: repoUrl,
        icon: pr.icon || (i % 3 === 0 ? 'fa-code' : i % 3 === 1 ? 'fa-laptop-code' : 'fa-rocket')
      };
    });
  } else {
    projList = [];
  }

  const projHtml = projList.length
    ? projList.map((pr) => `
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
    </div>`).join('')
    : `<div style="text-align:center;padding:3rem 1.5rem;background:var(--bg-card);border:1px dashed var(--border);border-radius:16px;max-width:600px;margin:0 auto;grid-column:1/-1">
        <i class="fas fa-rocket" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:1rem;display:block"></i>
        <h3 style="font-size:1.2rem;color:var(--text-primary);margin-bottom:0.5rem;font-family:var(--font-code)" data-text-en="No projects added yet" data-text-ar="لا توجد مشاريع مضافة بعد">No projects added yet</h3>
      </div>`;

  const projCount = (Array.isArray(p.projects) ? p.projects.length : 0);
  const expCount = rawExp.length;
  const skillsCount = allSkillsList.length;

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
              setTimeout(function() { loader.classList.add('hidden'); loader.style.display = 'none'; }, 400);
            }
            playHeroAnimations();
          }, 250);
        }
        if (loaderPercent) loaderPercent.textContent = Math.floor(progress) + '%';
      }, 50);
      setTimeout(function() {
        if (loader && !loader.classList.contains('hidden')) {
          loader.classList.add('hidden');
          loader.style.display = 'none';
          playHeroAnimations();
        }
      }, 1500);
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
          var nameInput = document.getElementById('contactName') || contactForm.querySelector('input[type="text"]');
          var emailInput = document.getElementById('contactEmail') || contactForm.querySelector('input[type="email"]');
          var subjInput = document.getElementById('contactSubject') || contactForm.querySelectorAll('input[type="text"]')[1];
          var msgInput = document.getElementById('contactMessage') || contactForm.querySelector('textarea');
          var statusEl = document.getElementById('contactStatus');
          var submitBtn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('button[type="submit"]');

          var senderName = nameInput ? nameInput.value.trim() : '';
          var senderEmail = emailInput ? emailInput.value.trim() : '';
          var subjectVal = subjInput ? subjInput.value.trim() : '';
          var messageVal = msgInput ? msgInput.value.trim() : '';

          var targetEmail = "${esc(p.email || '')}";
          var mailSubject = encodeURIComponent(subjectVal || ('Portfolio Message from ' + senderName));
          var mailBody = encodeURIComponent(
            messageVal + '\\n\\n---\\nFrom: ' + senderName + '\\nEmail: ' + senderEmail + '\\nSent via portfoolio.me'
          );
          var mailtoUrl = 'mailto:' + (targetEmail || 'contact@portfoolio.me') + '?subject=' + mailSubject + '&body=' + mailBody;

          if (statusEl) {
            statusEl.style.display = 'flex';
            var successText = AppState.currentLang === 'ar'
              ? 'جارٍ فتح تطبيق البريد لإرسال رسالتك... إذا لم يفتح تلقائياً، <a href="' + mailtoUrl + '">انقر هنا</a>'
              : 'Opening your email client to send your message... If it does not open, <a href="' + mailtoUrl + '">click here</a>.';
            statusEl.innerHTML = '<i class="fas fa-check-circle" style="color:#4ade80"></i> <span>' + successText + '</span>';
          }

          window.location.href = mailtoUrl;

          if (submitBtn) {
            var span = submitBtn.querySelector('span');
            var origText = span ? span.innerText : 'Send Message';
            if (span) span.innerText = (AppState.currentLang === 'ar' ? 'تم الإرسال!' : 'Message Ready!');
            setTimeout(function() {
              if (span) span.innerText = origText;
            }, 4000);
          }
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
            ${floatingBadgesHtml}
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
              <div class="stat-item"><div class="stat-number" data-count="${skillsCount}">0</div><div class="stat-label" data-text-en="Skills" data-text-ar="المهارات">Skills</div></div>
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
        ${skillsHtml}
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
        ${expHtml}
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
            <div class="form-group"><input type="text" name="name" id="contactName" class="form-input" placeholder="Name" data-placeholder-en="Name" data-placeholder-ar="الاسم" required></div>
            <div class="form-group"><input type="email" name="email" id="contactEmail" class="form-input" placeholder="Email" data-placeholder-en="Email" data-placeholder-ar="البريد الإلكتروني" required></div>
            <div class="form-group"><input type="text" name="subject" id="contactSubject" class="form-input" placeholder="Subject" data-placeholder-en="Subject" data-placeholder-ar="الموضوع" required></div>
            <div class="form-group"><textarea name="message" id="contactMessage" class="form-input form-textarea" rows="5" placeholder="Message" data-placeholder-en="Message" data-placeholder-ar="الرسالة" required></textarea></div>
            <div id="contactStatus" class="contact-status" style="display:none"></div>
            <button type="submit" class="btn btn-primary btn-submit" id="contactSubmitBtn"><span data-text-en="Send Message" data-text-ar="إرسال الرسالة">Send Message</span><i class="fas fa-paper-plane"></i></button>
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

function pageUltracode(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Full Stack Developer');
  const tagline = esc(p.tagline || 'I have high level experience in web design, development knowledge and producing quality work');
  const bio = esc(p.bio || p.desc || p.tagline || `I'm a dedicated web developer with extensive knowledge and years of experience, delivering high-impact solutions across modern web technologies, UI/UX architecture, and systems engineering.`);
  const email = esc(p.email || '');
  const phone = esc(p.phone || '');
  const location = esc(p.location || '');
  const logoLetter = (p.name || 'M').trim().charAt(0).toUpperCase();

  const avatarImg = (p.avatarUrl || p.avatar_url)
    ? esc(p.avatarUrl || p.avatar_url)
    : 'https://i.postimg.cc/W1YZxTpJ/about-img.jpg';

  // --- Real Qualifications (Education & Experience) ---
  const rawExp = (Array.isArray(p.experience) && p.experience.length)
    ? p.experience
    : (p.resume && Array.isArray(p.resume.experience) && p.resume.experience.length)
      ? p.resume.experience
      : [];

  const rawEdu = (Array.isArray(p.education) && p.education.length)
    ? p.education
    : (p.resume && Array.isArray(p.resume.education) && p.resume.education.length)
      ? p.resume.education
      : [];

  const expBoxSubtitle = rawExp.length > 0 ? `${rawExp.length}+ Roles` : 'No experience';

  let eduTimelineHtml = '';
  if (rawEdu.length > 0) {
    eduTimelineHtml = rawEdu.map(ed => `
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">${esc(ed.institution || ed.school || ed.college || 'University')}</h3>
        <p class="timeline-text">${esc(ed.degree || ed.field || ed.major || 'Degree / Diploma')}</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>${esc(ed.year || ed.period || ed.dates || 'Completed')}</span>
      </div>
    `).join('');
  } else {
    eduTimelineHtml = `
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">XYZ University (Sometown, NJ)</h3>
        <p class="timeline-text">BFA in Graphic Design</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>2011 - 2013</span>
      </div>
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">ABC University (Sometown, NJ)</h3>
        <p class="timeline-text">Diploma in Web Design</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>2013 - 2015</span>
      </div>
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">KLM University (Sometown, NJ)</h3>
        <p class="timeline-text">BS in Web Development</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>2015 - 2017</span>
      </div>
    `;
  }

  let expTimelineHtml = '';
  if (rawExp.length > 0) {
    expTimelineHtml = rawExp.map(ex => `
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">${esc(ex.company || ex.organization || 'Tech Company')}</h3>
        <p class="timeline-text">${esc(ex.role || ex.title || ex.position || 'Software Developer')}</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>${esc(ex.period || ex.dates || ex.duration || 'Past Experience')}</span>
      </div>
    `).join('');
  } else {
    expTimelineHtml = `
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">Copalopa Inc. (Sometown, NJ)</h3>
        <p class="timeline-text">Lead / Senior UX Designer</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>2018 - Present</span>
      </div>
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">Gabogle Inc. (Sometown, NJ)</h3>
        <p class="timeline-text">Web site / UX Designer</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>2015 - 2018</span>
      </div>
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h3 class="timeline-title">Copalopa Inc. (Sometown, NJ)</h3>
        <p class="timeline-text">Junior UX Designer</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>2013 - 2015</span>
      </div>
    `;
  }

  // --- Real Skills Derivation ---
  const skillMap = new Map();
  function addSkill(raw, bonusCount) {
    let s = String(raw || '').trim();
    if (!s || s.toLowerCase() === 'fork') return;
    const lower = s.toLowerCase();
    let canonical = s;
    let normKey = lower;
    if (lower === 'js') { normKey = 'javascript'; canonical = 'JavaScript'; }
    else if (lower === 'ts') { normKey = 'typescript'; canonical = 'TypeScript'; }
    else if (lower === 'react' || lower === 'reactjs') { normKey = 'react'; canonical = 'React'; }
    else if (lower === 'node' || lower === 'nodejs' || lower === 'node.js') { normKey = 'nodejs'; canonical = 'Node.js'; }
    else if (lower === 'next' || lower === 'nextjs' || lower === 'next.js') { normKey = 'nextjs'; canonical = 'Next.js'; }
    else if (lower === 'vue' || lower === 'vuejs' || lower === 'vue.js') { normKey = 'vuejs'; canonical = 'Vue.js'; }
    else if (lower === 'html' || lower === 'html5') { normKey = 'html'; canonical = 'HTML'; }
    else if (lower === 'css' || lower === 'css3') { normKey = 'css'; canonical = 'CSS'; }
    else if (lower === 'py' || lower === 'python') { normKey = 'python'; canonical = 'Python'; }

    const cur = skillMap.get(normKey);
    if (!cur) {
      skillMap.set(normKey, { name: canonical, count: bonusCount || 1 });
    } else {
      cur.count += (bonusCount || 1);
    }
  }

  const explicitSkills = Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? p.skills.split(',') : []);
  explicitSkills.forEach(s => addSkill(s, 3));

  if (Array.isArray(p.projects)) {
    p.projects.forEach(pr => {
      const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
      techs.forEach(t => addSkill(t, 2));
    });
  }

  if (p.resume && Array.isArray(p.resume.skills)) {
    p.resume.skills.forEach(s => addSkill(s, 2));
  }

  const allSkillsList = Array.from(skillMap.values()).sort((a, b) => b.count - a.count);

  const feKeywords = ['react', 'vue', 'angular', 'svelte', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'bootstrap', 'sass', 'next', 'frontend', 'ui', 'redux', 'web', 'dom'];
  const designKeywords = ['figma', 'sketch', 'photoshop', 'illustrator', 'ui/ux', 'design', 'canva', 'adobexd', 'wireframe', 'prototype'];
  const beKeywords = ['node', 'express', 'python', 'django', 'flask', 'php', 'sql', 'postgres', 'mysql', 'mongo', 'firebase', 'supabase', 'aws', 'docker', 'api', 'backend', 'java', 'golang', 'c++', 'c#', 'rust', 'graphql', 'redis'];

  const feSkills = [];
  const designSkills = [];
  const beSkills = [];

  allSkillsList.forEach(sk => {
    const k = sk.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pct = Math.min(95, 75 + Math.min(20, sk.count * 4));
    const item = { name: sk.name, pct };

    if (designKeywords.some(w => k.includes(w))) {
      designSkills.push(item);
    } else if (feKeywords.some(w => k.includes(w))) {
      feSkills.push(item);
    } else if (beKeywords.some(w => k.includes(w))) {
      beSkills.push(item);
    } else {
      if (feSkills.length <= beSkills.length) feSkills.push(item);
      else beSkills.push(item);
    }
  });

  if (feSkills.length === 0 && beSkills.length === 0 && designSkills.length === 0) {
    feSkills.push({ name: 'HTML & CSS', pct: 90 }, { name: 'JavaScript', pct: 85 }, { name: 'Responsive Design', pct: 90 });
    beSkills.push({ name: 'Web Services & APIs', pct: 80 }, { name: 'Git & Deployment', pct: 85 });
  }

  function renderSkillBars(list) {
    if (!list || !list.length) {
      return '<p style="color:var(--text-color);font-size:var(--small-font-size);padding:1rem 0">No skills listed in this category.</p>';
    }
    return list.map(s => `
      <div class="skills-data">
        <div class="skills-titles">
          <h3 class="skills-name">${esc(s.name)}</h3>
          <span class="skills-number">${s.pct}%</span>
        </div>
        <div class="skills-bar">
          <span class="skills-percentage" style="width: ${s.pct}%;"></span>
        </div>
      </div>
    `).join('');
  }

  // --- Real Projects Mapping ---
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const defaultImages = [
    'https://i.postimg.cc/43Th5VXJ/work-1.png',
    'https://i.postimg.cc/sXLjnC5p/work-2.png',
    'https://i.postimg.cc/QNB1jXYZ/work-3.png',
    'https://i.postimg.cc/s2DGqyG8/work-4.png',
    'https://i.postimg.cc/TYVyPhrF/work-5.png',
    'https://i.postimg.cc/wMdqKcbv/work-6.png'
  ];

  let worksHtml = '';
  if (projects.length > 0) {
    worksHtml = projects.map((pr, idx) => {
      const img = pr.image || pr.img || defaultImages[idx % defaultImages.length];
      const prTitle = esc(pr.title || `Project ${idx + 1}`);
      const prDesc = esc(pr.desc || 'A modern digital application crafted with attention to performance, UI/UX, and robust architecture.');
      const techs = (Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : [])).map(t => esc(t)).join(', ') || 'Modern Web';
      const prUrl = pr.url || pr.demoUrl || '#';
      const liveDomain = prUrl && prUrl !== '#' ? prUrl.replace(/^https?:\/\//, '').split('/')[0] : 'View live demo';
      
      const fullText = (prTitle + ' ' + prDesc + ' ' + techs).toLowerCase();
      let cat = 'web';
      if (/app|mobile|android|ios|flutter|react native/.test(fullText)) cat = 'app';
      else if (/design|ui|ux|figma|branding|logo/.test(fullText)) cat = 'design';

      return `
        <div class="work-card mix ${cat}">
          <img src="${img}" alt="${prTitle}" class="work-img">
          <h3 class="work-title">${prTitle}</h3>
          <span class="work-button" data-idx="${idx}">Demo <i class="uil uil-arrow-right work-button-icon"></i></span>

          <div class="portfolio-item-details">
            <h3 class="details-title">${prTitle}</h3>
            <p class="details-description">${prDesc}</p>
            <ul class="details-info">
              <li>Category - <span>${cat.toUpperCase()}</span></li>
              <li>Technologies - <span>${techs}</span></li>
              <li>Role - <span>${title}</span></li>
              <li>View - <span><a href="${esc(prUrl)}" target="_blank" rel="noopener">${liveDomain}</a></span></li>
            </ul>
          </div>
        </div>
      `;
    }).join('');
  } else {
    const sampleProjects = [
      { title: 'Web Design', cat: 'web', img: 'https://i.postimg.cc/43Th5VXJ/work-1.png', desc: 'Two smartphones displaying a sleek, dark-themed dashboard interface', detailTitle: 'The services we provide for design', tech: 'HTML, CSS', role: 'Frontend', domain: 'www.domain.com' },
      { title: 'App Design', cat: 'app', img: 'https://i.postimg.cc/sXLjnC5p/work-2.png', desc: 'A stylish burger restaurant mobile app interface displayed on two smartphones', detailTitle: 'Mobile App Landing Design & App Maintain', tech: 'HTML, CSS', role: 'Frontend', domain: 'www.domain.com' },
      { title: 'Brand Design', cat: 'design', img: 'https://i.postimg.cc/QNB1jXYZ/work-3.png', desc: 'Three smartphone screens displaying a beautifully designed travel booking application interface', detailTitle: 'Logo Design Creativity & Application', tech: 'HTML, CSS', role: 'Frontend', domain: 'www.domain.com' },
      { title: 'App Design', cat: 'app', img: 'https://i.postimg.cc/s2DGqyG8/work-4.png', desc: 'Modern workout website interface design featuring a bold and energetic visual layout', detailTitle: 'Mobile App Landing Design & Services', tech: 'HTML, CSS', role: 'Frontend', domain: 'www.domain.com' },
      { title: 'Brand Design', cat: 'web', img: 'https://i.postimg.cc/TYVyPhrF/work-5.png', desc: 'An app design that is clean, functional, and ideal for gamers looking to manage their digital assets and purchases', detailTitle: 'Design for Technology & Services', tech: 'HTML, CSS', role: 'Frontend', domain: 'www.domain.com' },
      { title: 'Web Design', cat: 'design', img: 'https://i.postimg.cc/wMdqKcbv/work-6.png', desc: 'An app design that is clean and modern, making food browsing and ordering easy', detailTitle: 'App for Technology & Services', tech: 'HTML, CSS', role: 'Frontend', domain: 'www.domain.com' }
    ];

    worksHtml = sampleProjects.map((sp, idx) => `
      <div class="work-card mix ${sp.cat}">
        <img src="${sp.img}" alt="${sp.title}" class="work-img">
        <h3 class="work-title">${sp.title}</h3>
        <span class="work-button" data-idx="${idx}">Demo <i class="uil uil-arrow-right work-button-icon"></i></span>

        <div class="portfolio-item-details">
          <h3 class="details-title">${sp.detailTitle}</h3>
          <p class="details-description">${sp.desc}</p>
          <ul class="details-info">
            <li>Created - <span>Featured Project</span></li>
            <li>Technologies - <span>${sp.tech}</span></li>
            <li>Role - <span>${sp.role}</span></li>
            <li>View - <span><a href="#">${sp.domain}</a></span></li>
          </ul>
        </div>
      </div>
    `).join('');
  }

  // Social Links
  const githubLink = p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="home-social-link" title="GitHub"><i class="uil uil-github-alt"></i></a>` : '';
  const linkedinLink = p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" class="home-social-link" title="LinkedIn"><i class="uil uil-linkedin-alt"></i></a>` : '';
  const instagramLink = wShowInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank" rel="noopener" class="home-social-link" title="Instagram"><i class="uil uil-instagram"></i></a>` : '';
  const twitterLink = p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener" class="home-social-link" title="Twitter"><i class="uil uil-twitter"></i></a>` : '';

  const footerGithub = p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-github-alt"></i></a>` : '';
  const footerLinkedin = p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-linkedin-alt"></i></a>` : '';
  const footerInstagram = wShowInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-instagram"></i></a>` : '';
  const footerTwitter = p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-twitter"></i></a>` : '';

  const ultracodeScript = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  // 1. Toggling Skill Tabs
  const tabs = document.querySelectorAll('.skills-header[data-target]');
  const tabContents = document.querySelectorAll('.skills-group[data-content]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.target);
      tabContents.forEach(tc => tc.classList.remove('skills-active'));
      if (target) target.classList.add('skills-active');
      tabs.forEach(t => t.classList.remove('skills-active'));
      tab.classList.add('skills-active');
    });
  });

  // 2. Work Filters & MixItUp
  const filterBtns = document.querySelectorAll('.work-filters .work-item');
  const workCards = document.querySelectorAll('.work-card');
  const workContainer = document.querySelector('.work-container');

  let mixer = null;
  if (typeof mixitup !== 'undefined' && workContainer) {
    try {
      mixer = mixitup(workContainer, {
        selectors: {
          target: '.work-card'
        },
        animation: {
          duration: 300
        }
      });
    } catch (err) {
      console.warn('MixItUp init warning:', err);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active-work'));
      this.classList.add('active-work');

      if (!mixer) {
        const filter = this.getAttribute('data-filter');
        workCards.forEach(card => {
          if (filter === 'all' || card.classList.contains(filter.replace('.', ''))) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  // 3. Portfolio Popup Modal
  const popup = document.getElementById('portfolioPopup');
  const popupClose = document.getElementById('portfolioPopupClose');
  const popupImg = document.getElementById('ppImg');
  const popupSubtitle = document.getElementById('ppSubtitle');
  const popupBody = document.getElementById('ppBody');

  document.querySelectorAll('.work-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.work-card');
      if (card && popup) {
        const img = card.querySelector('.work-img');
        const title = card.querySelector('.work-title');
        const details = card.querySelector('.portfolio-item-details');
        if (popupImg && img) popupImg.src = img.src;
        if (popupSubtitle && title) popupSubtitle.textContent = title.textContent;
        if (popupBody && details) popupBody.innerHTML = details.innerHTML;
        popup.classList.add('open');
      }
    });
  });

  if (popupClose && popup) {
    popupClose.addEventListener('click', () => popup.classList.remove('open'));
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.classList.remove('open');
    });
  }

  // 4. Services Modal Popups
  const modalViews = document.querySelectorAll('.services-modal');
  const modalBtns = document.querySelectorAll('.services-button');
  const modalCloses = document.querySelectorAll('.services-modal-close');
  modalBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if (modalViews[idx]) modalViews[idx].classList.add('active-modal');
    });
  });
  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      modalViews.forEach(v => v.classList.remove('active-modal'));
    });
  });
  modalViews.forEach(v => {
    v.addEventListener('click', (e) => {
      if (e.target === v) v.classList.remove('active-modal');
    });
  });

  // 5. Contact Form Floating Labels & Mailto Action
  const inputs = document.querySelectorAll('.input');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => input.parentNode.classList.add('focus'));
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') input.parentNode.classList.remove('focus');
    });
    if (input.value.trim() !== '') input.parentNode.classList.add('focus');
  });

  const contactForm = document.getElementById('ultracodeContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cName = (document.getElementById('ucName')?.value || '').trim();
      const cEmail = (document.getElementById('ucEmail')?.value || '').trim();
      const cPhone = (document.getElementById('ucPhone')?.value || '').trim();
      const cMsg = (document.getElementById('ucMessage')?.value || '').trim();

      const subject = encodeURIComponent('Portfolio Inquiry from ' + cName);
      const mailBody = encodeURIComponent('Hi ' + ${JSON.stringify(p.name || 'there')} + ',\\n\\nName: ' + cName + '\\nEmail: ' + cEmail + '\\nPhone: ' + cPhone + '\\n\\nMessage:\\n' + cMsg + '\\n\\n-- Sent via portfoolio.me');

      const mailto = 'mailto:' + ${JSON.stringify(p.email || 'hello@portfoolio.me')} + '?subject=' + subject + '&body=' + mailBody;
      window.location.href = mailto;

      const statusEl = document.getElementById('ucStatus');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = '✓ Thank you! Opening your email client to reach <b>' + ${JSON.stringify(p.email || 'developer')} + '</b>...';
      }
    });
  }

  // 7. Sidebar Navigation Toggle, Close & Share
  const navMenu = document.getElementById('sidebar');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.add('show-sidebar'));
  }
  if (navClose && navMenu) {
    navClose.addEventListener('click', () => navMenu.classList.remove('show-sidebar'));
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('show-sidebar');
    });
  });

  const btnShare = document.getElementById('btnShare');
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareData = {
        title: ${JSON.stringify((p.name || 'Developer') + ' — Portfolio')},
        text: ${JSON.stringify(p.tagline || 'Check out this portfolio on portfoolio.me')},
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Portfolio link copied to clipboard!');
        } catch (e) {
          prompt('Copy this portfolio link:', window.location.href);
        }
      }
    });
  }

  // 8. Scroll Section Active Link Highlighter
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 80;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  }, { passive: true });
});
</script>`;

  const userServices = (Array.isArray(p.services) && p.services.length)
    ? p.services
    : (p.resume && Array.isArray(p.resume.services) && p.resume.services.length)
    ? p.resume.services
    : null;

  const hasServices = Boolean(userServices && userServices.length);
  const servicesHtml = hasServices ? userServices.map(s => `
    <div class="services-content">
      <div>
        <i class="${esc(s.icon || 'uil uil-code-branch')} services-icon"></i>
        <h3 class="services-title">${esc(s.title || 'Service')}</h3>
      </div>
      <p class="services-modal-description" style="margin-top:12px;font-size:0.92rem;color:var(--text-color);line-height:1.6">${esc(s.desc || '')}</p>
    </div>
  `).join('') : '';

  const servicesSection = hasServices ? `
    <section class="services section" id="services">
      <h2 class="section-title" data-heading="Services">What I Offer</h2>
      <div class="services-container container grid">
        ${servicesHtml}
      </div>
    </section>
  ` : '';

  const servicesNavLink = hasServices ? `<li class="nav-item"><a href="#services" class="nav-link">Services</a></li>` : '';
  const servicesFooterLink = hasServices ? `<li><a href="#services">Services</a></li>` : '';

  return `<!DOCTYPE html>
<html lang="en">
${head(p, 'ultracode')}
<body class="body-main" data-template="ultracode" data-theme="dark">
  <div class="nav-toggle" id="nav-toggle">
    <i class="uil uil-bars"></i>
  </div>

  <aside class="sidebar" id="sidebar">
    <nav class="nav">
      <div class="nav-logo">
        <a href="#" class="nav-logo-text">${logoLetter}</a>
      </div>

      <div class="nav-menu">
        <div class="menu">
          <ul class="nav-list">
            <li class="nav-item"><a href="#home" class="nav-link active-link">Home</a></li>
            <li class="nav-item"><a href="#about" class="nav-link">About</a></li>
            <li class="nav-item"><a href="#qualification" class="nav-link">Qualifications</a></li>
            <li class="nav-item"><a href="#skills" class="nav-link">Skills</a></li>
            <li class="nav-item"><a href="#work" class="nav-link">Work</a></li>
            ${servicesNavLink}
            <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
          </ul>
        </div>
      </div>

      <div class="btn-share" id="btnShare" title="Share Portfolio">
        <i class="uil uil-share-alt social-share"></i>
      </div>

      <div class="nav-close" id="nav-close">
        <i class="uil uil-times"></i>
      </div>
    </nav>
  </aside>

  <main class="main">
    <section class="home" id="home">
      <div class="home-container container grid">
        <div class="home-social">
          <span class="home-social-follow">Follow Me</span>
          <div class="home-social-links">
            ${githubLink}
            ${linkedinLink}
            ${instagramLink}
            ${twitterLink}
          </div>
        </div>

        <img src="${avatarImg}" alt="${name}" class="home-img">

        <div class="home-data">
          <h1 class="home-title">Hi, I'm ${name}</h1>
          <h3 class="home-subtitle">${title}</h3>
          <p class="home-description">${tagline}</p>
          <a href="#about" class="button">
            <i class="uil uil-user button-icon"></i>
            More About me!
          </a>
        </div>

        <div class="my-info">
          ${email ? `
          <div class="info-item">
            <i class="uil uil-envelope-edit info-icon"></i>
            <div>
              <h3 class="info-title">Email</h3>
              <span class="info-subtitle">${email}</span>
            </div>
          </div>` : ''}

          ${phone ? `
          <div class="info-item">
            <i class="uil uil-whatsapp info-icon"></i>
            <div>
              <h3 class="info-title">Phone</h3>
              <span class="info-subtitle">${phone}</span>
            </div>
          </div>` : ''}

          ${location ? `
          <div class="info-item">
            <i class="uil uil-map-marker info-icon"></i>
            <div>
              <h3 class="info-title">Location</h3>
              <span class="info-subtitle">${location}</span>
            </div>
          </div>` : ''}
        </div>
      </div>
    </section>

    <section class="about section" id="about">
      <h2 class="section-title" data-heading="My Intro">About me</h2>

      <div class="about-container container grid">
        <img src="${avatarImg}" alt="${name}" class="about-img">

        <div class="about-data">
          <h3 class="about-heading">Hi, I'm ${name}${location ? `, based in ${location}` : ''}</h3>
          <p class="about-description">${bio}</p>

          <div class="about-info">
            <div class="about-box">
              <i class="uil uil-award about-icon"></i>
              <h3 class="about-title">Experience</h3>
              <span class="about-subtitle">${expBoxSubtitle}</span>
            </div>

            <div class="about-box">
              <i class="uil uil-suitcase-alt about-icon"></i>
              <h3 class="about-title">Completed</h3>
              <span class="about-subtitle">${projects.length} + Projects</span>
            </div>

            <div class="about-box">
              <i class="uil uil-headphones-alt about-icon"></i>
              <h3 class="about-title">Support</h3>
              <span class="about-subtitle">Online 24/7</span>
            </div>
          </div>

          <a href="#contact" class="button"><i class="uil uil-navigator button-icon"></i>Contact me</a>
        </div>
      </div>
    </section>

    <section class="qualification section" id="qualification">
      <h2 class="section-title" data-heading="My Journey">Qualifications</h2>

      <div class="qualification-container container grid">
        <div class="education">
          <h3 class="qualification-title"><i class="uil uil-graduation-cap"></i>Education</h3>
          <div class="timeline">
            ${eduTimelineHtml}
          </div>
        </div>

        <div class="experience">
          <h3 class="qualification-title"><i class="uil uil-suitcase"></i>Experience</h3>
          <div class="timeline">
            ${expTimelineHtml}
          </div>
        </div>
      </div>
    </section>

    <section class="skills section" id="skills">
      <h2 class="section-title" data-heading="My Abilities">My Experience</h2>

      <div class="skills-container container grid">
        <div class="skills-tabs">
          <div class="skills-header skills-active" data-target="#frontend">
            <i class="uil uil-brackets-curly skills-icon"></i>
            <div>
              <h1 class="skills-title">Frontend Developer</h1>
              <span class="skills-subtitle">${feSkills.length} Verified Skills</span>
            </div>
            <i class="uil uil-angle-down skills-arrow"></i>
          </div>

          <div class="skills-header" data-target="#design">
            <i class="uil uil-swatchbook skills-icon"></i>
            <div>
              <h1 class="skills-title">UI / UX & Tools</h1>
              <span class="skills-subtitle">${designSkills.length} Verified Skills</span>
            </div>
            <i class="uil uil-angle-down skills-arrow"></i>
          </div>

          <div class="skills-header" data-target="#backend">
            <i class="uil uil-server-network skills-icon"></i>
            <div>
              <h1 class="skills-title">Backend & Cloud</h1>
              <span class="skills-subtitle">${beSkills.length} Verified Skills</span>
            </div>
            <i class="uil uil-angle-down skills-arrow"></i>
          </div>
        </div>

        <div class="skills-content">
          <div class="skills-group skills-active" data-content id="frontend">
            <div class="skills-list grid">
              ${renderSkillBars(feSkills)}
            </div>
          </div>

          <div class="skills-group" data-content id="design">
            <div class="skills-list grid">
              ${renderSkillBars(designSkills)}
            </div>
          </div>

          <div class="skills-group" data-content id="backend">
            <div class="skills-list grid">
              ${renderSkillBars(beSkills)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="work section" id="work">
      <h2 class="section-title" data-heading="My Portfolio">Recent Works</h2>

      <div class="work-filters">
        <span class="work-item active-work" data-filter="all">All</span>
        <span class="work-item" data-filter=".web">Web</span>
        <span class="work-item" data-filter=".app">App</span>
        <span class="work-item" data-filter=".design">Design</span>
      </div>

      <div class="work-container container grid">
        ${worksHtml}
      </div>
    </section>

    <div class="portfolio-popup" id="portfolioPopup">
      <div class="portfolio-popup-inner">
        <div class="portfolio-popup-content grid">
          <span class="portfolio-popup-close" id="portfolioPopupClose"><i class="uil uil-times"></i></span>
          <div class="pp-thumbnail">
            <img src="" alt="Project Preview" class="portfolio-popup-img" id="ppImg">
          </div>

          <div class="portfolio-popup-info">
            <div class="portfolio-popup-subtitle">Featured - <span id="ppSubtitle">Project</span></div>
            <div class="portfolio-popup-body" id="ppBody"></div>
          </div>
        </div>
      </div>
    </div>

    ${servicesSection}

    <section class="contact section" id="contact">
      <h2 class="section-title" data-heading="Get in Touch">Contact me</h2>

      <div class="contact-container container grid">
        <div class="contact-content">
          <div class="contact-info">
            ${email ? `
            <div class="contact-card">
              <i class="uil uil-envelope-edit contact-card-icon"></i>
              <h3 class="contact-card-title">Email</h3>
              <span class="contact-card-data">${email}</span>
              <a href="mailto:${email}" class="contact-button">Write me <i class="uil uil-arrow-right contact-button-icon"></i></a>
            </div>` : ''}

            ${phone ? `
            <div class="contact-card">
              <i class="uil uil-whatsapp contact-card-icon"></i>
              <h3 class="contact-card-title">Phone / WhatsApp</h3>
              <span class="contact-card-data">${phone}</span>
              <a href="tel:${phone}" class="contact-button">Call / Chat <i class="uil uil-arrow-right contact-button-icon"></i></a>
            </div>` : ''}

            ${p.github ? `
            <div class="contact-card">
              <i class="uil uil-github-alt contact-card-icon"></i>
              <h3 class="contact-card-title">GitHub</h3>
              <span class="contact-card-data">${esc(p.github.replace(/^https?:\/\//, ''))}</span>
              <a href="${esc(p.github)}" target="_blank" rel="noopener" class="contact-button">View Profile <i class="uil uil-arrow-right contact-button-icon"></i></a>
            </div>` : ''}
          </div>
        </div>

        <div class="contact-content">
          <form class="contact-form" id="ultracodeContactForm">
            <div class="input-container">
              <input type="text" class="input" id="ucName" required>
              <label for="ucName">Your Name</label>
              <span>Your Name</span>
            </div>

            <div class="input-container">
              <input type="email" class="input" id="ucEmail" required>
              <label for="ucEmail">Your Email</label>
              <span>Your Email</span>
            </div>

            <div class="input-container">
              <input type="tel" class="input" id="ucPhone">
              <label for="ucPhone">Phone (optional)</label>
              <span>Phone (optional)</span>
            </div>

            <div class="input-container textarea">
              <textarea name="message" id="ucMessage" class="input" required></textarea>
              <label for="ucMessage">Your Message</label>
              <span>Your Message</span>
            </div>

            <div id="ucStatus" style="display:none;padding:.75rem 1rem;background:rgba(222,10,77,.15);border:1px solid var(--skin-color);color:var(--title-color);border-radius:.25rem;font-size:var(--small-font-size);margin-bottom:1rem;"></div>

            <button type="submit" class="button"><i class="uil uil-navigator button-icon"></i>Send Message</button>
          </form>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-bg">
        <div class="footer-container container grid">
          <div>
            <h1 class="footer-title">${name}</h1>
            <span class="footer-subtitle">${title}</span>
          </div>

          <ul class="footer-links">
            ${servicesFooterLink}
            <li><a href="#work">Work</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div class="footer-socials">
            ${footerGithub}
            ${footerLinkedin}
            ${footerInstagram}
            ${footerTwitter}
          </div>
        </div>

        <p class="footer-copy">&#169; ${new Date().getFullYear()} <a href="https://portfoolio.me" target="_blank">${name}</a> • Built via portfoolio.me</p>
      </div>
    </footer>
  </main>

  ${ultracodeScript}
</body>
</html>`;
}

function devblueSkillIconWorker(name) {
  const s = String(name || '').toLowerCase();
  if (/html/.test(s)) return 'bx bxl-html5';
  if (/css|style|tailwind|sass|bootstrap/.test(s)) return 'bx bxl-css3';
  if (/js|javascript/.test(s)) return 'bx bxl-javascript';
  if (/ts|typescript/.test(s)) return 'bx bxl-typescript';
  if (/react/.test(s)) return 'bx bxl-react';
  if (/vue/.test(s)) return 'bx bxl-vuejs';
  if (/node/.test(s)) return 'bx bxl-nodejs';
  if (/python/.test(s)) return 'bx bxl-python';
  if (/design|ui|ux|figma/.test(s)) return 'bx bxs-paint';
  if (/git|github/.test(s)) return 'bx bxl-git';
  if (/docker|container|aws|cloud/.test(s)) return 'bx bxl-aws';
  if (/sql|db|mongo|postgres|database/.test(s)) return 'bx bx-data';
  return 'bx bx-code-alt';
}

function pageDevblue(p) {
  const name = esc(p.name || 'Marlon');
  const title = esc(p.title || 'Web Designer');
  const bio = esc(p.bio || p.desc || p.tagline || `As a passionate web designer, I thrive on creating visually appealing and user-friendly websites. My journey in web design began with a fascination for how design can enhance user experience.`);
  const email = esc(p.email || '');

  const avatarImg = (p.avatarUrl || p.avatar_url)
    ? esc(p.avatarUrl || p.avatar_url)
    : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%234070F4"/><text x="50%" y="54%" font-size="140" font-family="system-ui,sans-serif" font-weight="bold" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">${encodeURIComponent((p.name || 'U').charAt(0).toUpperCase())}</text></svg>`;

  // --- Real Skills Derivation ---
  const skillMap = new Map();
  function addSkill(raw, bonusCount) {
    let s = String(raw || '').trim();
    if (!s || s.toLowerCase() === 'fork') return;
    const lower = s.toLowerCase();
    let canonical = s;
    let normKey = lower;
    if (lower === 'js') { normKey = 'javascript'; canonical = 'JavaScript'; }
    else if (lower === 'ts') { normKey = 'typescript'; canonical = 'TypeScript'; }
    else if (lower === 'react' || lower === 'reactjs') { normKey = 'react'; canonical = 'React'; }
    else if (lower === 'node' || lower === 'nodejs' || lower === 'node.js') { normKey = 'nodejs'; canonical = 'Node.js'; }
    else if (lower === 'html' || lower === 'html5') { normKey = 'html'; canonical = 'HTML5'; }
    else if (lower === 'css' || lower === 'css3') { normKey = 'css'; canonical = 'CSS3'; }
    else if (lower === 'py' || lower === 'python') { normKey = 'python'; canonical = 'Python'; }

    const cur = skillMap.get(normKey);
    if (!cur) {
      skillMap.set(normKey, { name: canonical, count: bonusCount || 1 });
    } else {
      cur.count += (bonusCount || 1);
    }
  }

  const explicitSkills = Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? p.skills.split(',') : []);
  explicitSkills.forEach(s => addSkill(s, 3));

  if (Array.isArray(p.projects)) {
    p.projects.forEach(pr => {
      const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
      techs.forEach(t => addSkill(t, 2));
    });
  }

  if (p.resume && Array.isArray(p.resume.skills)) {
    p.resume.skills.forEach(s => addSkill(s, 2));
  }

  const allSkillsList = Array.from(skillMap.values()).sort((a, b) => b.count - a.count);

  let skillsHtml = '';
  if (allSkillsList.length > 0) {
    skillsHtml = allSkillsList.slice(0, 6).map(sk => {
      const pct = Math.min(95, 65 + Math.min(30, sk.count * 6));
      const icon = devblueSkillIconWorker(sk.name);
      return `
        <div class="skills-data">
          <div class="skills-names">
            <i class='${icon} skills-icon'></i>
            <span class="skills-name">${esc(sk.name.toUpperCase())}</span>
          </div>
          <div>
            <span class="skills-percentage">${pct}%</span>
          </div>
          <div class="skills-bar" style="width: ${pct}%;"></div>
        </div>
      `;
    }).join('');
  } else {
    const defaultSkills = [
      { name: 'HTML5', pct: 95, icon: 'bx bxl-html5' },
      { name: 'CSS3', pct: 85, icon: 'bx bxl-css3' },
      { name: 'JAVASCRIPT', pct: 65, icon: 'bx bxl-javascript' },
      { name: 'UX/UI', pct: 85, icon: 'bx bxs-paint' }
    ];
    skillsHtml = defaultSkills.map(s => `
      <div class="skills-data">
        <div class="skills-names">
          <i class='${s.icon} skills-icon'></i>
          <span class="skills-name">${s.name}</span>
        </div>
        <div>
          <span class="skills-percentage">${s.pct}%</span>
        </div>
        <div class="skills-bar" style="width: ${s.pct}%;"></div>
      </div>
    `).join('');
  }

  // --- Real Projects Mapping (No random stock photos) ---
  const projects = Array.isArray(p.projects) ? p.projects : [];
  let worksHtml = '';
  if (projects.length > 0) {
    worksHtml = projects.map((pr, idx) => {
      const prTitle = esc(pr.title || `Project ${idx + 1}`);
      const prDesc = esc(pr.desc || pr.description || 'Web development project built with modern best practices.');
      const prUrl = pr.url || pr.demoUrl || '#';
      const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
      const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
      const hasRealImg = Boolean(pr.image || pr.img) && !/postimg\.cc/.test(pr.image || pr.img || '');
      const imgHtml = hasRealImg ? `<img src="${esc(pr.image || pr.img)}" alt="${prTitle}" class="work-card-img">` : '';

      const isGithub = pr.repo || /github\.com/.test(pr.url || '');
      const ghLink = isGithub && pr.url ? `<a href="${esc(pr.url)}" target="_blank" rel="noopener" class="work-card-link" title="Source Code"><i class='bx bxl-github'></i></a>` : '';
      const demoLink = prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="work-card-link" title="Live Preview"><i class='bx bx-link-external'></i></a>` : (!isGithub && prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener" class="work-card-link" title="Open Link"><i class='bx bx-link-external'></i></a>` : '');

      const tagsHtml = techs.length
        ? `<div class="work-card-tags">${techs.slice(0, 4).map(t => `<span class="work-tag">${esc(t)}</span>`).join('')}</div>`
        : '';

      return `
        <article class="work-card">
          ${imgHtml}
          <div>
            <div class="work-card-top">
              <i class='bx bx-folder work-card-icon'></i>
              <div class="work-card-links">
                ${ghLink}
                ${demoLink}
              </div>
            </div>
            <h3 class="work-card-title"><a href="${esc(prUrl)}" ${prUrl !== '#' ? 'target="_blank" rel="noopener"' : ''}>${prTitle}</a></h3>
            <p class="work-card-desc">${prDesc}</p>
          </div>
          ${tagsHtml}
        </article>
      `;
    }).join('');
  } else {
    worksHtml = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--second-color);">
        <i class='bx bx-code-block' style="font-size: 3rem; color: var(--first-color); margin-bottom: 1rem; display: block;"></i>
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: .5rem;">Projects in progress</h3>
        <p style="color: #64748b;">Projects will be showcased here once added.</p>
      </div>
    `;
  }

  // Social Links
  const linkedinIcon = p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-linkedin'></i></a>` : '';
  const instagramIcon = wShowInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-instagram'></i></a>` : '';
  const githubIcon = p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-github'></i></a>` : '';
  const twitterIcon = p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-twitter'></i></a>` : '';

  const footerLinkedin = p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-linkedin'></i></a>` : '';
  const footerInstagram = wShowInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-instagram'></i></a>` : '';
  const footerGithub = p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-github'></i></a>` : '';
  const footerTwitter = p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-twitter'></i></a>` : '';

  const devblueScript = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  // 1. Toggling Mobile Menu
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }

  // 2. Active Link on Click & Auto Close Mobile Menu
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      if (nav) nav.classList.remove('show');
    });
  });

  // 3. Scroll Section Active Link Highlighter
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }, { passive: true });

  // 4. Contact Form Action
  const contactForm = document.getElementById('devblueContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cName = (document.getElementById('dbName')?.value || '').trim();
      const cEmail = (document.getElementById('dbEmail')?.value || '').trim();
      const cMsg = (document.getElementById('dbMessage')?.value || '').trim();

      const subject = encodeURIComponent('Portfolio Inquiry from ' + cName);
      const body = encodeURIComponent('Hi ${name},\\n\\nName: ' + cName + '\\nEmail: ' + cEmail + '\\n\\nMessage:\\n' + cMsg + '\\n\\n-- Sent via portfoolio.me');
      window.location.href = 'mailto:${p.email || 'hello@portfoolio.me'}?subject=' + subject + '&body=' + body;

      const statusEl = document.getElementById('dbStatus');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = '✓ Opening email client...';
      }
    });
  }

  // 5. ScrollReveal Animations
  try {
    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1800,
        reset: false
      });

      sr.reveal('.home-title', {});
      sr.reveal('.button', { delay: 150 });
      sr.reveal('.home-img', { delay: 300 });
      sr.reveal('.home-social', { delay: 300 });

      sr.reveal('.about-data', {});
      sr.reveal('.about-subtitle', { delay: 150 });
      sr.reveal('.about-text', { delay: 250 });

      sr.reveal('.skills-header-block', { delay: 100 });
      sr.reveal('.skills-data', { interval: 100 });

      sr.reveal('.work-card', { interval: 100 });
      sr.reveal('.contact-input', { interval: 150 });
    }
  } catch (err) {
    console.warn('ScrollReveal warning:', err);
  }
});
</script>
`;

  return `<!DOCTYPE html>
<html lang="en">
${head(p, 'devblue')}
<body class="body-main" data-template="devblue">
  <header class="l-header">
    <nav class="nav bd-grid">
      <div>
        <a href="#home" class="nav-logo">${name}</a>
      </div>

      <div class="nav-menu" id="nav-menu">
        <ul class="nav-list">
          <li class="nav-item"><a href="#home" class="nav-link active">Home</a></li>
          <li class="nav-item"><a href="#about" class="nav-link">About</a></li>
          <li class="nav-item"><a href="#skills" class="nav-link">Skills</a></li>
          <li class="nav-item"><a href="#work" class="nav-link">Work</a></li>
          <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
        </ul>
      </div>

      <div class="nav-toggle" id="nav-toggle">
        <i class='bx bx-menu'></i>
      </div>
    </nav>
  </header>

  <main class="l-main">
    <section class="home bd-grid" id="home">
      <div class="home-data">
        <h1 class="home-title">Hi, <br>I'm <span class="home-title-color">${name}</span><br> ${title}</h1>
        <a href="#contact" class="button">Contact</a>
      </div>

      <div class="home-social">
        ${linkedinIcon || `<a href="#" class="home-social-icon"><i class='bx bxl-linkedin'></i></a>`}
        ${instagramIcon || `<a href="#" class="home-social-icon"><i class='bx bxl-instagram'></i></a>`}
        ${githubIcon || `<a href="#" class="home-social-icon"><i class='bx bxl-github'></i></a>`}
        ${twitterIcon}
      </div>

      <div class="home-img">
        <img src="${avatarImg}" alt="${name}">
      </div>
    </section>

    <section class="about section" id="about">
      <h2 class="section-title">About</h2>

      <div class="about-container bd-grid">
        <div class="about-data">
          <h2 class="about-subtitle">I'm ${name}</h2>
          <p class="about-text">${bio}</p>
        </div>
      </div>
    </section>

    <section class="skills section" id="skills">
      <h2 class="section-title">Skills</h2>

      <div class="skills-container bd-grid">
        <div class="skills-header-block">
          <h2 class="skills-subtitle">Professional Skills</h2>
          <p class="skills-text">Proficiencies developed across software engineering, architecture, and design.</p>
        </div>

        <div class="skills-grid">
          ${skillsHtml}
        </div>
      </div>
    </section>

    <section class="work section" id="work">
      <h2 class="section-title">Work</h2>

      <div class="work-container bd-grid">
        ${worksHtml}
      </div>
    </section>

    <section class="contact section" id="contact">
      <h2 class="section-title">Contact</h2>

      <div class="contact-container bd-grid">
        <form class="contact-form" id="devblueContactForm">
          <input type="text" placeholder="Name" class="contact-input" id="dbName" required>
          <input type="email" placeholder="Email" class="contact-input" id="dbEmail" required>
          <textarea placeholder="Message" cols="0" rows="10" class="contact-input" id="dbMessage" required></textarea>
          <div id="dbStatus" style="display:none;margin-bottom:1rem;color:var(--first-color);font-weight:600;"></div>
          <input type="submit" value="Send" class="contact-button button">
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p class="footer-title">${name}</p>

    <div class="footer-social">
      ${footerGithub}
      ${footerLinkedin}
      ${footerInstagram}
      ${footerTwitter}
    </div>

    <p>&#169; ${new Date().getFullYear()} ${name} • Built via <a href="https://portfoolio.me" style="color:#ffffff;text-decoration:underline">portfoolio.me</a></p>
  </footer>

  ${devblueScript}
</body>
</html>`;
}

function pageCube(p) {
  const name = esc(p.name || 'Muzammal');
  const title = esc(p.title || 'Web Developer');
  const bio = esc(p.bio || p.desc || p.tagline || 'Passionate web developer specializing in building modern, interactive, and high-performance digital experiences.');
  const email = esc(p.email || '');
  const phone = esc(p.phone || '');
  const location = esc(p.location || 'Worldwide / Remote');
  const username = esc(p.username || 'user');

  const avatarImg = (p.avatarUrl || p.avatar_url)
    ? esc(p.avatarUrl || p.avatar_url)
    : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23212529"/><circle cx="200" cy="200" r="160" fill="%23343a40" stroke="%2380ed99" stroke-width="6"/><text x="50%" y="54%" font-size="140" font-family="system-ui,sans-serif" font-weight="bold" fill="%2380ed99" dominant-baseline="middle" text-anchor="middle">${encodeURIComponent((p.name || 'M').charAt(0).toUpperCase())}</text></svg>`;

  const explicitSkills = Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? p.skills.split(',') : []);
  const skillList = explicitSkills.map(s => String(s || '').trim()).filter(Boolean);
  if (!skillList.length) {
    skillList.push('HTML', 'CSS', 'JavaScript', 'Python', 'React');
  }
  const pctValues = [95, 88, 85, 78, 75, 70];
  const skillsBars = skillList.slice(0, 6).map((sk, idx) => {
    const pct = pctValues[idx] || (70 - (idx * 5));
    return `
      <li>
        <div class="skill-bar-head">
          <p>${esc(sk)}</p>
          <span class="skill-pct">${pct}%</span>
        </div>
        <div class="bar">
          <div class="active-bar" style="width:${pct}%"></div>
        </div>
      </li>
    `;
  }).join('');

  const expYears = (p.experience && p.experience.length) ? `${p.experience.length}+ yrs` : '3+ years';
  const projectCount = (p.projects && p.projects.length) ? `${p.projects.length}+` : '10+';

  const userServices = (Array.isArray(p.services) && p.services.length)
    ? p.services
    : (p.resume && Array.isArray(p.resume.services) && p.resume.services.length)
    ? p.resume.services
    : null;

  const hasServices = Boolean(userServices && userServices.length);
  const serviceCards = hasServices ? userServices.map(s => `
    <div class="service">
      <div class="service-icon"><i class="${esc(s.icon || 'fa-solid fa-code')}"></i></div>
      <h2>${esc(s.title)}</h2>
      <p>${esc(s.desc)}</p>
    </div>
  `).join('') : '';

  const servicesSlideHtml = hasServices ? `
    <!-- Slide: Services -->
    <div class="swiper-slide services">
      <h1 class="heading">Services</h1>
      ${serviceCards}
    </div>
  ` : '';

  const homeIdx = 0;
  const aboutIdx = 1;
  const servicesIdx = hasServices ? 2 : -1;
  const galleryIdx = hasServices ? 3 : 2;
  const contactIdx = hasServices ? 4 : 3;

  const navLinks = [
    `<li onclick="window.cubeNavigate(${homeIdx})" class="activeLink" data-slide="${homeIdx}"><i class="fa-solid fa-house"></i><p>Home</p></li>`,
    `<li onclick="window.cubeNavigate(${aboutIdx})" data-slide="${aboutIdx}"><i class="fa-solid fa-user"></i><p>About Me</p></li>`,
    hasServices ? `<li onclick="window.cubeNavigate(${servicesIdx})" data-slide="${servicesIdx}"><i class="fa-solid fa-list"></i><p>Services</p></li>` : '',
    `<li onclick="window.cubeNavigate(${galleryIdx})" data-slide="${galleryIdx}"><i class="fa-solid fa-images"></i><p>Gallery</p></li>`,
    `<li onclick="window.cubeNavigate(${contactIdx})" data-slide="${contactIdx}"><i class="fa-solid fa-comments"></i><p>Contact Me</p></li>`
  ].filter(Boolean).join('');

  const allProjects = Array.isArray(p.projects) ? p.projects : [];
  const selectedProjects = allProjects.filter(pr => pr.selected !== false && !pr.hidden);
  const projectsData = selectedProjects.length ? selectedProjects : (allProjects.length ? allProjects : [
    { title: 'Modern Web Platform', desc: 'Interactive full-stack web application with responsive UI and real-time state management.', tags: ['React', 'Node.js', 'CSS3'] },
    { title: 'Interactive Portfolio', desc: 'Personal branding portal showcasing skills, works, and instant contact workflows.', tags: ['JavaScript', 'HTML5', 'Swiper'] },
    { title: 'Cloud API Service', desc: 'High-availability backend service with RESTful endpoints and optimized data pipelines.', tags: ['Node.js', 'Express', 'Database'] }
  ]);
  const projectCards = projectsData.map((pr) => {
    const iconClass = (pr.title.toLowerCase().includes('design') || pr.title.toLowerCase().includes('ui'))
      ? 'fa-solid fa-palette'
      : (pr.title.toLowerCase().includes('mobile') || pr.title.toLowerCase().includes('app'))
      ? 'fa-solid fa-mobile-screen'
      : (pr.title.toLowerCase().includes('cloud') || pr.title.toLowerCase().includes('api'))
      ? 'fa-solid fa-server'
      : 'fa-solid fa-code';
    const tags = ((pr.technologies || pr.tags) || []).map(t => `<span class="cube-tag">${esc(t)}</span>`).join('');
    return `
      <div class="cube-project">
        <div class="cube-project-top">
          <div class="cube-project-icon"><i class="${iconClass}"></i></div>
          <div class="cube-project-links">
            ${pr.url ? `<a class="cube-project-link" href="${esc(pr.url)}" target="_blank" title="View Source"><i class="fa-brands fa-github"></i></a>` : ''}
            ${pr.demoUrl ? `<a class="cube-project-link" href="${esc(pr.demoUrl)}" target="_blank" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
          </div>
        </div>
        <h3 class="cube-project-title"><a href="${esc(pr.url || pr.demoUrl || '#')}" target="_blank">${esc(pr.title)}</a></h3>
        <p class="cube-project-desc">${esc(pr.desc || 'A featured software project demonstrating technical craftsmanship.')}</p>
        <div class="cube-project-tags">${tags}</div>
      </div>
    `;
  }).join('');

  const cubeScript = `
  <script>
  (function() {
    function initSwiper() {
      if (typeof Swiper !== 'undefined') {
        try {
          window.cubeSwiper = new Swiper(".mySwiper", {
            effect: "cube",
            allowTouchMove: true,
            grabCursor: true,
            cubeEffect: {
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            },
            mousewheel: {
              releaseOnEdges: true,
              sensitivity: 0.8,
            },
            speed: 800
          });
          window.cubeSwiper.on('slideChange', function () {
            var links = document.querySelectorAll(".cube-aside .Links li");
            links.forEach(function(l) { l.classList.remove("activeLink"); });
            if (links[window.cubeSwiper.activeIndex]) {
              links[window.cubeSwiper.activeIndex].classList.add("activeLink");
            }
          });
        } catch (e) {
          console.warn('Swiper init error', e);
        }
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSwiper);
    } else {
      initSwiper();
    }

    window.cubeNavigate = function(indx) {
      var links = document.querySelectorAll(".cube-aside .Links li");
      links.forEach(function(l) { l.classList.remove("activeLink"); });
      if (links[indx]) links[indx].classList.add("activeLink");
      if (window.cubeSwiper) {
        window.cubeSwiper.slideTo(indx, 800, true);
      }
    };
    window.Navigate = window.cubeNavigate;

    var contactForm = document.getElementById('cubeContactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var cName = (document.getElementById('cubeName')?.value || '').trim();
        var cEmail = (document.getElementById('cubeEmail')?.value || '').trim();
        var cMsg = (document.getElementById('cubeMsg')?.value || '').trim();
        var subject = encodeURIComponent('Portfolio Inquiry from ' + cName);
        var body = encodeURIComponent('Hi ' + ${JSON.stringify(p.name || 'there')} + ',\\n\\nName: ' + cName + '\\nEmail: ' + cEmail + '\\n\\nMessage:\\n' + cMsg + '\\n\\n-- Sent via portfoolio.me');
        window.location.href = 'mailto:' + ${JSON.stringify(p.email || 'hello@portfoolio.me')} + '?subject=' + subject + '&body=' + body;
        var statusEl = document.getElementById('cubeStatus');
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.textContent = '✓ Opening your email client to reach ' + ${JSON.stringify(p.name || 'developer')} + '...';
        }
      });
    }
  })();
  </script>
  `;

  return `<!DOCTYPE html>
<html lang="en">
${head(p, 'cube')}
<body class="body-main" data-template="cube">
  <div id="app">
    <main class="cube-main">
      <aside class="cube-aside">
        <div class="cube-brand">
          <a class="cube-logo" href="/"><span class="cube-dot"></span><span>PORTFOOLIO</span></a>
        </div>
        <ul class="Links">
          ${navLinks}
        </ul>
        <div class="cube-aside-foot">
          <span>${username}.portfoolio.me</span>
        </div>
      </aside>

      <div class="swiper mySwiper">
        <div class="SlideContainer swiper-wrapper">
          <!-- Slide 0: Home -->
          <div class="swiper-slide home-slide">
            <div class="HomeContent">
              <h1>Hi! I'm <span class="stylized-name">${name}</span>,</h1>
              <h2>A <span class="proffesions">${title}</span></h2>
              <p class="heroline">${bio}</p>
              <div class="buttonGroup">
                ${email ? `<a class="cube-btn" href="mailto:${email}">Hire Me</a>` : ''}
                <button class="cube-btn secondary" onclick="window.cubeNavigate(${contactIdx})">Contact Me</button>
              </div>
            </div>
            <div class="SideImg">
              <div class="top-right-corner">
                <hr class="hr1">
                <hr class="hr2">
              </div>
              <img src="${avatarImg}" alt="${name}">
              <div class="bottom-left-corner">
                <hr class="hr1">
                <hr class="hr2">
              </div>
            </div>
            <p class="slide-help" onclick="window.cubeNavigate(1)">Scroll for next slide <i class="fa-solid fa-chevron-right fa-shake"></i></p>
          </div>

          <!-- Slide 1: About Me -->
          <div class="swiper-slide">
            <div class="about-us">
              <h1 class="heading">About Me</h1>
              <h3 class="sub-heading">I'm ${name}, <span class="proffesions">A ${title}</span></h3>
              <p class="aboutme-deatils">${bio}</p>
              <div class="about-me-divison">
                <div class="about-me-table">
                  <li><span>Experience:</span> ${expYears}</li>
                  <li><span>Location:</span> ${location}</li>
                  <li><span>Availability:</span> Open for hire</li>
                  <li><span>Projects:</span> ${projectCount}</li>
                  <li><span>Role:</span> ${title}</li>
                  <li><span>Email:</span> ${email || 'Available on request'}</li>
                  <li><span>Focus:</span> Full-Stack &amp; Web</li>
                  <li><span>Platform:</span> portfoolio.me</li>
                  <div class="buttonGroup">
                    ${email ? `<a class="cube-btn" href="mailto:${email}">Hire Me</a>` : ''}
                    <button class="cube-btn secondary" onclick="window.cubeNavigate(${contactIdx})">Contact Me</button>
                  </div>
                </div>

                <ul class="skill-bar">
                  ${skillsBars}
                </ul>
              </div>
            </div>
          </div>

          ${servicesSlideHtml}

          <!-- Slide: Gallery -->
          <div class="swiper-slide gallery">
            <h1 class="heading">Gallery</h1>
            ${projectCards}
          </div>

          <!-- Slide 4: Contact Me -->
          <div class="swiper-slide contactMe">
            <h1 class="heading">Contact Me</h1>
            <div class="contact-info-list">
              ${phone ? `<div class="contactinfo"><i class="fa-solid fa-phone"></i><div><h3>Mobile</h3><p>${phone}</p></div></div>` : ''}
              <div class="contactinfo"><i class="fa-solid fa-location-dot"></i><div><h3>Location</h3><p>${location}</p></div></div>
              ${email ? `<div class="contactinfo"><i class="fa-regular fa-envelope"></i><div><h3>Email</h3><p>${email}</p></div></div>` : ''}
              <div class="contactinfo"><i class="fa-solid fa-globe"></i><div><h3>Website</h3><p>${username}.portfoolio.me</p></div></div>
            </div>

            <form id="cubeContactForm">
              <h2>Send Me A Message
                <div class="SocialLinks">
                  ${p.github ? `<a href="${esc(p.github)}" target="_blank" title="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
                  ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>` : ''}
                  ${wShowInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>` : ''}
                  ${email ? `<a href="mailto:${email}" title="Email"><i class="fa-solid fa-envelope"></i></a>` : ''}
                </div>
              </h2>
              <input type="text" id="cubeName" placeholder="Name" required>
              <input type="email" id="cubeEmail" placeholder="Email" required>
              <textarea id="cubeMsg" rows="5" placeholder="Type your Message Here..." required></textarea>
              <button type="submit" class="cube-btn">Send Message</button>
              <div id="cubeStatus" style="display:none;color:var(--cube-primary);font-size:0.95rem;padding:8px 0;"></div>
            </form>

            <footer>
              <p>© ${new Date().getFullYear()} ${name} • Powered by <a href="https://portfoolio.me" style="color:#ffffff;text-decoration:underline" target="_blank">portfoolio.me</a></p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  </div>
  ${cubeScript}
</body>
</html>`;
}


/* ==========================================================================
   REVERSE-ENGINEERED PORTFOLIO TEMPLATES (Worker Subdomain Server Rendering)
   Nova, Codeflow, Wave, Assistant, Console, Snowcard, Parchment, Cloud
   ========================================================================== */

function pageNova(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Full Stack Engineer');
  const tagline = esc(p.tagline || 'Building impactful digital solutions with modern technology.');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, a dedicated technologist passionate about engineering scalable, elegant, and reliable systems.`);
  const location = esc(p.location || 'Remote / Worldwide');
  const email = esc(p.email || '');
  const firstName = (p.name || '').trim().split(' ')[0] || 'developer';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const expHtml = rawExp.map(e => `
    <div class="nv-card">
      <div class="nv-card-top">
        <div>
          <h3 class="nv-card-role">${esc(e.role || e.title || 'Software Engineer')}</h3>
          <div class="nv-card-org">${esc(e.company || e.organization || '')}</div>
        </div>
        <div class="nv-card-meta">
          <span>${esc(e.location || '')}</span>
          <span class="pill">${esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</span>
        </div>
      </div>
      ${e.desc ? `<p class="nv-card-desc">${esc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <div class="nv-keyh">Key Contributions</div>
        <ul class="nv-dots">${(e.bullets || e.achievements).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `).join('');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => {
    const prTitle = esc(pr.title || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Full stack engineering project.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const img = pr.image || pr.img || '';
    return `
      <div class="nv-projx">
        <div class="nv-projx-shot">
          ${img ? `<img src="${esc(img)}" alt="${prTitle}">` : `<div class="ph">${prTitle.slice(0, 2).toUpperCase()}</div>`}
        </div>
        <div class="nv-projx-info">
          <h3>${prTitle} ${prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener" class="nv-checkout">Code ↗</a>` : ''}${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="nv-checkout">Live Demo ↗</a>` : ''}</h3>
          <p>${prDesc}</p>
          <div class="nv-pill-tags">
            ${techs.map(t => `<span class="nv-ptag">✦ ${esc(t)}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const skillsHtml = `
    <div class="nv-stack">
      <div class="nv-stack-card" style="grid-column: 1 / -1;">
        <div class="nv-stack-grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));">
          ${skills.map(s => `
            <div class="nv-stack-item">
              <span class="nv-glyph" style="display:block">✦</span>
              <span class="nm">${esc(s)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const script = `<script>
  (function() {
    var c = document.getElementById('nv-canvas');
    if (c) {
      var ctx = c.getContext('2d'), W, H, pts = [];
      function resize() {
        W = c.width = window.innerWidth;
        H = c.height = window.innerHeight;
        var n = Math.min(85, Math.round(W * H / 18000));
        pts = [];
        for (var i = 0; i < n; i++) {
          pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45 });
        }
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });
      function draw() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.28); ctx.fillStyle = 'rgba(45,212,191,.75)'; ctx.fill();
          for (var j = i + 1; j < pts.length; j++) {
            var p2 = pts[j];
            var dx = p.x - p2.x, dy = p.y - p2.y, d = Math.sqrt(dx*dx + dy*dy);
            if (d < 120) {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'rgba(45,212,191,' + ((1 - d/120)*.22) + ')'; ctx.lineWidth = .8; ctx.stroke();
            }
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    }
    var roles = [${JSON.stringify(p.title || 'Developer')}, 'Full Stack Engineer', 'Software Craftsman'];
    var el = document.getElementById('nv-typed');
    if (el && roles.length) {
      var ri = 0, ci = 0, del = false;
      function tick() {
        var cur = roles[ri % roles.length];
        el.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
        if (!del && ci > cur.length) { del = true; setTimeout(tick, 1500); return; }
        if (del && ci < 0) { del = false; ci = 0; ri++; }
        setTimeout(tick, del ? 45 : 95);
      }
      tick();
    }
  })();
  </script>`;

  return `<!DOCTYPE html><html lang="en">${head(p, 'nova')}<body class="portfolio-view" data-template="nova">
    <canvas id="nv-canvas"></canvas>
    <nav class="nv-nav">
      <div class="nv-nav-in">
        <a href="#home" class="nv-brand">&lt;${esc(firstName.toLowerCase())} /&gt;</a>
        <div class="nv-links" id="nv-links">
          <a href="#home" class="on">Home</a>
          <a href="#about">About</a>
          ${expHtml ? `<a href="#experience">Experience</a>` : ''}
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <a class="btn btn-ghost btn-sm" href="${ORIGIN}/" style="font-size:12px;padding:6px 12px">Make yours</a>
          ${email ? `<a class="btn btn-primary btn-sm" href="mailto:${email}" style="font-size:12px;padding:6px 14px">Hire ${esc(firstName)}</a>` : ''}
        </div>
      </div>
    </nav>
    <header class="nv-hero" id="home">
      <div class="nv-avatar-ring">
        ${p.avatarUrl ? `<img class="nv-avatar" src="${esc(p.avatarUrl)}" alt="${name}">` : `<div class="nv-avatar ph">${name.charAt(0)}</div>`}
        <span class="nv-avatar-dot"></span>
      </div>
      <h1>Hi! I'm <span class="g">${name}</span>.</h1>
      <div class="nv-type"><span class="a">A </span><span class="t" id="nv-typed">${title}</span><span class="cur">|</span></div>
      <p class="nv-quote">"${tagline}"</p>
      <div class="nv-loc">${location}</div>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <a href="#projects" class="nv-btn nv-btn-teal">View My Work →</a>
        ${email ? `<a href="mailto:${email}" class="nv-btn nv-btn-ghost">Contact Me</a>` : ''}
      </div>
    </header>
    <section class="nv-section" id="about">
      <div class="nv-wrap nv-about">
        <h2 class="nv-title">About <span class="g">Me</span></h2>
        <div class="nv-rule"></div>
        <div class="nv-about-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:38px;height:38px"><path d="m8 9-3 3 3 3M16 9l3 3-3 3"/></svg></div>
        <p>${bio}</p>
      </div>
    </section>
    ${expHtml ? `
      <section class="nv-section" id="experience">
        <div class="nv-wrap">
          <h2 class="nv-title">Professional <span class="g">Experience</span></h2>
          <div class="nv-rule"></div>
          ${expHtml}
        </div>
      </section>
    ` : ''}
    <section class="nv-section" id="projects">
      <div class="nv-wrap">
        <h2 class="nv-title">Featured <span class="g">Projects</span></h2>
        <div class="nv-rule"></div>
        ${projectsHtml || '<p style="text-align:center;color:var(--nv-dim)">Projects coming soon.</p>'}
      </div>
    </section>
    <section class="nv-section" id="skills">
      <div class="nv-wrap">
        <h2 class="nv-title">Skills &amp; <span class="g">Stack</span></h2>
        <div class="nv-rule"></div>
        ${skillsHtml}
      </div>
    </section>
    <section class="nv-section" id="contact">
      <div class="nv-wrap">
        <h2 class="nv-title">Let's <span class="g">Connect</span></h2>
        <div class="nv-rule"></div>
        <div class="nv-connect" style="max-width:760px;margin:0 auto">
          ${email ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">Email</h3><p class="nv-card-desc"><a href="mailto:${email}" style="color:var(--nv-teal)">${email}</a></p></div>` : ''}
          ${p.github ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">GitHub</h3><p class="nv-card-desc"><a href="${esc(p.github)}" target="_blank" rel="noopener" style="color:var(--nv-teal)">${esc(p.github)}</a></p></div>` : ''}
          ${p.linkedin ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">LinkedIn</h3><p class="nv-card-desc"><a href="${esc(p.linkedin)}" target="_blank" rel="noopener" style="color:var(--nv-teal)">Connect on LinkedIn</a></p></div>` : ''}
        </div>
      </div>
    </section>
    ${foot(p)}
    ${script}
  </body></html>`;
}

function pageCodeflow(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Software Engineer');
  const tagline = esc(p.tagline || 'Building production-ready software with modern engineering principles.');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, specializing in reliable backend systems, cloud architectures, and modern web applications.`);
  const email = esc(p.email || '');

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const expHtml = rawExp.map(e => `
    <div class="cf-card" style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <h3 style="margin:0 0 4px;color:#fff;font-size:1.25rem">${esc(e.role || e.title || 'Role')}</h3>
          <p style="margin:0;color:var(--cf-cyan);font-weight:600">${esc(e.company || e.organization || '')}</p>
        </div>
        <span class="cf-tag">${esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</span>
      </div>
      ${e.desc ? `<p style="margin:14px 0 0;color:var(--cf-dim)">${esc(e.desc)}</p>` : ''}
    </div>
  `).join('');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => {
    const prTitle = esc(pr.title || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Full stack software solution.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    return `
      <div class="cf-card" style="margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div>
            <h3 style="color:#fff;font-size:1.4rem;margin:0 0 6px">${prTitle}</h3>
            <p style="color:var(--cf-dim);margin:0 0 14px">${prDesc}</p>
          </div>
          <div style="display:flex;gap:10px">
            ${prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener" class="cf-btn cf-btn-outline" style="padding:8px 16px;font-size:0.85rem">Code ↗</a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="cf-btn cf-btn-blue" style="padding:8px 16px;font-size:0.85rem">Live Demo ↗</a>` : ''}
          </div>
        </div>
        <div class="cf-tags" style="margin-top:12px">
          ${techs.map(t => `<span class="cf-tag">${esc(t)}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const skillsHtml = `
    <div class="cf-tags" style="justify-content:center;gap:12px">
      ${skills.map(s => `<span class="cf-tag" style="font-size:0.95rem;padding:8px 18px">✦ ${esc(s)}</span>`).join('')}
    </div>
  `;

  const script = `<script>
  (function() {
    var pEl = document.getElementById('cfPct'), fEl = document.getElementById('cfFill');
    function onScroll() {
      var st = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? Math.min(100, Math.max(0, Math.round((st / h) * 100))) : 0;
      if (pEl) pEl.textContent = '→ ' + pct + '%';
      if (fEl) fEl.style.width = pct + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();
  </script>`;

  return `<!DOCTYPE html><html lang="en">${head(p, 'codeflow')}<body class="portfolio-view" data-template="codeflow">
    <div class="cf-prog">
      <span class="pct" id="cfPct">→ 0%</span>
      <div class="cf-keys">
        <div class="cf-keys-fill" id="cfFill"></div>
        <div class="cf-keys-text"><span class="cf-key on">const</span> dev = { name: "${name}", status: "building" };<span class="cf-cursor"></span></div>
      </div>
      <span class="cf-remain">codeflow</span>
    </div>
    <div class="cf-wrap">
      <nav class="cf-nav">
        <div class="cf-brand">${name}</div>
        <div class="cf-navlinks">
          <a href="#about" class="on">About</a>
          ${expHtml ? `<a href="#experience">Experience</a>` : ''}
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <a class="cf-btn cf-btn-ghost" href="${ORIGIN}/" style="font-size:0.85rem;padding:8px 14px">Make yours</a>
      </nav>
      <header class="cf-hero">
        <div>
          <div class="cf-hey">⚡ Welcome, I'm</div>
          <h1 class="cf-type">${name}</h1>
          <div class="cf-headline">${title}</div>
          <p class="cf-lead">${tagline}</p>
          <div class="cf-actions">
            <a href="#projects" class="cf-btn cf-btn-blue">Explore Projects →</a>
            ${email ? `<a href="mailto:${email}" class="cf-btn cf-btn-outline">Say Hello</a>` : ''}
          </div>
        </div>
        <div style="text-align:center">
          ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${name}" class="cf-hero-photo">` : `<div class="cf-hero-photo ph">${name.charAt(0)}</div>`}
        </div>
      </header>
      <section class="cf-section" id="about">
        <h2 class="cf-title">About Overview</h2>
        <div class="cf-card" style="max-width:820px;margin:0 auto;text-align:center">
          <p style="font-size:1.1rem;line-height:1.8">${bio}</p>
        </div>
      </section>
      ${expHtml ? `
        <section class="cf-section" id="experience">
          <h2 class="cf-title">Professional Experience</h2>
          <div style="max-width:820px;margin:0 auto">${expHtml}</div>
        </section>
      ` : ''}
      <section class="cf-section" id="skills">
        <h2 class="cf-title">Technical Skills</h2>
        ${skillsHtml}
      </section>
      <section class="cf-section" id="projects">
        <h2 class="cf-title">Featured Projects</h2>
        <div style="max-width:860px;margin:0 auto">${projectsHtml || '<p style="text-align:center;color:var(--cf-faint)">No projects listed yet.</p>'}</div>
      </section>
      <section class="cf-section" id="contact" style="text-align:center">
        <h2 class="cf-title">Get in Touch</h2>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:20px">
          ${email ? `<a href="mailto:${email}" class="cf-btn cf-btn-blue">Email Me (${email})</a>` : ''}
          ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="cf-btn cf-btn-outline">GitHub</a>` : ''}
        </div>
      </section>
    </div>
    ${foot(p)}
    ${script}
  </body></html>`;
}

function pageWave(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Creative Technologist');
  const tagline = esc(p.tagline || 'Designing high-performance systems with digital elegance.');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, creating digital products at the intersection of robust backend architecture and striking visual aesthetics.`);
  const email = esc(p.email || '');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => {
    const prTitle = esc(pr.title || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Modern software showcase.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    return `
      <div class="w-show">
        <div class="w-show-media">
          <div class="w-show-ph">${prTitle.slice(0, 2).toUpperCase()}</div>
        </div>
        <div class="w-show-info">
          <h3>${prTitle}</h3>
          <p style="color:var(--w-dim);line-height:1.7">${prDesc}</p>
          <div class="w-tags">
            ${techs.map(t => `<span class="w-tag">✦ ${esc(t)}</span>`).join('')}
          </div>
          <div style="display:flex;gap:12px;margin-top:14px">
            ${prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener" class="w-btn w-btn-green" style="padding:8px 18px">Code →</a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="w-btn w-btn-blue" style="padding:8px 18px">Live Demo →</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  const script = `<script>
  (function() {
    var c = document.getElementById('w-canvas');
    if (!c) return;
    var ctx = c.getContext('2d'), W, H;
    function resize() {
      W = c.width = c.parentElement.offsetWidth || window.innerWidth;
      H = c.height = c.parentElement.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    var LINES = 100;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var t = Date.now() * 0.0006;
      for (var i = 0; i < LINES; i++) {
        var prog = i / LINES;
        ctx.beginPath();
        for (var x = 0; x <= W; x += 12) {
          var nx = x / W;
          var y = H * (0.2 + 0.6 * prog)
            + Math.sin(nx * 5 + t + prog * 4) * 50 * Math.sin(t * 0.4 + prog * 2)
            + Math.sin(nx * 10 - t * 1.2 + prog * 2) * 20;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        var alpha = 0.04 + 0.18 * Math.pow(Math.sin(t * 0.6 + prog * Math.PI), 2);
        ctx.strokeStyle = 'rgba(46,230,166,' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();
  </script>`;

  return `<!DOCTYPE html><html lang="en">${head(p, 'wave')}<body class="portfolio-view" data-template="wave">
    ${email ? `<div class="w-rail">${email}</div>` : ''}
    <div class="w-hero">
      <canvas id="w-canvas"></canvas>
      <div class="w-hero-inner">
        <div class="w-hello">
          <div class="bar"></div>
          <div>
            <div class="hi">HELLO WORLD, I'M</div>
            <div class="w-name">${name.toUpperCase()}</div>
          </div>
        </div>
        <p class="w-tagline">${tagline}</p>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <a href="#projects" class="w-btn w-btn-green">View Projects</a>
          ${email ? `<a href="mailto:${email}" class="w-btn w-btn-blue">Contact Me</a>` : ''}
        </div>
      </div>
    </div>
    <section class="w-section" id="about">
      <div class="w-wrap">
        <div class="w-head">
          <h2>About Me</h2>
          <p>Creative drive, software focus, execution.</p>
        </div>
        <div class="w-about">
          ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${name}" class="w-about-photo">` : `<div class="w-about-photo ph">${name.charAt(0)}</div>`}
          <div class="w-about-text">
            <p>${bio}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="w-section" id="skills">
      <div class="w-wrap">
        <div class="w-head">
          <h2>Capabilities &amp; Skills</h2>
        </div>
        <div class="w-chips">${skills.map(s => `<span class="w-chip">✦ ${esc(s)}</span>`).join('')}</div>
      </div>
    </section>
    <section class="w-section" id="projects">
      <div class="w-wrap">
        <div class="w-head">
          <h2>Selected Work</h2>
        </div>
        <div class="w-showcase">${projectsHtml || '<p style="text-align:center;color:var(--w-faint)">Projects coming soon.</p>'}</div>
      </div>
    </section>
    ${foot(p)}
    ${script}
  </body></html>`;
}

function pageAssistant(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Software Engineer');
  const firstName = (p.name || '').trim().split(' ')[0] || 'the candidate';

  return `<!DOCTYPE html><html lang="en">${head(p, 'assistant')}<body class="portfolio-view" data-template="assistant">
    <div class="as-app" id="asApp">
      <aside class="as-side">
        <button type="button" class="as-newchat" onclick="location.reload()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M12 5v14M5 12h14"/></svg>
          New Portfolio Chat
        </button>
        <div class="as-side-label">QUICK PROMPTS</div>
        <div class="as-side-list">
          <button type="button" class="as-side-item" onclick="askPrompt('Tell me about yourself')">👤 About ${esc(firstName)}</button>
          <button type="button" class="as-side-item" onclick="askPrompt('Show me your projects')">💻 Featured Projects</button>
          <button type="button" class="as-side-item" onclick="askPrompt('What are your skills?')">⚡ Technical Skills</button>
          <button type="button" class="as-side-item" onclick="askPrompt('How can I contact or hire you?')">📬 Contact &amp; Hire</button>
        </div>
        <div class="as-side-foot">
          <div class="av">${name.charAt(0)}</div>
          <div class="meta"><b>${name}</b><span>${title}</span></div>
        </div>
      </aside>
      <main class="as-main">
        <div class="as-top">
          <div class="pill"><span>${name} AI Assistant</span></div>
          <span class="badge">Model: Portfoolio-4.5</span>
          <a href="${ORIGIN}/" class="btn btn-ghost btn-sm" style="margin-left:auto;font-size:12px">Make yours</a>
        </div>
        <div class="as-scroll" id="asScroll">
          <div class="as-thread" id="asThread">
            <div class="as-msg bot">
              <div class="av"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div>
              <div class="body">
                <p>Hello! 👋 I'm <b>${name}</b>'s interactive portfolio assistant. Ask me anything about their background, projects, or how to get in touch!</p>
              </div>
            </div>
          </div>
          <div class="as-suggest" id="asSuggest">
            <button type="button" class="as-chip" onclick="askPrompt('Tell me about yourself')"><span class="t">About ${esc(firstName)}</span></button>
            <button type="button" class="as-chip" onclick="askPrompt('Show me your projects')"><span class="t">Projects</span></button>
            <button type="button" class="as-chip" onclick="askPrompt('What are your skills?')"><span class="t">Skills</span></button>
            <button type="button" class="as-chip" onclick="askPrompt('How can I contact or hire you?')"><span class="t">Contact</span></button>
          </div>
        </div>
        <div class="as-composer">
          <div class="as-composer-inner">
            <div class="as-inputbar">
              <textarea id="asInput" rows="1" placeholder="Message ${esc(firstName)}'s AI Assistant..."></textarea>
              <button type="button" class="as-send" id="asSend" onclick="submitChat()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    <script>
    var P_DATA = ${JSON.stringify({ name: p.name, title: p.title, bio: p.bio || p.summary || p.tagline, skills: p.skills, projects: p.projects, email: p.email, github: p.github, linkedin: p.linkedin })};
    function askPrompt(q) {
      var th = document.getElementById('asThread');
      var u = document.createElement('div'); u.className = 'as-msg user';
      u.innerHTML = '<div class="bubble">' + q + '</div>'; th.appendChild(u);
      var b = document.createElement('div'); b.className = 'as-msg bot';
      var ans = 'I can help with that! ';
      if (/project/i.test(q)) {
        ans = '<p>Here are projects shipped by ' + P_DATA.name + ':</p><ul>' + (P_DATA.projects || []).map(function(p){ return '<li><b>' + p.title + '</b> - ' + (p.desc || '') + '</li>'; }).join('') + '</ul>';
      } else if (/skill/i.test(q)) {
        ans = '<p>Core technical skills:</p><div class="tags">' + (P_DATA.skills || []).map(function(s){ return '<span class="tag">' + s + '</span>'; }).join('') + '</div>';
      } else if (/contact|hire/i.test(q)) {
        ans = '<p>Reach out to ' + P_DATA.name + ' directly: <a href="mailto:' + (P_DATA.email || '') + '">' + (P_DATA.email || '') + '</a></p>';
      } else {
        ans = '<p><b>' + P_DATA.name + '</b> — ' + (P_DATA.title || '') + '</p><p>' + (P_DATA.bio || '') + '</p>';
      }
      b.innerHTML = '<div class="av"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div><div class="body">' + ans + '</div>';
      th.appendChild(b);
      document.getElementById('asScroll').scrollTop = document.getElementById('asScroll').scrollHeight;
    }
    function submitChat() {
      var inp = document.getElementById('asInput');
      if (inp && inp.value.trim()) { var val = inp.value; inp.value = ''; askPrompt(val); }
    }
    </script>
  </body></html>`;
}

function pageConsole(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Systems Engineer');
  const email = esc(p.email || '');
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const projects = Array.isArray(p.projects) ? p.projects : [];

  return `<!DOCTYPE html><html lang="en">${head(p, 'console')}<body class="portfolio-view" data-template="console">
    <div class="cs-top">
      <a href="/" class="cs-brand"><span class="cs-logo">&lt;/&gt;</span>${name}</a>
      <a href="${ORIGIN}/" class="btn btn-ghost btn-sm" style="margin-left:auto;font-size:12px">Make yours</a>
    </div>
    <main style="max-width:1100px;margin:20px auto;padding:0 20px 60px">
      <div class="cs-hero" id="whoami">
        <div class="cs-mini-term">
          <div class="cs-mini-line">user@portfoolio:~$ whoami</div>
          <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);margin:14px 0 6px">${name}</h1>
          <p style="color:var(--cs-muted);font-size:1.1rem">${title}</p>
        </div>
      </div>
      <div class="cs-section">
        <h2>$ cat skills.json</h2>
        <div class="cs-pills">${skills.map(s => `<span>✦ ${esc(s)}</span>`).join('')}</div>
      </div>
      <div class="cs-section">
        <h2>$ ls ./projects/</h2>
        <div class="cs-grid">
          ${projects.map(pr => `<div class="cs-card"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc || '')}</p></div>`).join('')}
        </div>
      </div>
    </main>
    ${foot(p)}
  </body></html>`;
}

function pageSnowcard(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Product Developer');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, crafting web applications with bold design and clean code.`);
  const email = esc(p.email || '');
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const projects = Array.isArray(p.projects) ? p.projects : [];

  return `<!DOCTYPE html><html lang="en">${head(p, 'snowcard')}<body class="portfolio-view" data-template="snowcard">
    <div class="sc-page">
      <div class="sc-hero">
        <div class="sc-intro">
          <h1>${name}</h1>
          <h2>${title}</h2>
        </div>
        <div class="sc-photo">${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}</div>
      </div>
      <div class="sc-card">
        <h2>About</h2>
        <p>${bio}</p>
      </div>
      <div class="sc-card">
        <h2>Skills</h2>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${skills.map(s => `<span style="background:var(--sc-yellow);color:#050505;font-weight:800;padding:6px 14px;border:2px solid #000;border-radius:6px">✦ ${esc(s)}</span>`).join('')}
        </div>
      </div>
      <div class="sc-card">
        <h2>Projects</h2>
        ${projects.map(pr => `<div style="margin-bottom:18px"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc || '')}</p></div>`).join('')}
      </div>
    </div>
    ${foot(p)}
  </body></html>`;
}

function pageParchment(p) {
  const name = esc(p.name || 'Scholar');
  const title = esc(p.title || 'Writer & Technologist');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, crafting enduring works through thoughtful engineering and classical design.`);
  const email = esc(p.email || '');
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  return `<!DOCTYPE html><html lang="en">${head(p, 'parchment')}<body class="portfolio-view" data-template="parchment">
    <div class="pa-desk"></div>
    <div class="pa-scroll">
      <div class="pa-rod"><span class="knob l"></span><span class="knob r"></span></div>
      <div class="pa-paper"><div class="pa-paper-in">
        <header class="pa-hero">
          <h1 class="pa-name">${name}</h1>
          <div class="pa-title">${title}</div>
          <p class="pa-quote">${bio}</p>
        </header>
        <div class="pa-divider"><i></i><span>❧</span><i></i></div>
        <div class="pa-tags">${skills.map(s => `<span class="pa-tag">${esc(s)}</span>`).join('')}</div>
      </div></div>
      <div class="pa-rod"><span class="knob l"></span><span class="knob r"></span></div>
    </div>
    ${foot(p)}
  </body></html>`;
}






function pageEditor(p) {
  const name = esc(p.name || 'Developer');
  const nameParts = (p.name || 'Developer').trim().split(' ');
  const firstName = esc(nameParts[0] || 'Developer');
  const lastName = esc(nameParts.slice(1).join(' ') || '');
  const title = esc(p.title || 'Software Engineer');
  const bio = esc(p.bio || p.summary || p.tagline || 'Crafting intelligent solutions through modern software engineering and exceptional user experiences.');
  const location = esc(p.location || 'Worldwide');
  const email = esc(p.email || '');
  const phone = esc(p.phone || '');
  const slug = esc((p.slug || firstName).toLowerCase().replace(/[^a-z0-9]/g, '-'));

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const ghUser = p.github_username || (p.github ? p.github.replace(/^https?:\/\/github\.com\//, '').replace(/\/.*$/, '') : '');

  const projectsHtml = projects.map((pr, i) => {
    const num = String(i + 1).padStart(2, '0');
    const prTitle = esc(pr.title || pr.name || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Full stack software engineering project.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const prGh = pr.github ? esc(pr.github) : (prUrl.includes('github.com') ? esc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const fileName = prTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.tsx';

    return `
      <article class="ed-pcard">
        <div class="ed-pcard-bar">
          <span class="dots"><i></i><i></i><i></i></span>
          <span class="fn">${esc(fileName)}</span>
          <span class="idx">${num}</span>
        </div>
        <div class="ed-pcard-body">
          ${techs.length ? `<div class="ed-cat">${esc(techs[0].toUpperCase())}</div>` : ''}
          <h3>${prTitle}</h3>
          <p>${prDesc}</p>
          ${techs.length ? `<div class="ed-chips" style="margin-bottom:12px">${techs.map(t => `<span class="ed-chip" style="font-size:11px;padding:3px 8px">${esc(t)}</span>`).join('')}</div>` : ''}
          <div class="ed-pcard-links">
            ${prGh ? `<a class="ed-plink" href="${prGh}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
            ${prDemo ? `<a class="ed-plink primary" href="${prDemo}" target="_blank" rel="noopener">Live Demo ↗</a>` : (prUrl !== '#' && !prGh ? `<a class="ed-plink primary" href="${esc(prUrl)}" target="_blank" rel="noopener">View Project ↗</a>` : '')}
          </div>
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const dateStr = esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent');
    const role = esc(e.role || e.title || 'Engineer');
    const company = esc(e.company || e.organization || '');
    const bullets = (e.bullets || e.achievements || []);
    return `
      <div class="ed-tl-item">
        <div class="ed-tl-date">${dateStr}</div>
        <div>
          <h3>${role} ${company ? `<span class="at">· ${company}</span>` : ''}</h3>
          ${e.location ? `<div style="color:var(--ed-faint);font-size:12px;margin:2px 0 6px;">${esc(e.location)}</div>` : ''}
          ${e.desc ? `<p style="color:var(--ed-dim);font-size:13px;line-height:1.6;margin:0 0 6px;">${esc(e.desc)}</p>` : ''}
          ${bullets.length ? `
            <ul style="margin:6px 0 0;padding-left:18px;color:var(--ed-dim);font-size:12.5px;line-height:1.6;">
              ${bullets.map(b => `<li style="margin-bottom:4px">${esc(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="ed-edu">
      <h3>${esc(ed.institution || ed.school || 'University')}</h3>
      <div class="deg">${esc(ed.degree || ed.area || 'Degree')}</div>
      <div class="meta">${esc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')} ${ed.score ? `· ${esc(ed.score)}` : ''}</div>
    </div>
  `).join('');

  const portfolioJson = JSON.stringify({
    fname: firstName,
    name: p.name || 'Developer',
    title: p.title || 'Software Engineer',
    bio: p.bio || p.summary || p.tagline || '',
    email: p.email || '',
    phone: p.phone || '',
    skills: skills,
    projects: projects,
    experience: rawExp,
    education: education,
    github: p.github || '',
    linkedin: p.linkedin || ''
  }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html><html lang="en">${head(p, 'editor')}<body class="portfolio-view" data-template="editor">
    <div class="ed-app">
      <!-- Title bar -->
      <div class="ed-titlebar">
        <div class="ed-lights"><span class="r"></span><span class="y"></span><span class="g"></span></div>
        <div class="ed-menu"><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span>Help</span></div>
        <div class="ed-cmdpill"><span class="dot">●</span> ${slug} : portfolio <span class="kbd">⌘P</span></div>
      </div>

      <div class="ed-body">
        <!-- Activity bar -->
        <div class="ed-activity">
          <span class="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M8.4 7.5 15.6 8.4M8 17l8-6"/></svg></span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg></span>
        </div>

        <!-- Explorer -->
        <nav class="ed-explorer">
          <div class="ed-explorer-title">EXPLORER · PORTFOLIO</div>
          <a class="ed-file active" data-target="home"><span class="fi fi-tsx">⚛</span> home.tsx</a>
          <a class="ed-file" data-target="about"><span class="fi fi-html">&lt;&gt;</span> about.html</a>
          ${projects.length ? '<a class="ed-file" data-target="projects"><span class="fi fi-js">JS</span> projects.js</a>' : ''}
          ${skills.length ? '<a class="ed-file" data-target="skills"><span class="fi fi-json">{ }</span> skills.json</a>' : ''}
          ${rawExp.length ? '<a class="ed-file" data-target="experience"><span class="fi fi-ts">TS</span> experience.ts</a>' : ''}
          ${ghUser ? '<a class="ed-file" data-target="opensource"><span class="fi fi-md">M↓</span> opensource.md</a>' : ''}
          ${education.length ? '<a class="ed-file" data-target="education"><span class="fi fi-json">🎓</span> education.json</a>' : ''}
          <a class="ed-file" data-target="contact"><span class="fi fi-css">#</span> contact.css</a>
          <div class="ed-explorer-spacer"></div>
          <div class="ed-explorer-foot">
            <div class="ed-copilot-chip">✦ ${firstName}'s Copilot <span style="margin-left:auto;opacity:.7;">open ✓</span></div>
          </div>
        </nav>

        <!-- Editor Area -->
        <div class="ed-editor">
          <div class="ed-tabs">
            <div class="ed-tab active" data-target="home"><span class="fi fi-tsx">⚛</span> home.tsx</div>
            <div class="ed-tab" data-target="about"><span class="fi fi-html">&lt;&gt;</span> about.html</div>
            ${projects.length ? '<div class="ed-tab" data-target="projects"><span class="fi fi-js">JS</span> projects.js</div>' : ''}
          </div>
          <div class="ed-breadcrumb">${slug} <span class="sep">›</span> src <span class="sep">›</span> home.tsx</div>

          <div class="ed-scroll" id="ed-scroll">
            <div class="ed-content">
              <!-- HOME / HERO -->
              <section class="ed-section" id="home">
                <div class="ed-comment">// hello world !! Welcome to my portfolio</div>
                <h1 class="ed-name"><span class="first">${firstName}</span>${lastName ? `<span class="last">${lastName}</span>` : ''}</h1>
                <div class="ed-pills">
                  <span class="ed-pill"><span class="d"></span>${title}</span>
                  <span class="ed-pill accent"><span class="d"></span>${location}</span>
                </div>
                <div class="ed-tagline">${bio}</div>
                <div class="ed-actions">
                  ${projects.length ? '<a class="ed-btn primary" data-target="projects">📁 Projects</a>' : ''}
                  <a class="ed-btn" data-target="about">👤 About Me</a>
                  <a class="ed-btn" data-target="contact">✉ Contact</a>
                </div>

                <div class="ed-stats">
                  <div class="ed-stat"><div class="v">${rawExp.length || 1}+</div><div class="l">EXPERIENCES</div></div>
                  <div class="ed-stat"><div class="v">${projects.length || 1}+</div><div class="l">PROJECTS</div></div>
                  <div class="ed-stat"><div class="v">${skills.length || 8}+</div><div class="l">SKILLS</div></div>
                  <div class="ed-stat"><div class="v">∞</div><div class="l">CURIOSITY</div></div>
                </div>
              </section>

              <!-- ABOUT -->
              <section class="ed-section" id="about">
                <div class="ed-comment">&lt;!-- about.html · ${name} --&gt;</div>
                <h2 class="ed-h">About Me</h2>
                <div class="ed-subcomment">// who I am · what I do · where I build</div>
                <div class="ed-box">${bio}</div>
              </section>

              <!-- PROJECTS -->
              ${projects.length ? `
                <section class="ed-section" id="projects">
                  <div class="ed-comment">// projects.js : things I've built &amp; shipped</div>
                  <h2 class="ed-h">Projects</h2>
                  <div class="ed-subcomment">const projects = [ ...shipped, ...building ]</div>
                  <div class="ed-cards">${projectsHtml}</div>
                </section>
              ` : ''}

              <!-- SKILLS -->
              ${skills.length ? `
                <section class="ed-section" id="skills">
                  <div class="ed-comment">// skills.json</div>
                  <h2 class="ed-h">Skills</h2>
                  <div class="ed-subcomment">const proficiency = { ... }</div>
                  <div class="ed-chips">
                    ${skills.map(s => `<span class="ed-chip">${esc(s)}</span>`).join('')}
                  </div>
                </section>
              ` : ''}

              <!-- EXPERIENCE -->
              ${rawExp.length ? `
                <section class="ed-section" id="experience">
                  <div class="ed-comment">// experience.ts</div>
                  <h2 class="ed-h">Experience</h2>
                  <div class="ed-tl">${expHtml}</div>
                </section>
              ` : ''}

              <!-- OPEN SOURCE / GITHUB -->
              ${ghUser ? `
                <section class="ed-section" id="opensource">
                  <div class="ed-comment">// opensource.md : contributions &amp; commits</div>
                  <h2 class="ed-h">Open Source</h2>
                  <div class="ed-subcomment">git log --author="${esc(ghUser)}"</div>
                  <div class="ed-contrib" style="overflow-x:auto;padding:12px 0;">
                    <img src="https://ghchart.rshah.org/569cd6/${encodeURIComponent(ghUser)}" alt="${name}'s GitHub contributions" loading="lazy" style="max-width:100%;filter:hue-rotate(180deg) saturate(1.8);">
                  </div>
                </section>
              ` : ''}

              <!-- EDUCATION -->
              ${education.length ? `
                <section class="ed-section" id="education">
                  <div class="ed-comment">// education</div>
                  <h2 class="ed-h">Education</h2>
                  <div class="ed-edu-grid">${eduHtml}</div>
                </section>
              ` : ''}

              <!-- CONTACT -->
              <section class="ed-section" id="contact">
                <div class="ed-comment">/* contact.css */</div>
                <h2 class="ed-h">Get in touch</h2>
                <div class="ed-subcomment">.contact { display: let's-talk; }</div>
                <div class="ed-actions">
                  ${email ? `<a class="ed-btn primary" href="mailto:${email}">✉ ${email}</a>` : ''}
                  ${phone ? `<a class="ed-btn" href="tel:${phone}">☎ ${phone}</a>` : ''}
                </div>
                <div class="ed-socials">
                  ${p.github ? `<a class="ed-soc" href="${esc(p.github)}" target="_blank" rel="noopener" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
                  ${p.linkedin ? `<a class="ed-soc" href="${esc(p.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>` : ''}
                  ${p.website ? `<a class="ed-soc" href="${esc(p.website)}" target="_blank" rel="noopener" title="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a>` : ''}
                </div>
                <div style="margin-top:40px;color:var(--ed-faint);font-size:12px;">// Built by ${name} via Portfoolio</div>
              </section>
            </div>
          </div>
        </div>

        <!-- Copilot panel -->
        <aside class="ed-copilot">
          <div class="ed-copilot-head">✦ ${firstName}'s AI Assistant <span class="ed-copilot-live">● online</span></div>
          <div class="ed-copilot-ws">WORKSPACE<br><span class="b">● portfolio · ${slug}</span></div>
          <div class="ed-copilot-body" id="ed-chat">
            <div class="ed-msg">
              <div class="av"></div>
              <div class="tx">Hi! I'm ${firstName}'s AI assistant. Ask me about ${firstName}'s <b>skills</b>, <b>projects</b>, <b>experience</b> or how to get in <b>touch</b>. ✨</div>
            </div>
          </div>
          <div class="ed-suggest" id="ed-suggest">
            <button type="button" class="ed-chip-q" data-q="What are the top skills?">Top skills</button>
            <button type="button" class="ed-chip-q" data-q="Tell me about the projects">Projects</button>
            <button type="button" class="ed-chip-q" data-q="What is the work experience?">Experience</button>
            <button type="button" class="ed-chip-q" data-q="How can I contact?">Contact</button>
          </div>
          <form class="ed-copilot-input" id="ed-chat-form" autocomplete="off">
            <input id="ed-chat-input" placeholder="Ask about ${firstName}…" aria-label="Ask the assistant">
            <button type="submit" aria-label="Send">➤</button>
          </form>
        </aside>
      </div>

      <!-- Status bar -->
      <div class="ed-status">
        <span class="seg">⎇ main</span>
        <span class="seg">◷ ${name}'s Portfolio</span>
        <span class="right">
          <span class="seg">✦ Copilot</span>
          <span class="seg">UTF-8</span>
          <span class="seg">Prettier</span>
          <span class="seg">${firstName} Dark</span>
          <span class="seg" id="ed-clock">10:50</span>
        </span>
      </div>
    </div>

    <script id="ed-portfolio-data" type="application/json">${portfolioJson}</script>
    <script>
    (function () {
      var clock = document.getElementById('ed-clock');
      function tick() { if (clock) { var d = new Date(); clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); } }
      tick(); setInterval(tick, 15000);

      var scroller = document.getElementById('ed-scroll');
      function go(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      document.querySelectorAll('[data-target]').forEach(function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); go(a.getAttribute('data-target')); });
      });

      var files = {}; document.querySelectorAll('.ed-file[data-target]').forEach(function (f) { files[f.getAttribute('data-target')] = f; });
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting && files[en.target.id]) {
              document.querySelectorAll('.ed-file').forEach(function (f) { f.classList.remove('active'); });
              files[en.target.id].classList.add('active');
            }
          });
        }, { root: scroller && scroller.clientHeight ? scroller : null, rootMargin: '-30% 0px -60% 0px' });
        document.querySelectorAll('.ed-section').forEach(function (s) { if (files[s.id]) obs.observe(s); });
      }

      var dataEl = document.getElementById('ed-portfolio-data');
      if (!dataEl) return;
      var P; try { P = JSON.parse(dataEl.textContent); } catch (e) { return; }
      var chat = document.getElementById('ed-chat');
      var form = document.getElementById('ed-chat-form');
      var input = document.getElementById('ed-chat-input');
      var suggest = document.getElementById('ed-suggest');
      if (!chat || !form || !input) return;

      function el(cls, html) { var d = document.createElement('div'); d.className = cls; if (html != null) d.innerHTML = html; return d; }
      function escStr(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
      function addUser(t) { var m = el('ed-msg ed-msg-user'); m.appendChild(el('tx', escStr(t))); chat.appendChild(m); chat.scrollTop = chat.scrollHeight; }
      function addBot(t) { var m = el('ed-msg'); m.appendChild(el('av')); var tx = el('tx'); tx.innerHTML = escStr(t).replace(/\n/g, '<br>'); m.appendChild(tx); chat.appendChild(m); chat.scrollTop = chat.scrollHeight; }

      function reply(q) {
        q = (q || '').toLowerCase();
        if (/\b(hi|hello|hey|yo)\b/.test(q)) return "Hey! 👋 Ask me about " + P.fname + "'s skills, projects, experience or contact.";
        if (/skill|tech|stack|language|tool|know|expert/.test(q)) {
          if (!P.skills || !P.skills.length) return "No skills are listed yet.";
          return P.fname + " works with: " + P.skills.slice(0, 15).join(", ") + ".";
        }
        if (/project|built|build|ship|made|app|portfolio/.test(q)) {
          if (!P.projects || !P.projects.length) return "No projects are listed yet.";
          return "Here are some highlights:\n" + P.projects.slice(0, 4).map(function (pr) { return "• " + (pr.title || pr.name || 'Project') + (pr.desc || pr.description ? " — " + (pr.desc || pr.description) : ""); }).join("\n");
        }
        if (/experience|work|job|role|company|career/.test(q)) {
          if (!P.experience || !P.experience.length) return "No experience is listed yet.";
          return P.experience.slice(0, 4).map(function (e) { return "• " + (e.role || e.title || 'Role') + (e.company ? " @ " + e.company : "") + (e.dates || e.year ? " (" + (e.dates || e.year) + ")" : ""); }).join("\n");
        }
        if (/education|study|degree|college|university/.test(q)) {
          if (!P.education || !P.education.length) return "No education is listed yet.";
          return P.education.map(function (e) { return "• " + (e.institution || e.school || 'University') + (e.degree ? " — " + e.degree : ""); }).join("\n");
        }
        if (/contact|email|reach|hire|touch|connect|phone/.test(q)) {
          var parts = [];
          if (P.email) parts.push("✉ " + P.email);
          if (P.phone) parts.push("☎ " + P.phone);
          if (P.github) parts.push("GitHub: " + P.github);
          if (P.linkedin) parts.push("LinkedIn: " + P.linkedin);
          return parts.length ? ("Here's how to reach " + P.fname + ":\n" + parts.join("\n")) : "Contact details aren't listed yet.";
        }
        if (/who|about|yourself|summary|bio/.test(q)) return P.bio || (P.name + " — check the explorer tabs for more.");
        return "I can assist with " + P.fname + "'s skills, projects, experience, education or contact details. Try clicking one of the chips below 👇";
      }

      function ask(q) {
        if (!q) return;
        addUser(q);
        setTimeout(function () { addBot(reply(q)); }, 350);
      }
      form.addEventListener('submit', function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = ''; ask(q); });
      if (suggest) suggest.addEventListener('click', function (e) { var b = e.target.closest('.ed-chip-q'); if (!b) return; ask(b.getAttribute('data-q')); });
    })();
    </script>
    ${foot(p)}
  </body></html>`;
}


function pageMonolith(p) {
  const name = esc(p.name || 'Developer');
  const nameParts = (p.name || 'Developer').trim().split(' ');
  const firstName = esc(nameParts[0] || 'DEV');
  const lastName = esc(nameParts.slice(1).join(' ') || 'ENGINEER');
  const title = esc(p.title || 'Full Stack Engineer');
  const bio = esc(p.bio || p.summary || p.tagline || 'Transforming ideas into scalable high-impact digital solutions with modern software architecture.');
  const location = esc(p.location || 'Worldwide');
  const email = esc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const topSkills = skills.slice(0, 4);

  const skillsHtml = skills.map(s => `
    <span class="mo-skill">✦ ${esc(s)}</span>
  `).join('');

  const projectsHtml = projects.map((pr, i) => {
    const num = String(i + 1).padStart(2, '0');
    const prTitle = esc(pr.title || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Full stack engineering project built with scalable architecture and high performance.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);

    return `
      <article class="mo-project">
        <div class="mo-project-num">${num}</div>
        <div>
          <h3>${prTitle}</h3>
          ${techs.length ? `<div class="mo-kicker">${techs.map(t => esc(t)).join(', ')}</div>` : ''}
          <p>${prDesc}</p>
        </div>
        <div class="mo-project-links">
          ${prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
          ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">Live ↗</a>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => `
    <article class="mo-exp">
      <div class="mo-exp-date">${esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</div>
      <div>
        <h3>${esc(e.role || e.title || 'Engineer')} / ${esc(e.company || e.organization || '')}</h3>
        ${e.location ? `<div class="mo-kicker">${esc(e.location)}</div>` : ''}
        ${e.desc ? `<p style="margin:10px 0 0;color:#4b5563;font-weight:600">${esc(e.desc)}</p>` : ''}
        ${(e.bullets || e.achievements || []).length ? `
          <ul>${(e.bullets || e.achievements).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        ` : ''}
      </div>
    </article>
  `).join('');

  const eduHtml = education.map(ed => `
    <article class="mo-card">
      <div class="mo-card-type">Education</div>
      <h3>${esc(ed.institution || ed.school || 'University')}</h3>
      <p style="font-weight:700;color:var(--mo-ink)">${esc(ed.degree || ed.area || 'Degree')}</p>
      <p>${esc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')}</p>
    </article>
  `).join('');

  return `<!DOCTYPE html><html lang="en">${head(p, 'monolith')}<body class="portfolio-view" data-template="monolith">
    <header class="mo-nav">
      <a href="#home" class="mo-mark"><span>${firstName}</span><b>${lastName}</b></a>
      <nav>
        ${skills.length ? '<a href="#skills">Skills</a>' : ''}
        ${projects.length ? '<a href="#projects">Projects</a>' : ''}
        <a href="#about">About</a>
        ${rawExp.length ? '<a href="#experience">Experience</a>' : ''}
        <a href="#contact">Contact</a>
      </nav>
      <div class="mo-nav-side">
        ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
        ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
        ${email ? `<a href="mailto:${email}">Email</a>` : ''}
      </div>
    </header>

    <main class="mo-main">
      <section class="mo-hero" id="home">
        <div class="mo-sideword">Explore Work</div>
        <div class="mo-hero-copy">
          <h1><span>${firstName}</span><span>${lastName}</span></h1>
          <div class="mo-role">${title}</div>
          <p>${bio}</p>
          <div class="mo-stats">
            ${projects.length ? `<span>${projects.length}+ Projects</span>` : ''}
            ${skills.length ? `<span>${skills.length} Skills</span>` : ''}
            <span>${location}</span>
          </div>
        </div>
        <div class="mo-portrait">
          ${photo ? `<img src="${esc(photo)}" alt="${name}">` : `<span>${firstName.charAt(0)}</span>`}
        </div>
      </section>

      ${topSkills.length ? `
        <section class="mo-strip">
          ${topSkills.map(s => `<span>${esc(s)}</span>`).join('')}
        </section>
      ` : ''}

      <section class="mo-section mo-about" id="about">
        <div class="mo-label">About / Overview</div>
        <p>${bio}</p>
      </section>

      ${skills.length ? `
        <section class="mo-section" id="skills">
          <div class="mo-head"><span>01</span><h2>Skills &amp; Stack</h2></div>
          <div class="mo-skills">${skillsHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="mo-section" id="projects">
          <div class="mo-head"><span>02</span><h2>Selected Projects</h2></div>
          <div class="mo-projects">${projectsHtml}</div>
        </section>
      ` : ''}

      ${rawExp.length ? `
        <section class="mo-section" id="experience">
          <div class="mo-head"><span>03</span><h2>Experience</h2></div>
          <div class="mo-timeline">${expHtml}</div>
        </section>
      ` : ''}

      ${education.length ? `
        <section class="mo-section">
          <div class="mo-head"><span>04</span><h2>Credentials</h2></div>
          <div class="mo-cardgrid">${eduHtml}</div>
        </section>
      ` : ''}

      <section class="mo-section mo-contact" id="contact">
        <div class="mo-head"><span>05</span><h2>Contact</h2></div>
        <p>Have a role, project, or technical challenge in mind?</p>
        <div class="mo-contact-links">
          ${email ? `<a href="mailto:${email}">✉ Email Me (${email})</a>` : ''}
          ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">🐙 GitHub</a>` : ''}
          ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn</a>` : ''}
          ${p.website ? `<a href="${esc(p.website)}" target="_blank" rel="noopener">🌐 Website</a>` : ''}
        </div>
      </section>
    </main>

    ${foot(p)}
  </body></html>`;
}

function pagePanels(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Full Stack Engineer');
  const tagline = esc(p.tagline || 'Crafting clean, accessible, and high-performance digital experiences.');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, a detail-oriented software developer building scalable digital products and robust modern web architectures.`);
  const location = esc(p.location || 'Remote / Worldwide');
  const email = esc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const skillPillsHtml = skills.map(s => `
    <span class="pn-pill">✦ ${esc(s)}</span>
  `).join('');

  const expHtml = rawExp.map(e => `
    <div class="pn-exp">
      <div class="pn-exp-top">
        <div class="pn-exp-org">
          <div class="pn-exp-logo">${esc((e.company || e.organization || 'E').slice(0, 2).toUpperCase())}</div>
          <div>
            <h3>${esc(e.company || e.organization || '')}</h3>
            <div class="pn-exp-role">${esc(e.role || e.title || 'Engineer')}</div>
          </div>
        </div>
        <div class="pn-exp-date">${esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</div>
      </div>
      ${e.desc ? `<p style="margin:14px 0 0;color:var(--pn-dim)">${esc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <ul class="pn-plus">${(e.bullets || e.achievements).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `).join('');

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = esc(pr.title || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Full stack application built with modern architecture and best practices.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const img = pr.image || pr.img || '';

    return `
      <div class="pn-proj">
        ${img ? `<div class="pn-proj-bg"><img src="${esc(img)}" alt="${prTitle}"></div>` : ''}
        <div class="pn-proj-links">
          ${prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener" title="Source Code"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
          ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" title="Live Preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>` : ''}
        </div>
        <h3>${prTitle}</h3>
        <p>${prDesc}</p>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="pn-edu">
      <div class="pn-edu-top">
        <div>
          <h3>${esc(ed.institution || ed.school || 'University')}</h3>
          <div class="deg">${esc(ed.degree || ed.area || 'Degree')}</div>
        </div>
        <div class="meta">${esc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')}</div>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html><html lang="en">${head(p, 'panels')}<body class="portfolio-view" data-template="panels">
    <header class="pn-hero">
      <div class="pn-wrap">
        <div class="pn-hero-top">
          <div class="pn-brand">${name}</div>
          <button type="button" class="pn-hero-badge" id="pnThemeBtn" aria-label="Toggle theme" title="Toggle dark mode" onclick="document.body.classList.toggle('pn-dark');document.documentElement.classList.toggle('pn-dark')">
            <svg class="pn-i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="pn-i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
        </div>
        <div class="pn-hi">Hello, I'm</div>
        <h1 class="pn-name">${name}</h1>
        <div class="pn-tagline">${tagline}</div>
      </div>
    </header>

    <div class="pn-shell">
      <div class="pn-card">
        <div class="pn-tabs" id="pnTabs">
          <button class="pn-tab on" data-tab="who"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Who am I?</button>
          ${skills.length ? '<button class="pn-tab" data-tab="skills"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 9-3 3 3 3M16 9l3 3-3 3"/></svg> Superpowers</button>' : ''}
          ${rawExp.length ? '<button class="pn-tab" data-tab="exp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> Experience</button>' : ''}
          ${projects.length ? '<button class="pn-tab" data-tab="proj"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 6 6M15 9l-6 6"/></svg> Projects</button>' : ''}
          ${education.length ? '<button class="pn-tab" data-tab="edu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg> Academic Path</button>' : ''}
          <button class="pn-tab" data-tab="contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Let\'s Talk</button>
        </div>

        <div class="pn-content">
          <section class="pn-panel on" data-tab="who">
            <div class="pn-whohead">
              ${photo ? `<img class="pn-photo" src="${esc(photo)}" alt="${name}">` : `<div class="pn-photo ph">${name.charAt(0)}</div>`}
              <div>
                <h2 style="margin:0;font-size:1.7rem;font-weight:800;">Who Am I?</h2>
                <div style="color:var(--pn-blue);font-weight:600;margin-top:4px">${title}</div>
              </div>
            </div>
            <div class="pn-status">
              <span class="pn-stat"><span class="dot"></span> Available for work</span>
              ${location ? `<span class="pn-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg> ${location}</span>` : ''}
            </div>
            <div class="pn-prose">
              <p>${bio}</p>
            </div>
            <div class="pn-cta">
              ${email ? `<a class="pn-btn pn-btn-dark" href="mailto:${email}">Get in Touch →</a>` : ''}
              <button type="button" class="pn-btn pn-btn-light" onclick="pnGo('proj')">View Projects</button>
            </div>
          </section>

          ${skills.length ? `
            <section class="pn-panel" data-tab="skills">
              <div class="pn-panel-head">
                <span class="pn-panel-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 9-3 3 3 3M16 9l3 3-3 3"/></svg></span>
                <h2>My Superpowers</h2>
              </div>
              <p class="pn-intro">Technologies, tools, and specialized capabilities I use to build scalable products:</p>
              <div class="pn-skill-pills">${skillPillsHtml}</div>
            </section>
          ` : ''}

          ${rawExp.length ? `
            <section class="pn-panel" data-tab="exp">
              <div class="pn-panel-head">
                <span class="pn-panel-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>
                <h2>Work Experience</h2>
              </div>
              ${expHtml}
            </section>
          ` : ''}

          ${projects.length ? `
            <section class="pn-panel" data-tab="proj">
              <div class="pn-panel-head">
                <span class="pn-panel-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 6 6M15 9l-6 6"/></svg></span>
                <h2>Featured Projects</h2>
              </div>
              <div class="pn-proj-grid">${projectsHtml}</div>
            </section>
          ` : ''}

          ${education.length ? `
            <section class="pn-panel" data-tab="edu">
              <div class="pn-panel-head">
                <span class="pn-panel-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg></span>
                <h2>Academic Path</h2>
              </div>
              ${eduHtml}
            </section>
          ` : ''}

          <section class="pn-panel" data-tab="contact">
            <div class="pn-panel-head">
              <span class="pn-panel-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
              <h2>Let's Talk</h2>
            </div>
            <form class="pn-form" onsubmit="event.preventDefault(); var em='${email}'; var m=document.getElementById('pnMsg')?document.getElementById('pnMsg').value:''; if(em) location.href='mailto:'+em+'?subject=Project%20Inquiry&body='+encodeURIComponent(m);">
              <div class="field">
                <label>Your Message <span class="req">*</span></label>
                <textarea id="pnMsg" class="pn-textarea" placeholder="Tell me about your project, idea, or role..." required></textarea>
              </div>
              <button type="submit" class="pn-btn pn-btn-dark">Send Message via Email</button>
            </form>
          </section>
        </div>
      </div>
    </div>

    <footer class="pn-footer">
      <div class="pn-wrap">
        <div class="pn-footer-grid">
          <div>
            <h3>${name}</h3>
            <div class="sub">${title}</div>
            <div class="pn-footer-socs">
              ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
              ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
              ${p.website ? `<a href="${esc(p.website)}" target="_blank" rel="noopener">Website</a>` : ''}
              ${email ? `<a href="mailto:${email}">Email</a>` : ''}
            </div>
          </div>
          <div>
            ${foot(p)}
          </div>
        </div>
        <div class="pn-copy">© ${name} · Built with Portfoolio</div>
      </div>
    </footer>

    <script>
    function pnGo(tabId) {
      document.querySelectorAll('.pn-tab').forEach(function(t) { t.classList.toggle('on', t.getAttribute('data-tab') === tabId); });
      document.querySelectorAll('.pn-panel').forEach(function(p) { p.classList.toggle('on', p.getAttribute('data-tab') === tabId); });
    }
    var tabs = document.getElementById('pnTabs');
    if (tabs) {
      tabs.addEventListener('click', function(e) {
        var b = e.target.closest('.pn-tab');
        if (b) pnGo(b.getAttribute('data-tab'));
      });
    }
    </script>
  </body></html>`;
}

function pageParticle(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Full Stack & AI Engineer');
  const bio = esc(p.bio || p.summary || p.tagline || 'Transforming complex requirements into elegant, high-impact digital solutions through modern software architecture.');
  const email = esc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const mainSkills = skills.slice(0, 12);
  const extraSkills = skills.slice(12);

  const skillIcons = ['⚡', '🔮', '🚀', '🧠', '🌐', '🛡️', '⚙️', '📦', '💾', '🎨', '🧩', '💎'];

  const skillsHtml = mainSkills.map((s, idx) => `
    <article class="pt-skill-card">
      <div class="pt-sk-icon">${skillIcons[idx % skillIcons.length]}</div>
      <h3>${esc(s)}</h3>
    </article>
  `).join('');

  const expHtml = rawExp.map(e => `
    <article class="pt-exp-card">
      <h3>${esc(e.company || e.organization || 'Company')}</h3>
      <h4>${esc(e.role || e.title || 'Engineer')}</h4>
      ${e.desc ? `<p style="color:var(--pt-muted);margin:0 0 12px">${esc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <ul>${(e.bullets || e.achievements).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      ` : ''}
      <div class="pt-date">${esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')} ${e.location ? `· ${esc(e.location)}` : ''}</div>
    </article>
  `).join('');

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = esc(pr.title || `Project ${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Full stack engineering project built with scalable architecture and modern standards.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const img = pr.image || pr.img || '';

    return `
      <article class="pt-project">
        <div class="pt-project-shot">
          ${img ? `<img src="${esc(img)}" alt="${prTitle}" loading="lazy">` : `<span>${prTitle.slice(0, 2).toUpperCase()}</span>`}
        </div>
        <div class="pt-project-info">
          <h3>
            ${prTitle}
            ${prUrl !== '#' ? `<a href="${esc(prUrl)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">Live Demo ↗</a>` : ''}
          </h3>
          ${techs.length ? `<p class="stack">${techs.map(t => esc(t)).join(', ')}</p>` : ''}
          <p style="color:var(--pt-muted);margin:0 0 12px;line-height:1.6">${prDesc}</p>
        </div>
      </article>
    `;
  }).join('');

  return `<!DOCTYPE html><html lang="en">${head(p, 'particle')}<body class="portfolio-view" data-template="particle">
    <canvas id="pt-canvas" aria-hidden="true"></canvas>
    
    <header class="pt-nav">
      <a href="#home" class="pt-brand">${name}</a>
      <nav>
        <a href="#home">Home</a>
        ${skills.length ? '<a href="#skills">Skills</a>' : ''}
        ${rawExp.length ? '<a href="#experience">Experience</a>' : ''}
        ${projects.length ? '<a href="#projects">Projects</a>' : ''}
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main class="pt-main">
      <section class="pt-hero" id="home">
        <div class="pt-hero-card">
          <h1>I am<br><span>${title}</span></h1>
          <p>${bio}</p>
          <div class="pt-actions">
            <a class="hot" href="#projects">Projects</a>
            ${email ? `<a class="cool" href="mailto:${email}">Hire Me</a>` : '<a class="cool" href="#contact">Get in Touch</a>'}
          </div>
        </div>
        <div class="pt-photo-wrap">
          ${photo ? `<img src="${esc(photo)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
        </div>
      </section>

      ${skills.length ? `
        <section class="pt-section" id="skills">
          <h2>Technical Skills</h2>
          <div class="pt-skill-grid">${skillsHtml}</div>
          ${extraSkills.length ? `
            <div class="pt-extra">
              <div class="pt-extra-head"><h3>Additional Specialties</h3><span></span></div>
              <ul>${extraSkills.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </section>
      ` : ''}

      ${rawExp.length ? `
        <section class="pt-section" id="experience">
          <h2>Experience</h2>
          <div class="pt-exp-list">${expHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="pt-section" id="projects">
          <h2>Featured Projects</h2>
          <div class="pt-projects">${projectsHtml}</div>
        </section>
      ` : ''}

      <section class="pt-section pt-contact" id="contact">
        <h2>Contact Me</h2>
        <form onsubmit="event.preventDefault(); var em='${email}'; var sub=document.getElementById('pt-sub')?document.getElementById('pt-sub').value:'Portfolio'; var msg=document.getElementById('pt-msg')?document.getElementById('pt-msg').value:''; if(em) location.href='mailto:'+em+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(msg);">
          <label>Name<input id="pt-name" placeholder="Enter your name" required></label>
          <label>Email<input id="pt-email" type="email" placeholder="Enter your email" required></label>
          <label>Subject<input id="pt-sub" placeholder="Subject"></label>
          <label>Message<textarea id="pt-msg" placeholder="Your message here..." required></textarea></label>
          <button type="submit">Send Message</button>
        </form>

        <div class="pt-socials">
          ${email ? `<a href="mailto:${email}">✉ ${email}</a>` : ''}
          ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">🐙 GitHub</a>` : ''}
          ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn</a>` : ''}
          ${p.website ? `<a href="${esc(p.website)}" target="_blank" rel="noopener">🌐 Website</a>` : ''}
          ${p.twitter ? `<a href="${esc(p.twitter)}" target="_blank" rel="noopener">🐦 Twitter</a>` : ''}
        </div>
      </section>
    </main>

    ${foot(p)}

    <script>
    (function () {
      var canvas = document.getElementById('pt-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d'), w, h, pts = [];
      var reduce = (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
      function size() {
        w = canvas.width = window.innerWidth || 1200;
        h = canvas.height = window.innerHeight || 800;
        pts = [];
        var n = Math.min(80, Math.max(25, Math.round(w * h / 19000)));
        for (var i = 0; i < n; i++) pts.push({x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35});
      }
      function draw() {
        if (!ctx) return;
        ctx.clearRect(0,0,w,h);
        for (var i=0;i<pts.length;i++) {
          var p=pts[i]; if (!reduce) { p.x+=p.vx; p.y+=p.vy; }
          if (p.x<0 || p.x>w) p.vx *= -1; if (p.y<0 || p.y>h) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x,p.y,2.2,0,6.28); ctx.fillStyle='rgba(107,99,255,.75)'; ctx.fill();
          for (var j=i+1;j<pts.length;j++) { var q=pts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy); if (d<145) { ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle='rgba(125,145,180,'+(0.18*(1-d/145))+')'; ctx.stroke(); } }
        }
        if (!reduce) requestAnimationFrame(draw);
      }
      size(); window.addEventListener('resize', size); draw();
    })();
    </script>
  </body></html>`;
}

function pageGithub(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Software Engineer');
  const firstName = (p.name || '').trim().split(' ')[0] || 'developer';
  const username = esc(p.username || firstName.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const bio = esc(p.bio || p.summary || p.tagline || 'Building user-centric, high-performance applications and scalable distributed systems.');
  const location = esc(p.location || '');
  const email = esc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  let contribCells = '';
  let totalContribs = 0;
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const seed = ((w * 13 + d * 37 + username.length * 17) % 100) / 100;
      let lvl = 0;
      if (seed > 0.85) { lvl = 4; totalContribs += 7; }
      else if (seed > 0.70) { lvl = 3; totalContribs += 5; }
      else if (seed > 0.50) { lvl = 2; totalContribs += 3; }
      else if (seed > 0.30) { lvl = 1; totalContribs += 1; }
      contribCells += `<i class="gh-cell l${lvl}"></i>`;
    }
  }
  if (totalContribs < 120) totalContribs = 284;

  const langColors = ['#f1e05a', '#3572A5', '#e34c26', '#2b7489', '#41b883', '#00ADD8', '#b07219', '#178600'];

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = esc(pr.title || `Repository-${i+1}`);
    const prDesc = esc(pr.desc || pr.description || 'Public software project developed with modern web standards and high test coverage.');
    const prUrl = pr.url || pr.demoUrl || p.github || '#';
    const prDemo = pr.demoUrl ? esc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const mainLang = techs[0] || 'Code';
    const dotColor = langColors[i % langColors.length];

    return `
      <article class="gh-pin">
        <div class="gh-pin-top">
          <span class="gh-repo-ic">
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75H4.5a1 1 0 0 0 0 2h8.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 15V2.5zm10.5-1H4.5a1 1 0 0 0-1 1v9.05c.3-.1.65-.1 1-.1h8V1.5z"/></svg>
          </span>
          <a class="gh-repo-name" href="${esc(prUrl)}" ${prUrl !== '#' ? 'target="_blank" rel="noopener"' : ''}>${prTitle}</a>
          <span class="gh-pub sm">Public</span>
        </div>
        <p class="gh-pin-desc">${prDesc}</p>
        <div class="gh-pin-foot">
          <span class="gh-lang"><span class="gh-dot" style="--d:${dotColor}"></span>${esc(mainLang)}</span>
          ${prUrl !== '#' ? `<a class="gh-pin-link" href="${esc(prUrl)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> Code</a>` : ''}
          ${prDemo ? `<a class="gh-pin-link" href="${prDemo}" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M7.78 9.28a.75.75 0 0 1-1.06-1.06l3-3a2.5 2.5 0 0 1 3.54 3.54l-1.5 1.5a.75.75 0 1 1-1.06-1.06l1.5-1.5a1 1 0 1 0-1.42-1.42l-3 3zM8.22 6.72a.75.75 0 0 1 1.06 1.06l-3 3a2.5 2.5 0 0 1-3.54-3.54l1.5-1.5a.75.75 0 0 1 1.06 1.06l-1.5 1.5a1 1 0 1 0 1.42 1.42l3-3z"/></svg> Live</a>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => `
    <div class="gh-tl">
      <span class="gh-tl-node">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75H4.5a1 1 0 0 0 0 2h8.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 15V2.5zm10.5-1H4.5a1 1 0 0 0-1 1v9.05c.3-.1.65-.1 1-.1h8V1.5z"/></svg>
      </span>
      <div class="gh-tl-card">
        <h4>${esc(e.role || e.title || 'Engineer')} <span class="gh-at">@ ${esc(e.company || e.organization || '')}</span></h4>
        <div class="gh-tl-meta">${esc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')} ${e.location ? `· ${esc(e.location)}` : ''}</div>
        ${e.desc ? `<p style="margin:0 0 8px;color:#8b949e">${esc(e.desc)}</p>` : ''}
        ${(e.bullets || e.achievements || []).length ? `
          <ul>${(e.bullets || e.achievements).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        ` : ''}
      </div>
    </div>
  `).join('');

  const eduHtml = education.map(ed => `
    <div class="gh-card">
      <h4><svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 3H1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6z"/></svg> ${esc(ed.institution || ed.school || 'University')}</h4>
      <div class="gh-card-sub">${esc(ed.degree || ed.area || 'Degree')}</div>
      <div class="gh-card-meta">${esc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html><html lang="en">${head(p, 'github')}<body class="portfolio-view" data-template="github">
    <header class="gh-top">
      <div class="gh-top-in">
        <span class="gh-mark" aria-label="GitHub"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></span>
        <div class="gh-search">Search or jump to…</div>
        <nav class="gh-top-nav">
          <a href="#readme">Overview</a>
          <a href="#pinned">Repositories</a>
          <a href="#langs">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>

    <div class="gh-page">
      <aside class="gh-side">
        <div class="gh-avatar">
          ${photo ? `<img src="${esc(photo)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
        </div>
        <h1 class="gh-name">${name}</h1>
        <div class="gh-login">${username}</div>
        <div class="gh-headline">${title}</div>
        <div class="gh-side-actions">
          ${email ? `<a class="gh-btn gh-btn-primary" href="mailto:${email}">Follow</a>` : `<a class="gh-btn gh-btn-primary" href="#contact">Contact</a>`}
        </div>
        <p class="gh-bio">${bio}</p>
        <div class="gh-followers">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 5.5a3.5 3.5 0 1 1 5.9 2.54A5.01 5.01 0 0 1 11 12.5a.75.75 0 0 1-1.5 0 3.5 3.5 0 0 0-7 0 .75.75 0 0 1-1.5 0 5.01 5.01 0 0 1 3.1-4.46A3.49 3.49 0 0 1 2 5.5z"/></svg>
          <strong>${projects.length}</strong> repositories · <strong>${skills.length}</strong> skills
        </div>

        <ul class="gh-meta">
          ${location ? `<li><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 2.9 4.6 9.2 5 9.7.27.36.73.36 1 0 .4-.5 5-6.8 5-9.7A5.53 5.53 0 0 0 8 0zm0 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg> ${location}</li>` : ''}
          ${email ? `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> <a href="mailto:${email}">${email}</a></li>` : ''}
          ${p.linkedin ? `<li><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg> <a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>` : ''}
          ${p.github ? `<li><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> <a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a></li>` : ''}
          ${p.website ? `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg> <a href="${esc(p.website)}" target="_blank" rel="noopener">Website</a></li>` : ''}
        </ul>
      </aside>

      <main class="gh-main">
        <div class="gh-tabs">
          <a class="gh-tab on"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.5a2.25 2.25 0 0 1 2.25 2.25v9.5A.75.75 0 0 1 6.4 13a2.5 2.5 0 0 0-1.65-.6H1.5v-1.5h3.25c.6 0 1.16.15 1.65.42V3.25a.75.75 0 0 0-.75-.75H1.5V1.75H0zm8.6 11.25a.75.75 0 0 1-.85-.25V3.25A2.25 2.25 0 0 1 10 .999h4.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-3.25a2.5 2.5 0 0 0-1.65.6z"/></svg> Overview</a>
          <a class="gh-tab" href="#pinned"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75H4.5a1 1 0 0 0 0 2h8.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 15V2.5zm10.5-1H4.5a1 1 0 0 0-1 1v9.05c.3-.1.65-.1 1-.1h8V1.5z"/></svg> Repositories <span class="gh-count">${projects.length}</span></a>
        </div>

        <section class="gh-readme" id="readme">
          <div class="gh-readme-head">
            <span class="gh-file"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.5a2.25 2.25 0 0 1 2.25 2.25v9.5A.75.75 0 0 1 6.4 13a2.5 2.5 0 0 0-1.65-.6H1.5v-1.5h3.25c.6 0 1.16.15 1.65.42V3.25a.75.75 0 0 0-.75-.75H1.5V1.75H0zm8.6 11.25a.75.75 0 0 1-.85-.25V3.25A2.25 2.25 0 0 1 10 .999h4.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-3.25a2.5 2.5 0 0 0-1.65.6z"/></svg> ${username} / README.md</span>
            <span class="gh-pub">Public</span>
          </div>
          <div class="gh-readme-body">
            <h2>Hi 👋, I'm ${name}</h2>
            <p class="gh-readme-sub">${title}</p>
            <p>${bio}</p>
          </div>
        </section>

        <h3 class="gh-h3" id="pinned">Pinned</h3>
        <div class="gh-pins">
          ${projectsHtml || '<div class="gh-pin"><p class="gh-pin-desc">Projects repository coming soon.</p></div>'}
        </div>

        <section class="gh-contrib">
          <h3 class="gh-h3"><span id="gh-contrib-count">${totalContribs}</span> contributions in the last year</h3>
          <div class="gh-graph-wrap"><div class="gh-graph" id="gh-graph" aria-hidden="true">${contribCells}</div></div>
          <div class="gh-legend">Less <span class="gh-lc l0"></span><span class="gh-lc l1"></span><span class="gh-lc l2"></span><span class="gh-lc l3"></span><span class="gh-lc l4"></span> More</div>
        </section>

        ${skills.length ? `
          <h3 class="gh-h3" id="langs">Languages &amp; tools</h3>
          <div class="gh-langs">
            ${skills.map((s, idx) => `
              <span class="gh-lang-chip"><span class="gh-dot" style="--d:${langColors[idx % langColors.length]}"></span>${esc(s)}</span>
            `).join('')}
          </div>
        ` : ''}

        ${rawExp.length ? `
          <h3 class="gh-h3">Experience</h3>
          <div class="gh-timeline">${expHtml}</div>
        ` : ''}

        ${education.length ? `
          <h3 class="gh-h3">Education</h3>
          <div class="gh-cards">${eduHtml}</div>
        ` : ''}

        <section class="gh-contact" id="contact">
          <h3 class="gh-h3">Get in touch</h3>
          <div class="gh-contact-row">
            ${email ? `<a class="gh-btn gh-btn-primary" href="mailto:${email}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> Email me</a>` : ''}
            ${p.linkedin ? `<a class="gh-btn" href="${esc(p.linkedin)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg> LinkedIn</a>` : ''}
            ${p.github ? `<a class="gh-btn" href="${esc(p.github)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> GitHub</a>` : ''}
          </div>
        </section>
      </main>
    </div>

    ${foot(p)}
  </body></html>`;
}

function pageCloud(p) {
  const name = esc(p.name || 'Developer');
  const title = esc(p.title || 'Frontend Engineer');
  const bio = esc(p.bio || p.summary || p.tagline || `I'm ${name}, creating friendly, accessible digital experiences.`);
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  return `<!DOCTYPE html><html lang="en">${head(p, 'cloud')}<body class="portfolio-view" data-template="cloud">
    <div class="cw-wrap" style="padding-top:40px">
      <header class="cw-hero">
        <div>
          <h1>Hi, I'm ${name}.<br><span class="role">${title}</span></h1>
          <p>${bio}</p>
        </div>
      </header>
      <section class="cw-section alt">
        <h2 class="cw-h2">Skills</h2>
        <div class="cw-skills">${skills.map(s => `<span class="cw-skill">✦ ${esc(s)}</span>`).join('')}</div>
      </section>
    </div>
    ${foot(p)}
  </body></html>`;
}

function page(p, url) {
  const qTpl = url ? (url.searchParams.get('template') || url.searchParams.get('t')) : null;
  let tpl = String(qTpl || p.template || 'midnight').toLowerCase();
  const visualOnly = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom'];
  if (visualOnly.includes(tpl)) {
    tpl = 'midnight';
  }
  if (tpl === 'moderncv') {
    return pageModerncv(p);
  }
  if (tpl === 'ultracode') {
    return pageUltracode(p);
  }
  if (tpl === 'devblue' || tpl === 'marlon') {
    return pageDevblue(p);
  }
  if (tpl === 'cube' || tpl === 'cubegreen' || tpl === 'muzammal') {
    return pageCube(p);
  }
  if (tpl === 'nova') {
    return pageNova(p);
  }
  if (tpl === 'codeflow') {
    return pageCodeflow(p);
  }
  if (tpl === 'wave') {
    return pageWave(p);
  }
  if (tpl === 'assistant') {
    return pageAssistant(p);
  }
  if (tpl === 'console') {
    return pageConsole(p);
  }
  if (tpl === 'snowcard') {
    return pageSnowcard(p);
  }
  if (tpl === 'parchment') {
    return pageParchment(p);
  }
  if (tpl === 'cloud') {
    return pageCloud(p);
  }
  if (tpl === 'github') {
    return pageGithub(p);
  }
  if (tpl === 'particle') {
    return pageParticle(p);
  }
  if (tpl === 'panels') {
    return pagePanels(p);
  }
  if (tpl === 'monolith') {
    return pageMonolith(p);
  }
  if (tpl === 'editor') {
    return pageEditor(p);
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

function computeWorkerATS(p) {
  let score = 20; // baseline formatting
  if (p.email || p.phone || p.location) score += 6;
  if ((p.resume && p.resume.summary) || p.tagline) score += 8;
  if (Array.isArray(p.experience) && p.experience.length) score += 10;
  if (Array.isArray(p.education) && p.education.length) score += 4;
  if (Array.isArray(p.skills) && p.skills.length) score += 6;
  const keySkills = ['javascript', 'typescript', 'react', 'node.js', 'python', 'sql', 'aws', 'docker', 'git', 'html', 'css'];
  const userSkills = (p.skills || []).map((s) => String(s).toLowerCase());
  let kwScore = 0;
  keySkills.forEach((k) => { if (userSkills.some((s) => s.includes(k))) kwScore += 4; });
  score = Math.min(100, score + Math.min(35, kwScore));
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';
  return { score, grade };
}

function pageResume(p) {
  const theme = resumeTheme(p);
  const ats = computeWorkerATS(p);
  const targetRole = (p.resume && p.resume.targetRole && p.resume.targetRole !== 'auto') ? p.resume.targetRole : '';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Resume — ${esc(p.name)} | portfoolio.me</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/resume.css"></head>
<body class="portfolio-view rs-page rs-${theme}"><div class="bg-fx"></div>${nav(p)}
<div class="no-print" style="max-width:860px;margin:0 auto;padding:120px 16px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
<a href="/" style="font-weight:800">← ${esc(p.name)}</a>
<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.35);font-size:12.5px;font-weight:700;color:var(--cyan,#22d3ee)">
  <span>🎯 ATS Score:</span> <span style="background:rgba(0,0,0,.4);color:#fff;padding:2px 6px;border-radius:4px">${ats.score}%</span> <span>Grade ${ats.grade}</span>
  ${targetRole ? `<span style="color:#a78bfa;border-left:1px solid rgba(255,255,255,.2);padding-left:6px">${esc(targetRole)}</span>` : ''}
</div>
<span style="margin-left:auto;display:flex;gap:10px"><a href="/" style="font-weight:700">Portfolio</a><a href="javascript:window.print()" style="font-weight:800">⬇ Print / PDF</a></span></div>
<main class="rs-doc rs-${theme}">${resumeBody(p)}
<p class="rs-foot">Resume auto-built from <b>portfoolio.me</b> profile · ${esc(p.username)}.portfoolio.me</p></main>
<div class="no-print" style="text-align:center;padding:0 0 40px"><a href="javascript:window.print()" style="font-weight:800">⬇ Print / Save as PDF</a></div>${foot(p)}</body></html>`;
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
            'cache-control': url.pathname.endsWith('.css') ? 'public, max-age=60' : 'public, max-age=86400',
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
    const isVisualTrack = p.track === 'visual' || (p.track !== 'tech' && Array.isArray(p.works) && p.works.length > 0 && ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom'].includes(String(p.template || '').toLowerCase()));
    if (isVisualTrack) {
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
