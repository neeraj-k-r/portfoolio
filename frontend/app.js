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

async function loadProfile(username) {
  const u = username.toLowerCase();
  // 1. cloud (Supabase) — live on every device, when owner connects it
  try {
    if (typeof cloudEnabled === 'function' && cloudEnabled()) {
      const c = await cloudGetProfile(u);
      if (c) return c;
    }
  } catch {}
  // 2. localStorage (user-created, this browser)
  const local = store.get(u);
  if (local) return local;
  // 2. seed JSON files
  try {
    const r = await fetch(`profiles/${encodeURIComponent(u)}.json`, { cache: 'no-store' });
    if (r.ok) return await r.json();
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
function renderPortfolio(p) {
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
          ${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
          ${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}" target="_blank"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
        </div>
        <div class="hero-meta">
          ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${esc(p.location)}</span>` : ''}
          ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${esc(p.email)}</span>` : ''}
          ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${esc(p.phone)}</span>` : ''}
        </div>
      </div>
      <div class="visual"><div class="avatar-card"><div class="avatar-inner">
        <div style="width:120px;height:120px;border-radius:50%;margin:0 auto;display:grid;place-items:center;font-size:52px;background:linear-gradient(135deg,#6c6cf5,#22d3ee)">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</div>
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
  <section class="wrap">
    <div class="card" style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      <div><h3>Like this portfolio?</h3><p>Claim yours free — <b style="color:#fff">yourname.portfoolio.me</b> in 60 seconds.</p></div>
      <a class="btn btn-primary" href="/">Create mine <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </section>
  <footer><div class="wrap foot"><div>© ${new Date().getFullYear()} <b style="color:#fff">${esc(p.name)}</b> via <b style="color:#fff">portfoolio.me</b></div>
  <div class="socials">${p.github ? `<a href="${esc(p.github)}" target="_blank"><i class="fa-brands fa-github"></i></a>` : ''}${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank"><i class="fa-brands fa-linkedin"></i></a>` : ''}${p.email ? `<a href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i></a>` : ''}</div></div></footer>`;
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

// ---- Boot ----
document.addEventListener('DOMContentLoaded', async () => {
  const requested = getRequestedUser();
  if (!requested) return; // landing view stays
  document.getElementById('landing').style.display = 'none';
  document.getElementById('app').style.display = '';
  const p = await loadProfile(requested);
  if (!p) { renderNotFound(requested); return; }
  const skill = new URLSearchParams(location.search).get('skill');
  if (skill) renderSkillPage(p, skill); else renderPortfolio(p);
});
