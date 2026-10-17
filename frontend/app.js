/* portfoolio.me — subdomain portfolio platform (v1: static + localStorage, Supabase-ready) */
const RESERVED = new Set(['www','app','api','admin','mail','blog','help','support','static','assets','u','p','netlify','portfoolio']);
const LS_KEY = 'portfoolio_users_v1';

const store = {
  read() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } },
  write(all) { localStorage.setItem(LS_KEY, JSON.stringify(all)); },
  get(u) { return this.read()[u.toLowerCase()]; },
  exists(u) { return !!this.get(u); },
  save(p) { const all = this.read(); all[p.username.toLowerCase()] = p; this.write(all); return p; },
  all() { return Object.values(this.read()); }
};

function slugify(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '').slice(0, 30);
}
function validUsername(u) { return /^[a-z0-9][a-z0-9-]{2,29}$/.test(u) && !RESERVED.has(u); }
const TAKEN_USERNAMES = ['nkr3037','neerajkr-dev','nithin','athukovil','ashmith','neerajkr'];
function usernameTaken(name) {
  const n = String(name || '').toLowerCase().trim();
  if (!n) return true;
  if (RESERVED.has(n) || TAKEN_USERNAMES.includes(n)) return true;
  try { if (store.exists(n)) return true; } catch (e) {}
  return false;
}
async function checkUsernameAvailability(name) {
  const n = String(name || '').toLowerCase().trim();
  if (!/^[a-z0-9][a-z0-9-]{2,29}$/.test(n)) return { ok: false, msg: '3-30 chars: lowercase letters, numbers, hyphens' };
  if (usernameTaken(n)) return { ok: false, msg: 'That subdomain is taken' };
  try {
    if (typeof cloudEnabled === 'function' && cloudEnabled() && typeof cloudGetProfile === 'function') {
      const c = await cloudGetProfile(n);
      if (c) return { ok: false, msg: 'That subdomain is taken' };
    }
  } catch (e) {}
  return { ok: true, msg: 'Available — ' + n + '.portfoolio.me' };
}

const VIEW_KEY = 'portfoolio_views_v1';
const VIEW_WEEK = 7 * 24 * 60 * 60 * 1000;
function trackProfileView(username) {
  try {
    const u = String(username).toLowerCase();
    const now = Date.now();
    const all = JSON.parse(localStorage.getItem(VIEW_KEY) || '{}');
    const row = all[u];
    if (!row || now - (row.weekStart || 0) > VIEW_WEEK) all[u] = { count: 0, weekStart: now };
    all[u].count = (all[u].count || 0) + 1;
    localStorage.setItem(VIEW_KEY, JSON.stringify(all));
  } catch (e) {}
}
function getProfileViews(username) {
  try {
    const u = String(username).toLowerCase();
    const row = (JSON.parse(localStorage.getItem(VIEW_KEY) || '{}'))[u];
    if (!row) return 0;
    const now = Date.now();
    if (now - (row.weekStart || 0) > VIEW_WEEK) return 0;
    return row.count || 0;
  } catch (e) { return 0; }
}

