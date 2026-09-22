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
  // 1. localStorage (user-created)
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
  const skills = (p.skills || []).map(s => `<span class="badge">✦ ${esc(s)}</span>`).join('');
  const projects = (p.projects || []).map(pr => `
    <article class="proj">
      <div class="proj-top p2"><span>${esc(pr.emoji || '🚀')}</span><div class="stars">${esc(pr.stars || 'Live')}</div></div>
      <div class="proj-body"><h3>${esc(pr.title)}</h3><p>${esc(pr.desc)}</p>
      <div class="tags">${(pr.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="proj-actions"><a class="primary" href="${esc(pr.url)}" target="_blank" rel="noopener">Code <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>
      </div>
    </article>`).join('');
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
        <div class="badges">${skills}</div>
      </div></div></div>
    </div>
  </header>
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

// ---- Boot ----
document.addEventListener('DOMContentLoaded', async () => {
  const requested = getRequestedUser();
  if (!requested) return; // landing view stays
  document.getElementById('landing').style.display = 'none';
  document.getElementById('app').style.display = '';
  const p = await loadProfile(requested);
  if (p) renderPortfolio(p); else renderNotFound(requested);
});