// ---- Router: subdomain > ?u= > /u/<name> > #/u/<name> ----
function getRequestedUser() {
  const host = location.hostname.toLowerCase();
  const params = new URLSearchParams(location.search);
  if (params.get('u')) return slugify(params.get('u'));
  const pathMatch = location.pathname.match(/^\/u\/([A-Za-z0-9-]+)\/?$/);
  if (pathMatch) return slugify(pathMatch[1]);
  const hashMatch = location.hash.match(/#\/u\/([A-Za-z0-9-]+)/);
  if (hashMatch) return slugify(hashMatch[1]);
  // *.portfoolio.me
  if (host.endsWith('portfoolio.me')) {
    const parts = host.split('.');
    // [sub, portfoolio, me]
    if (parts.length === 3 && parts[0] !== 'www' && parts[0] !== 'portfoolio') return slugify(parts[0]);
  }
  return null;
}

function normLocalProfile(p) {
  if (!p) return p;
  if (typeof normRow === 'function') return normRow(p);
  // supabase-config.js may not be loaded on public pages — sync keys manually
  if (p.avatar_url && !p.avatarUrl) p.avatarUrl = p.avatar_url || '';
  if (p.avatarUrl && !p.avatar_url) p.avatar_url = p.avatarUrl || '';
  if (typeof p.show_instagram === 'boolean' && typeof p.showInstagram === 'undefined') p.showInstagram = p.show_instagram;
  if (typeof p.showInstagram === 'boolean' && typeof p.show_instagram === 'undefined') p.show_instagram = p.showInstagram;
  return p;
}
function showInsta(p) {
  // Prefer shared helper from supabase-config.js when loaded.
  try { if (typeof shouldShowInsta === 'function') return shouldShowInsta(p); } catch {}
  if (!p || !p.instagram) return false;
  if (p.showInstagram === false || p.show_instagram === false) return false;
  return true;
}
async function loadProfile(username) {
  const u = username.toLowerCase();
  // 1. cloud (Supabase) — live on every device, when owner connects it
  try {
    if (typeof cloudEnabled === 'function' && cloudEnabled()) {
      const c = await cloudGetProfile(u);
      if (c) return normLocalProfile(c);
    }
  } catch {}
  // 2. localStorage (user-created, this browser)
  const local = store.get(u);
  if (local) return normLocalProfile(local);
  // 2. seed JSON files
  try {
    const r = await fetch(`profiles/${encodeURIComponent(u)}.json`, { cache: 'no-store' });
    if (r.ok) return normLocalProfile(await r.json());
  } catch {}
  return null;
}

function portfolioURL(username) {
  // Canonical subdomain URL (works once wildcard DNS is live).
  // Fallback path works everywhere right now (Netlify free).
  return `${location.protocol}//${username}.portfoolio.me`;
}
function portfolioPathURL(username) {
  return `${location.origin}/?u=${encodeURIComponent(username)}`;
}

// ---- Project cover icons (inline SVG — crisp at every size, zero font risk) ----
const SVG = {
  campus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v5"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><path d="M12 9V6"/><circle cx="12" cy="4.5" r="1.2"/><circle cx="9.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="13.5" r="1" fill="currentColor" stroke="none"/><path d="M9.5 16.5h5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20v-6M11 20V6M17 20v-9"/><path d="M3 20h18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5C7 16.5 3 13.2 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 3.9-4 7.2-9 11.2Z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H11l-4.5 3v-3.5A7.5 7.5 0 1 1 21 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>',
  game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7.5 11v3.5M5.8 12.7h3.4"/><circle cx="15.8" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="17.8" cy="14" r="1" fill="currentColor" stroke="none"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-5 4 5 4M16 8l5 4-5 4"/></svg>',
};
function projIcon(pr) {
  const t = (((pr.title || '') + ' ' + (pr.tags || []).join(' '))).toLowerCase();
  if (/campus|college|student|school/.test(t)) return SVG.campus;
  if (/ai|interview|bot|agent|robot/.test(t)) return SVG.bot;
  if (/dash|lead|analy|chart|crm|sales/.test(t)) return SVG.chart;
  if (/health|med|fit/.test(t)) return SVG.heart;
  if (/whatsapp|chat|support|message/.test(t)) return SVG.chat;
  if (/game|monopoly|play|fun/.test(t)) return SVG.game;
  return SVG.code;
}
// ---- GitHub import: fetch public repos, normalize to portfolio projects ----
async function fetchGitHubRepos(username, count = 100) {
  let u = String(username || '').trim().replace(/^@/, '');
  const m = u.match(/github\.com\/([A-Za-z0-9-]+)/i);
  if (m) u = m[1];
  if (!/^[A-Za-z0-9-]{1,39}$/.test(u)) throw new Error('bad-username');
  const r = await fetchWithTimeout(`https://api.github.com/users/${encodeURIComponent(u)}/repos?per_page=${count}&sort=updated`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (r.status === 404) throw new Error('not-found');
  if (r.status === 403) throw new Error('rate-limited');
  if (!r.ok) throw new Error('fetch-failed');
  return await r.json();
}
function repoToProject(r) {
  const stars = r.stargazers_count > 0 ? `★ ${r.stargazers_count}` : 'Repo';
  const extra = r.forks_count > 0 ? ` · ${r.forks_count} fork${r.forks_count > 1 ? 's' : ''}` : '';
  const tags = [r.language, r.fork ? 'Fork' : null].filter(Boolean);
  return {
    title: r.name, desc: r.description || 'GitHub repository — click through to explore the code.',
    url: r.html_url, stars: stars + extra, tags,
    // proof-of-work: carried GitHub evidence (presence of `repo` = retrieved from GitHub)
    technologies: [r.language].filter(Boolean),
    demoUrl: r.homepage || '',
    repo: {
      fullName: r.full_name, language: r.language, stars: r.stargazers_count,
      updatedAt: r.pushed_at || r.updated_at, topics: (r.topics || []).slice(0, 5),
    },
  };
}
// fetch with a hard timeout so slow/blocked networks fail visibly instead of hanging
async function fetchWithTimeout(url, opts, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...(opts || {}), signal: ctrl.signal });
  } catch (e) {
    if (e && e.name === 'AbortError') throw new Error('timeout');
    throw e;
  } finally { clearTimeout(t); }
}
// Accepts a username, @user, profile URL, or single repo URL (user/repo)
async function fetchGitHubInput(input) {
  const s = String(input || '').trim();
  const m = s.match(/github\.com\/([A-Za-z0-9-]+)\/([A-Za-z0-9-_.]+)/i);
  if (m) {
    const r = await fetchWithTimeout(`https://api.github.com/repos/${encodeURIComponent(m[1])}/${encodeURIComponent(m[2])}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (r.status === 404) throw new Error('not-found');
    if (r.status === 403) throw new Error('rate-limited');
    if (!r.ok) throw new Error('github-' + r.status);
    return [await r.json()];
  }
  return fetchGitHubRepos(s);
}
// ---- Renderer: same wow theme, data-driven ----
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// ---- Visual track: Behance-style gallery (no resume, no code) ----
function galleryWorks(p) {
  return Array.isArray(p.works) ? p.works.filter(w => w && w.imageUrl) : [];
}
function renderGallery(p) {
  p = normLocalProfile(p) || p;
  const vtpl = String(p.template || 'gallery').toLowerCase();
  document.body.dataset.template = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom'].includes(vtpl) ? vtpl : 'gallery';
  document.title = `${p.name} — visual portfolio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = galleryWorks(p);
  const cover = works[0];
  const avatar = (p.avatarUrl || p.avatar_url || '').trim();
  const srcAvatar = avatar || (cover ? cover.imageUrl : '');
  const letter = esc((p.name || '?').trim().charAt(0).toUpperCase());
  const countLabel = `${works.length} work${works.length === 1 ? '' : 's'}`;
  const navHtml = `
  <nav>
    <a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
    <div style="display:flex;gap:10px;align-items:center">
      <a class="btn btn-ghost btn-sm" href="/"><i class="fa-solid fa-plus"></i> Make yours</a>
      ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}">Contact</a>` : ''}
    </div>
  </nav>`;
  const footHtml = `<footer><div class="wrap foot"><div>© ${new Date().getFullYear()} <b style="color:#fff">${esc(p.name)}</b> via <b style="color:#fff">portfoolio.me</b></div></div></footer>`;
  const emptyMsg = '<p style="color:var(--muted);text-align:center;padding:40px 0">No works published yet.</p>';
  let headHtml = '', gridHtml = '';
  if (document.body.dataset.template === 'museum') {
    const faceArt = srcAvatar
      ? `<img class="museum-portrait" src="${esc(srcAvatar)}" alt="${esc(p.name || '')}">`
      : `<div class="museum-portrait museum-portrait-fallback">${letter}</div>`;
    headHtml = `<header class="wrap gal-museum-head">
      ${faceArt}
      <p class="museum-kicker">— EXHIBITION —</p>
      <h1>${esc(p.name)}</h1>
      <p class="museum-sub">${esc(p.title || '')}</p>
      <p class="museum-meta">${esc(p.location || '')} · ${countLabel}</p>
    </header>`;
    gridHtml = `<section class="wrap museum-hang">${works.map((w, i) => `
      <figure class="museum-piece" data-gal="${i}">
        <div class="museum-frame"><img src="${esc(w.imageUrl)}" alt="${esc(w.title || '')}" loading="lazy"></div>
        <figcaption class="museum-plaque">
          <span class="museum-no">${String(i + 1).padStart(2, '0')}</span>
          <div class="museum-plaque-text"><b>${esc(w.title || 'Untitled')}</b>${w.category ? `<small>${esc(w.category)}</small>` : ''}</div>
        </figcaption>
      </figure>`).join('') || emptyMsg}</section>`;
  } else if (document.body.dataset.template === 'bloom') {
    headHtml = `<header class="wrap gal-bloom-head">
      <div class="bloom-orb"></div>
      ${srcAvatar ? `<img class="bloom-portrait" src="${esc(srcAvatar)}" alt="${esc(p.name || '')}">` : `<div class="bloom-portrait bloom-portrait-fallback">${letter}</div>`}
      <h1>${esc(p.name)}</h1>
      <p class="bloom-sub">${esc(p.title || '')}</p>
      <p class="bloom-meta">${esc(p.location || '')} · ${countLabel}</p>
    </header>`;
    gridHtml = `<section class="wrap bloom-masonry">${works.map((w, i) => `
      <figure class="bloom-tile ${i % 5 === 0 ? 'tall' : ''}" data-gal="${i}">
        <img src="${esc(w.imageUrl)}" alt="${esc(w.title || '')}" loading="lazy">
        <figcaption><b>${esc(w.title || 'Untitled')}</b>${w.category ? `<small>${esc(w.category)}</small>` : ''}</figcaption>
      </figure>`).join('') || emptyMsg}</section>`;
  } else {
    const face = srcAvatar
      ? `<img src="${esc(srcAvatar)}" alt="${esc(p.name || '')}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 14px;display:block;border:3px solid rgba(255,255,255,.2)">`
      : `<div style="width:120px;height:120px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;font-size:48px;background:linear-gradient(135deg,#f472b6,#8b5cf6,#22d3ee)">${letter}</div>`;
    headHtml = `<header class="wrap" style="padding:140px 0 10px;text-align:center">
      ${face}
      <h1 style="font-size:clamp(36px,5vw,56px)">${esc(p.name)}</h1>
      <p style="color:var(--muted);font-size:17px">${esc(p.title || '')}</p>
      <p style="color:var(--muted);font-size:14px;margin-top:6px">${esc(p.location || '')} · ${countLabel}</p>
    </header>`;
    gridHtml = `<section class="wrap" style="padding-top:10px">
      <div class="works-grid" id="galGrid" style="margin-top:18px">${works.map((w, i) => `
        <div class="work-card" data-gal="${i}" style="cursor:pointer">
          <img src="${esc(w.imageUrl)}" alt="${esc(w.title || '')}" loading="lazy">
          <div class="work-meta" style="padding:12px 14px"><b>${esc(w.title || 'Untitled')}</b>${w.category ? `<small style="color:var(--muted)">${esc(w.category)}</small>` : ''}</div>
        </div>`).join('') || emptyMsg}</div>
    </section>`;
  }
  app.innerHTML = navHtml + headHtml + gridHtml + footHtml;
  app.querySelectorAll('[data-gal]').forEach(c => c.onclick = () => {
    history.pushState({ view: 'work', username: p.username, idx: +c.dataset.gal }, '', `${location.origin}/?u=${encodeURIComponent(p.username)}`);
    renderWorkDetail(p, +c.dataset.gal);
  });
  window.scrollTo(0, 0);
}
function renderWorkDetail(p, idx) {
  const works = galleryWorks(p);
  const w = works[idx] || works[0];
  if (!w) { renderGallery(p); return; }
  document.title = `${w.title || 'Work'} — ${p.name} | portfoolio.me`;
  const app = document.getElementById('app');
  const back = portfolioPathURL(p.username);
  app.innerHTML = `
  <nav><a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
  <a class="btn btn-ghost btn-sm" href="${back}">← ${esc(p.name)}</a></nav>
  <section class="wrap" style="padding:140px 0 20px;max-width:900px">
    ${w.category ? `<span class="badge">✦ ${esc(w.category)}</span>` : ''}
    <h1 style="font-size:clamp(32px,5vw,52px);margin:10px 0">${esc(w.title || 'Untitled')}</h1>
    ${w.desc ? `<p style="color:var(--muted);font-size:16px">${esc(w.desc)}</p>` : ''}
    <img src="${esc(w.imageUrl)}" alt="${esc(w.title || '')}" style="width:100%;border-radius:18px;margin-top:18px;border:1px solid var(--stroke);box-shadow:0 24px 60px rgba(0,0,0,.35);transition:box-shadow .35s var(--ease)">
    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
      ${idx > 0 ? `<button class="btn btn-ghost btn-sm" id="galPrev">← Prev</button>` : ''}
      ${idx < works.length - 1 ? `<button class="btn btn-ghost btn-sm" id="galNext">Next →</button>` : ''}
    </div>
  </section>`;
  const pv = document.getElementById('galPrev'), nx = document.getElementById('galNext');
  if (pv) pv.onclick = () => renderWorkDetail(p, idx - 1);
  if (nx) nx.onclick = () => renderWorkDetail(p, idx + 1);
  window.scrollTo(0, 0);
}
function renderPortfolio(p) {
  p = normLocalProfile(p) || p;
  const tpl = String(p.template || 'midnight').toLowerCase();
  if (tpl !== 'midnight' && window.PortfoolioTemplates && window.PortfoolioTemplates[tpl]) {
    window.PortfoolioTemplates[tpl](p); return;
  }
  document.body.dataset.template = '';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const app = document.getElementById('app');
  const EV = window.PortfoolioEvidence || null;
  const ev = EV ? EV.buildEvidence(p) : null;
  const showEvidenceCards = ev && p.skillsDisplay !== 'simple' && ev.totals.skillsWithEvidence > 0;
  const skillUrl = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(s.toLowerCase())}`;
  const skillsBadges = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${(p.skills || []).map(s => `<span class="badge">✦ ${esc(s)}</span>`).join('') || '<p style="color:var(--muted)">No skills listed yet — add some from the dashboard.</p>'}</div>`;
  const skills = showEvidenceCards
    ? `<div class="proj-grid" style="grid-template-columns:repeat(3,1fr);margin-top:14px">${ev.skills.filter(s => s.projects.length).map(s => `
        <a class="card" style="display:block;padding:18px" href="${skillUrl(s.name)}">
          <h3 style="font-size:17px">${esc(s.name)}</h3>
          <p style="color:var(--muted);font-size:13px;margin:4px 0 0">${s.projects.length} project${s.projects.length > 1 ? 's' : ''}${s.repoCount ? ` · ${s.repoCount} repositor${s.repoCount > 1 ? 'ies' : 'y'}` : ''}</p>
          <span style="color:#22d3ee;font-size:13px;font-weight:800">View evidence →</span>
        </a>`).join('')}</div>${skillsBadges}`
    : skillsBadges;
  const projects = (p.projects || []).map((pr, i) => {
    const techs = EV ? EV.projectTechs(pr) : (pr.technologies || pr.tags || []);
    const ghBadge = pr.repo ? `<span class="badge" style="font-size:11px" title="Repository retrieved from GitHub — not a skill endorsement">✓ GitHub Verified</span>` : '';
    const liveBadge = pr.demoUrl ? `<a class="badge" style="font-size:11px" href="${esc(pr.demoUrl)}" target="_blank" rel="noopener">↗ Live Demo</a>` : '';
    return `
    <article class="proj">
      <div class="proj-top p${(i % 6) + 1}"><div class="proj-art">${projIcon(pr)}</div><div class="stars">${esc(pr.stars || 'Live')}</div></div>
      <div class="proj-body"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
      ${techs.length ? `<div class="tags">${techs.map(t => `<a href="${skillUrl(t)}" style="text-decoration:none"><span>${esc(t)}</span></a>`).join('')}</div>` : ''}
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:2px">${ghBadge}${liveBadge}
      ${pr.repo ? `<small style="color:var(--muted);font-size:11.5px">${esc(pr.repo.fullName || '')}${pr.repo.updatedAt ? ` • updated ${esc(String(pr.repo.updatedAt).slice(0, 7))}` : ''}</small>` : ''}</div>
      <div class="proj-actions"><a class="primary" href="${esc(pr.url)}" target="_blank" rel="noopener">View code <i class="fa-solid fa-arrow-up-right-from-square"></i></a>${pr.demoUrl ? `<a href="${esc(pr.demoUrl)}" target="_blank" rel="noopener">Demo</a>` : ''}</div>
      </div>
    </article>`; }).join('');
  app.innerHTML = `
  <nav>
    <a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
    <div style="display:flex;gap:10px;align-items:center">
      <a class="btn btn-ghost btn-sm" href="/"><i class="fa-solid fa-plus"></i> Make yours</a>
      <a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}"><i class="fa-solid fa-bolt"></i> Hire ${esc(p.name.split(' ')[0])}</a>
    </div>
  </nav>
  <header class="hero wrap">
    <div class="hero-grid">
      <div>
        ${p.available ? '<div class="pill"><span class="dot"></span> Open to work</div>' : ''}
        <h1>Hi, I'm <span class="grad">${esc(p.name)}</span><br>${esc(p.title)}</h1>
        <p class="sub">${esc(p.tagline || '')}</p>
        <div class="hero-cta">
          ${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}"><i class="fa-solid fa-paper-plane"></i> Email me</a>` : ''}
          ${window.PortfoolioResume ? `<a class="btn btn-ghost" href="${window.PortfoolioResume.resumeURL(p.username)}"><i class="fa-solid fa-file-lines"></i> Resume</a>` : ''}
          ${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
          ${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}" target="_blank"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
          ${showInsta(p) ? `<a class="btn btn-ghost" href="${esc(p.instagram)}" target="_blank"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
        </div>
        <div class="hero-meta">
          ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${esc(p.location)}</span>` : ''}
          ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${esc(p.email)}</span>` : ''}
          ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${esc(p.phone)}</span>` : ''}
          ${showInsta(p) ? `<span><i class="fa-brands fa-instagram"></i> ${esc(p.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, ''))}</span>` : ''}
        </div>
      </div>
      <div class="visual"><div class="avatar-card"><div class="avatar-inner">
        ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:132px;height:132px;border-radius:50%;object-fit:cover;border:4px solid #1b2547">` : `<div style="width:120px;height:120px;border-radius:50%;margin:0 auto;display:grid;place-items:center;font-size:52px;background:linear-gradient(135deg,#6c6cf5,#22d3ee)">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</div>`}
        <h3>${esc(p.name)}</h3><p class="mono">@${esc(p.username)} • portfoolio.me</p>
        <div class="badges">${skillsBadges}</div>
      </div></div></div>
    </div>
  </header>
  <section class="wrap" style="padding-top:10px">
    <span class="eyebrow">● Skills</span>
    <h2 class="title">Don't list it. <span class="grad">Prove it.</span></h2>
    ${skills}
  </section>
  <section class="wrap" style="padding-top:10px">
    <span class="eyebrow">● Projects</span>
    <h2 class="title">Work that <span class="grad">speaks</span></h2>
    <div class="proj-grid" style="margin-top:22px">${projects || '<p style="color:var(--muted)">No projects yet.</p>'}</div>
  </section>
  ${window.PortfoolioResume ? window.PortfoolioResume.sectionHTML(p) : ''}
  <section class="wrap">
    <div class="card" style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      <div><h3>Like this portfolio?</h3><p>Claim yours free — <b style="color:#fff">yourname.portfoolio.me</b> in 60 seconds.</p></div>
      <a class="btn btn-primary" href="/">Create mine <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </section>
  <footer><div class="wrap foot"><div>© ${new Date().getFullYear()} <b style="color:#fff">${esc(p.name)}</b> via <b style="color:#fff">portfoolio.me</b></div>
  <div class="socials">${p.github ? `<a href="${esc(p.github)}" target="_blank"><i class="fa-brands fa-github"></i></a>` : ''}${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank"><i class="fa-brands fa-linkedin"></i></a>` : ''}${showInsta(p) ? `<a href="${esc(p.instagram)}" target="_blank"><i class="fa-brands fa-instagram"></i></a>` : ''}${p.email ? `<a href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i></a>` : ''}</div></div></footer>`;
  window.scrollTo(0, 0);
}

function renderNotFound(username) {
  const app = document.getElementById('app');
  document.title = `${username} not found | portfoolio.me`;
  app.innerHTML = `
  <nav><a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>portfoolio.me</small></span></a>
  <a class="btn btn-primary btn-sm" href="/">Claim this name</a></nav>
  <section class="wrap" style="padding:160px 0 80px;text-align:center">
    <div style="font-size:64px">🪐</div>
    <h2 class="title"><span class="grad">${esc(username)}</span>.portfoolio.me is available!</h2>
    <p class="lead" style="margin:0 auto 22px">Nobody claimed this yet. Make it yours in 60 seconds — free.</p>
    <a class="btn btn-primary" href="/?claim=${encodeURIComponent(username)}">Claim ${esc(username)} <i class="fa-solid fa-arrow-right"></i></a>
    <div style="margin-top:14px"><a href="/" style="color:var(--muted);font-weight:700">← back home</a></div>
  </section>`;
}

// username.portfoolio.me/skills/<skill> equivalent: ?u=<user>&skill=<skill>
function renderSkillPage(p, skillName) {
  const EV = window.PortfoolioEvidence;
  const app = document.getElementById('app');
  const back = `?u=${encodeURIComponent(p.username)}`;
  if (!EV) { renderPortfolio(p); return; }
  const ev = EV.buildEvidence(p);
  const s = ev.skills.find((x) => x.name.toLowerCase() === String(skillName).toLowerCase());
  document.title = `${skillName} — ${p.name} | portfoolio.me`;
  if (!s) {
    app.innerHTML = `<nav><a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a></nav>
    <section class="wrap" style="padding:160px 0;text-align:center"><h2 class="title">No evidence for <span class="grad">${esc(skillName)}</span> yet</h2>
    <p class="lead" style="margin:0 auto 20px">Connect a project to show how ${esc(p.name.split(' ')[0])} uses this skill.</p>
    <a class="btn btn-ghost" href="${back}">← Back to ${esc(p.name)}</a></section>`;
    window.scrollTo(0, 0); return;
  }
  app.innerHTML = `
  <nav><a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
  <a class="btn btn-ghost btn-sm" href="${back}">← ${esc(p.name)}</a></nav>
  <section class="wrap" style="padding:140px 0 20px">
    <span class="eyebrow">● Skill evidence</span>
    <h1 style="font-size:clamp(38px,6vw,60px)">${esc(s.name)}</h1>
    <p class="lead">Used in <b style="color:#fff">${s.projects.length} project${s.projects.length > 1 ? 's' : ''}</b></p>
    <div class="proj-grid" style="margin-top:22px">${s.projects.map((e) => {
      const pr = (p.projects || []).find((x) => x.title === e.title) || {};
      const techs = EV.projectTechs(pr);
      return `<article class="proj"><div class="proj-body"><h3>${esc(e.title)}</h3>
        ${techs.length ? `<div class="tags">${techs.map(t => `<a href="?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(t.toLowerCase())}" style="text-decoration:none"><span>${esc(t)}</span></a>`).join('')}</div>` : ''}
        <div class="proj-actions"><a class="primary" href="${esc(e.url)}" target="_blank" rel="noopener">View project</a></div>
      </div></article>`; }).join('')}</div>
  </section>
  <section class="wrap"><div class="card"><h3>Evidence</h3>
    <p style="color:var(--muted)">GitHub repositories: <b style="color:#fff">${s.repoCount}</b> · Live projects: <b style="color:#fff">${s.liveCount}</b> · Last used: <b style="color:#fff">${s.lastUsed || '—'}</b></p>
    <p style="color:var(--muted);font-size:12.5px">Labels mean: "GitHub Verified" = repository retrieved from GitHub. It is not an endorsement of skill level.</p>
  </div></section>`;
  window.scrollTo(0, 0);
}

// ---- Uploaded prebuilt sites (user's own HTML/ZIP hosted on their subdomain) ----
function uploadedSiteURL(p) {
  try {
    if (typeof sitePublicUrl === 'function' && typeof cloudEnabled === 'function' && cloudEnabled()) {
      return sitePublicUrl(p.username, 'index.html');
    }
  } catch {}
  // local/dev fallback: site_path marker only; builder preview otherwise
  return null;
}
function renderUploadedSite(p) {
  const url = uploadedSiteURL(p);
  const app = document.getElementById('app');
  document.title = `${p.name || p.username} | portfoolio.me`;
  if (!url) { renderPortfolio(p); return; } // storage offline → builder theme
  document.body.dataset.template = '';
  app.innerHTML = `
  <div style="position:fixed;inset:0;display:flex;flex-direction:column;background:#070b16">
    <div style="display:flex;align-items:center;gap:10px;padding:8px 14px;background:rgba(11,18,38,.92);border-bottom:1px solid rgba(255,255,255,.12);font-size:13px;z-index:5">
      <a href="/" style="font-weight:800;letter-spacing:.3px">◈ PORTFOOLIO</a>
      <span style="color:#9aa3c0">${esc(p.username)}.portfoolio.me · custom upload</span>
      <span style="margin-left:auto;display:flex;gap:8px">
        <a href="${esc(portfolioPathURL(p.username))}" style="font-weight:700;color:#22d3ee">Direct link</a>
        <a href="/" style="font-weight:700">Make yours</a>
      </span>
    </div>
    <!-- No allow-same-origin: untrusted upload runs cross-origin so it can never touch parent storage/DOM -->
    <iframe src="${esc(url)}" title="${esc(p.username)} portfolio" sandbox="allow-scripts allow-forms allow-popups" style="flex:1;width:100%;border:0;background:#fff"></iframe>
  </div>`;
  window.scrollTo(0, 0);
}

// ---- Resume page (?u=<user>&resume=1, /u/<user>/resume, #/u/<user>/resume, <sub>.portfoolio.me/resume) ----
function getSubdomainUser() {
  const host = location.hostname.toLowerCase();
  if (host.endsWith('portfoolio.me')) {
    const parts = host.split('.');
    if (parts.length === 3 && parts[0] !== 'www' && parts[0] !== 'portfoolio') return slugify(parts[0]);
  }
  return null;
}
function getResumeUser() {
  const qs = new URLSearchParams(location.search);
  if (qs.has('resume')) {
    if (qs.get('u')) return slugify(qs.get('u'));
    const sub = getSubdomainUser();
    if (sub) return sub;
  }
  const pm = location.pathname.match(/^\/u\/([A-Za-z0-9-]+)\/resume\/?$/);
  if (pm) return slugify(pm[1]);
  const hm = location.hash.match(/#\/u\/([A-Za-z0-9-]+)\/resume/);
  if (hm) return slugify(hm[1]);
  if (/^\/resume\/?$/.test(location.pathname)) {
    const sub = getSubdomainUser();
    if (sub) return sub;
  }
  return null;
}
function renderResumePage(p) {
  const R = window.PortfoolioResume;
  document.body.dataset.template = '';
  document.title = `Resume — ${p.name || p.username} | portfoolio.me`;
  const app = document.getElementById('app');
  if (!R) { renderPortfolio(p); return; }
  const theme = R.get(p).theme;
  const back = `/?u=${encodeURIComponent(p.username)}`;
  app.innerHTML = `
  <nav class="no-print">
    <a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
    <div style="display:flex;gap:10px;align-items:center">
      <a class="btn btn-ghost btn-sm" href="${back}">← Portfolio</a>
      <button class="btn btn-primary btn-sm" onclick="window.print()">⬇ Print / PDF</button>
    </div>
  </nav>
  <main class="rs-doc rs-${theme}">${R.docBody(p)}
  <p class="rs-foot">Resume auto-built from <b>portfoolio.me</b> profile · ${esc(p.username)}.portfoolio.me</p></main>
  <div class="no-print" style="text-align:center;padding:0 0 50px">
    <button class="btn btn-primary btn-sm" onclick="window.print()">⬇ Print / Save as PDF</button>
    <a class="btn btn-ghost btn-sm" href="${back}">Back to portfolio</a>
  </div>`;
  window.scrollTo(0, 0);
}

// ---- /explore : public directory of all portfolios ----
const EXPLORE_SEEDS = ['arjun','demo','ember','iris','june','kai','leo','mira','neerajkr','priya','zoe'];
async function getPublicProfiles() {
  const out = [];
  try { (store.all() || []).forEach(p => out.push(normLocalProfile(p))); } catch (e) {}
  await Promise.all(EXPLORE_SEEDS.map(async (u) => {
    try {
      const r = await fetch(`profiles/${u}.json`, { cache: 'no-store' });
      if (r.ok) out.push(normLocalProfile(await r.json()));
    } catch (e) {}
  }));
  try {
    if (typeof cloudEnabled === 'function' && cloudEnabled() && typeof cloudListProfiles === 'function') {
      const cloudRows = await cloudListProfiles();
      (cloudRows || []).forEach(p => out.push(normLocalProfile(p)));
    }
  } catch (e) {}
  const seen = new Set();
  return out.filter(p => {
    if (!p || !p.username) return false;
    const k = String(p.username).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
async function renderExplorePage() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="wrap lx-explore">
      <p class="lx-kicker">Directory</p>
      <h1 class="lx-h1">Explore portfolios</h1>
      <p class="lx-lead">Every public portfolio on portfoolio.me.</p>
      <div class="dir-grid" id="exploreGrid"><p style="color:var(--muted)">Loading…</p></div>
    </div>`;
  const profiles = await getPublicProfiles();
  const grid = document.getElementById('exploreGrid');
  if (!grid) return;
  if (!profiles.length) { grid.innerHTML = '<p style="color:var(--muted)">No public portfolios yet.</p>'; return; }
  grid.innerHTML = profiles.map(p => {
    const initial = (p.name || p.username || '?').trim().charAt(0).toUpperCase();
    return `
    <div class="dir-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
        <span style="width:36px;height:36px;border-radius:50%;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:#fff;background:linear-gradient(135deg,#4f46e5,#6366f1)">${esc(initial)}</span>
        <h3 style="margin:0">${esc(p.name || p.username)}</h3>
      </div>
      <p>${esc(p.title || '')}</p>
      <p class="mono" style="font-size:12.5px;color:#4f46e5;margin-bottom:12px">${esc(p.username)}.portfoolio.me</p>
      <div style="display:flex;gap:8px">
        <a class="btn btn-primary btn-sm" href="/?u=${encodeURIComponent(p.username)}">Visit Site <span>→</span></a>
      </div>
    </div>`;
  }).join('');
  window.scrollTo(0, 0);
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', async () => {
  // ---- /explore : public directory of all portfolios ----
  if (/^\/explore\/?$/.test(location.pathname)) {
    document.body.classList.remove('lx');
    const land = document.getElementById('landing');
    if (land) land.style.display = 'none';
    const appEl = document.getElementById('app');
    if (appEl) appEl.style.display = '';
    renderExplorePage();
    return;
  }

  // Landing page: hero preview theme switcher
  const heroPreview = document.getElementById('heroPreview');
  if (heroPreview) {
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const theme = dot.dataset.theme;
        const avatars = {
          midnight: { bg: 'linear-gradient(135deg,#6c6cf5,#22d3ee)', label: 'Y', color: '#fff' },
          minimal: { bg: '#e8eaf0', label: 'Y', color: '#1e293b' },
          terminal: { bg: '#0a0f0a', label: '>', color: '#4ade80' },
          creative: { bg: 'linear-gradient(135deg,#f472b6,#8b5cf6)', label: 'Y', color: '#fff' },
        };
        const avatar = heroPreview.querySelector('.preview-avatar');
        if (avatar && avatars[theme]) {
          avatar.style.background = avatars[theme].bg;
          avatar.textContent = avatars[theme].label;
          avatar.style.color = avatars[theme].color;
        }
        // Update theme indicators
        document.querySelectorAll('.theme-dot').forEach(d => {
          d.style.transform = d === dot ? 'scale(1.25)' : 'scale(1)';
          d.style.boxShadow = d === dot ? '0 0 12px currentColor' : 'none';
        });
      });
    });
  }

  // Landing preview frame: subtle mousemove tilt (desktop only)
  const previewFrame = document.getElementById('previewFrame');
  const heroVisual = document.getElementById('heroVisual');
  if (previewFrame && heroVisual && window.matchMedia('(pointer:fine)').matches) {
    heroVisual.addEventListener('mousemove', (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      previewFrame.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      previewFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
    previewFrame.style.transition = 'transform .25s ease';
  }

  // Landing: reveal sections on scroll
  const revealEls = document.querySelectorAll('#landing .lx-section, #landing .lx-logos');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => ro.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Landing nav: shrink on scroll + highlight current section
  const mainNav = document.getElementById('mainNav');
  const spySections = ['features','directory','howitworks','auth'].map(id => document.getElementById(id)).filter(Boolean);
  if (mainNav) {
    const onScroll = () => {
      mainNav.classList.toggle('scrolled', window.scrollY > 24);
      const prog = document.getElementById('scrollProgress');
      if (prog) {
        const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        prog.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
      }
      if (spySections.length) {
        let current = '';
        spySections.forEach(s => { if (window.scrollY + 140 >= s.offsetTop) current = s.id; });
        document.querySelectorAll('.nav-link').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Landing page: animated stats counter on scroll
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.target || '0');
            const suffix = el.dataset.suffix || '';
            const duration = 1500;
            const start = Date.now();
            const animate = () => {
              const progress = Math.min((Date.now() - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              el.textContent = Math.floor(target * eased) + suffix;
              if (progress < 1) requestAnimationFrame(animate);
            };
            animate();
            // Animate ring progress
            const ring = el.closest('.stat-item')?.querySelector('.stat-ring-progress');
            if (ring) {
              const circumference = 2 * Math.PI * 34;
              ring.style.strokeDashoffset = circumference * (1 - 1); // will animate to 0
              ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.2,.7,.2,1)';
              setTimeout(() => { ring.style.strokeDashoffset = '0'; }, 100);
            }
          });
          observer.unobserve(statsBar);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsBar);
  }

  // Landing Hero Interactive Theme Switcher
  const initHeroThemeSwitcher = () => {
    const previewFrame = document.getElementById('previewFrame');
    const themeBtns = document.querySelectorAll('.theme-dot-btn, .footer-theme-btn');
    if (!previewFrame || !themeBtns.length) return;

    const themePresets = {
      midnight: {
        name: 'Your Name',
        title: 'Full-Stack Developer',
        desc: 'Building scalable web apps & AI solutions. Open to opportunities.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker']
      },
      minimal: {
        name: 'Alex Morgan',
        title: 'Product Engineer',
        desc: 'Crafting thoughtful digital interfaces with clean architecture.',
        skills: ['UI/UX', 'Next.js', 'Tailwind', 'GraphQL', 'SwiftUI', 'Figma']
      },
      terminal: {
        name: 'dev@root:~$',
        title: 'Systems & Backend Engineer',
        desc: 'Kernel hacker, Rust enthusiast, distributed systems builder.',
        skills: ['Rust', 'Go', 'Kubernetes', 'Linux', 'gRPC', 'eBPF']
      },
      creative: {
        name: 'Maya Lin',
        title: 'Creative Technologist',
        desc: 'Blending generative art, WebGL, and interactive 3D experiences.',
        skills: ['Three.js', 'WebGL', 'GLSL', 'Canvas', 'GSAP', 'Shader']
      },
      aurora: {
        name: 'Jordan Kai',
        title: 'Cloud Architect',
        desc: 'Designing resilient cloud platforms, serverless microservices & DevOps pipelines.',
        skills: ['AWS', 'Terraform', 'Docker', 'CI/CD', 'Python', 'Prometheus']
      }
    };

    const switchTheme = (themeName) => {
      const preset = themePresets[themeName] || themePresets.midnight;
      previewFrame.setAttribute('data-active-theme', themeName);

      themeBtns.forEach(btn => {
        if (btn.dataset.theme === themeName) {
          btn.classList.add('active');
  } else if (document.body.dataset.template === 'catalog') {
    headHtml = `<header class="wrap gal-catalog-head">
      <p class="cat-kicker">— CATALOGUE —</p>
      <h1>${esc(p.name)}</h1>
      <p class="cat-sub">${esc(p.title || '')}</p>
      <p class="cat-meta">${esc(p.location || '')} · ${countLabel}</p>
      ${srcAvatar ? `<img class="cat-portrait" src="${esc(srcAvatar)}" alt="${esc(p.name || '')}">` : ''}
    </header>`;
    gridHtml = `<section class="wrap cat-index">${works.map((w, i) => `
      <article class="cat-row" data-gal="${i}">
        <span class="cat-no">${String(i + 1).padStart(2, '0')}</span>
        <div class="cat-thumb"><img src="${esc(w.imageUrl)}" alt="${esc(w.title || '')}" loading="lazy"></div>
        <div class="cat-text"><b>${esc(w.title || 'Untitled')}</b>${w.category ? `<small>${esc(w.category)}</small>` : ''}${w.desc ? `<p>${esc(w.desc)}</p>` : ''}</div>
        <span class="cat-arrow">→</span>
      </article>`).join('') || emptyMsg}</section>`;
  } else {
          btn.classList.remove('active');
        }
      });

      const nameEl = document.getElementById('previewName');
      const titleEl = document.getElementById('previewTitle');
      const descEl = document.getElementById('previewDesc');
      const skillsEl = document.getElementById('previewSkills');

      if (nameEl) nameEl.textContent = preset.name;
      if (titleEl) titleEl.textContent = preset.title;
      if (descEl) descEl.textContent = preset.desc;
      if (skillsEl) {
        skillsEl.innerHTML = preset.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
      }
    };

    themeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const theme = btn.dataset.theme;
        if (theme) switchTheme(theme);
      });
    });

    // Default to midnight
    switchTheme('midnight');
  };

  // Theme gallery lightbox
  const themeModal = document.getElementById('themeModal');
  if (themeModal) {
    const modalBody = document.getElementById('modalBody');
    const modalName = document.getElementById('modalThemeName');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalSkills = document.getElementById('modalSkills');
    const modalThemeBtns = document.querySelectorAll('#modalThemes .footer-theme-btn');
    const modalPresets = {
      midnight: { name: 'Your Name', title: 'Full-Stack Developer', desc: 'Building scalable web apps. Open to opportunities.', skills: ['React', 'TypeScript', 'Node.js'] },
      minimal: { name: 'Alex Morgan', title: 'Product Engineer', desc: 'Crafting thoughtful digital interfaces with clean architecture.', skills: ['UI/UX', 'Next.js', 'Tailwind'] },
      terminal: { name: 'dev@root:~$', title: 'Systems & Backend Engineer', desc: 'Kernel hacker, Rust enthusiast, distributed systems builder.', skills: ['Rust', 'Go', 'Kubernetes'] },
      creative: { name: 'Maya Lin', title: 'Creative Technologist', desc: 'Blending generative art, WebGL, and interactive 3D experiences.', skills: ['Three.js', 'WebGL', 'GLSL'] },
      aurora: { name: 'Jordan Kai', title: 'Cloud Architect', desc: 'Designing resilient cloud platforms, serverless microservices & DevOps pipelines.', skills: ['AWS', 'Terraform', 'Docker'] }
    };
    let lastFocus = null;
    const openModal = (theme, name) => {
      lastFocus = document.activeElement;
      modalBody.setAttribute('data-theme', theme);
      modalName.textContent = name || theme;
      const preset = modalPresets[theme] || modalPresets.midnight;
      if (modalAvatar) modalAvatar.textContent = (preset.name || 'Y').trim().charAt(0).toUpperCase();
      if (modalTitle) modalTitle.textContent = preset.title;
      if (modalDesc) modalDesc.textContent = preset.desc;
      if (modalSkills) modalSkills.innerHTML = preset.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
      modalThemeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
      themeModal.classList.add('open');
      themeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = themeModal.querySelector('.lx-modal-close');
      if (closeBtn) closeBtn.focus();
    };
    const closeModal = () => {
      themeModal.classList.remove('open');
      themeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    document.querySelectorAll('.lx-theme-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.theme, card.dataset.name));
    });
    modalThemeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        modalBody.setAttribute('data-theme', theme);
        modalName.textContent = btn.textContent;
        modalThemeBtns.forEach(b => b.classList.toggle('active', b === btn));
      });
    });
    themeModal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && themeModal.classList.contains('open')) closeModal();
    });
  }

  // Hero Ambient Canvas Particle Effect
  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight || 500;

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 108, 245, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(render);
    };
    render();

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    });
  };

  initHeroThemeSwitcher();
  initHeroCanvas();

  const resumeUser = getResumeUser();
  const requested = resumeUser || getRequestedUser();
  document.body.classList.toggle('lx', !requested);
  if (!requested) return; // landing view stays
  document.getElementById('landing').style.display = 'none';
  document.getElementById('app').style.display = '';
  const p = await loadProfile(requested);
  if (!p) { renderNotFound(requested); return; }
  trackProfileView(requested);
  if (resumeUser) { renderResumePage(p); return; }
  if (p.site_type === 'upload') { renderUploadedSite(p); return; }
  if (p.track === 'visual') { renderGallery(p); return; }
  const skill = new URLSearchParams(location.search).get('skill');
  if (skill) renderSkillPage(p, skill); else renderPortfolio(p);

  // Browser Back from a work detail returns to the gallery
  window.addEventListener('popstate', async (e) => {
    const s = e.state || {};
    if (s.view === 'work' && requested) {
      const pp = await loadProfile(requested);
      if (!pp) return;
      if (pp.track === 'visual') { renderGallery(pp); return; }
      renderPortfolio(pp);
    }
  });
});
