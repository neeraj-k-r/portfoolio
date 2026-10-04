/* portfoolio.me — base portfolio templates */
const TEMPLATES = [
  { id: 'midnight', name: 'Midnight Wow', desc: 'Dark + neon, hire-me focused', emoji: '🌌', best: 'Developers • AI engineers' },
  { id: 'minimal', name: 'Minimal Clean', desc: 'Light, recruiter & ATS friendly', emoji: '📄', best: 'SDE • Internships' },
  { id: 'terminal', name: 'Terminal Hacker', desc: 'Mono + green, dev cred', emoji: '💻', best: 'Backend • OSS' },
  { id: 'creative', name: 'Creative Pop', desc: 'Gradient playful, stand out', emoji: '🎨', best: 'Frontend • Design' },
  { id: 'aurora', name: 'Aurora Glass', desc: 'Frosted glass over aurora gradients', emoji: '🔮', best: 'Designers • Full-stack' },
  { id: 'editorial', name: 'Editorial Serif', desc: 'Print-style serif, calm + credible', emoji: '📰', best: 'Writers • Consultants' },
  { id: 'brutalist', name: 'Neo-Brutalist', desc: 'Bold blocks, stickers, shadows', emoji: '🧱', best: 'Indie hackers • Memorable' },
  { id: 'afterglow', name: 'Afterglow', desc: 'Sunset neon over plum dusk', emoji: '🌇', best: 'Original • Warm neon' },
  { id: 'ultraviolet', name: 'Ultraviolet', desc: 'Violet haze, electric glow', emoji: '🟣', best: 'Original • Haze neon' },
  { id: 'tidepool', name: 'Tidepool', desc: 'Bioluminescent deep-teal abyss', emoji: '🪼', best: 'Original • Abyss glow' },
];

function tplEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function normTpl(p) {
  if (p) {
    if (p.avatar_url && !p.avatarUrl) p.avatarUrl = p.avatar_url || '';
    if (p.avatarUrl && !p.avatar_url) p.avatar_url = p.avatarUrl || '';
    if (typeof p.show_instagram === 'boolean' && typeof p.showInstagram === 'undefined') p.showInstagram = p.show_instagram;
    if (typeof p.showInstagram === 'boolean' && typeof p.show_instagram === 'undefined') p.show_instagram = p.showInstagram;
  }
  return p;
}
function tplShowInsta(p) {
  try { if (typeof shouldShowInsta === 'function') return shouldShowInsta(p); } catch {}
  if (!p || !p.instagram) return false;
  if (p.showInstagram === false || p.show_instagram === false) return false;
  return true;
}
function tplFoot(p) {
  return `<footer><div class="wrap foot"><div>© ${new Date().getFullYear()} <b>${tplEsc(p.name)}</b> via <b>portfoolio.me</b> • template: ${tplEsc(p.template || 'midnight')}</div>
  <div class="socials">${p.github ? `<a href="${tplEsc(p.github)}" target="_blank"><i class="fa-brands fa-github"></i></a>` : ''}${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank"><i class="fa-brands fa-linkedin"></i></a>` : ''}${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank"><i class="fa-brands fa-instagram"></i></a>` : ''}${p.email ? `<a href="mailto:${tplEsc(p.email)}"><i class="fa-solid fa-envelope"></i></a>` : ''}</div></div></footer>`;
}
function tplNav(p) {
  return `<nav><a class="logo" href="/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${tplEsc(p.username)}.portfoolio.me</small></span></a>
  <div style="display:flex;gap:10px"><a class="btn btn-ghost btn-sm" href="/">Make yours</a>
  ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${tplEsc(p.email)}">Hire ${tplEsc((p.name || '').split(' ')[0])}</a>` : ''}</div></nav>`;
}

function renderMinimal(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'minimal';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">${tplEsc(s)}</span></a>`).join('');
  const projects = (p.projects || []).map((pr) => `
    <div class="card"><h3>${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <div class="tags">${(pr.tags || []).map((t) => `<span>${tplEsc(t)}</span>`).join('')}</div>
    <div style="margin-top:10px"><a class="btn btn-ghost btn-sm" href="${tplEsc(pr.url)}" target="_blank">View project →</a></div></div>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <section class="wrap" style="padding:140px 0 30px"><div class="card">
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
    ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" style="width:96px;height:96px;border-radius:16px;object-fit:cover">` : ''}
    <div><p class="mono" style="font-size:13px;color:#4f46e5">${tplEsc(p.location || '')} • available ${p.available ? 'now' : 'soon'}</p>
    <h1 style="font-size:clamp(36px,5vw,56px);line-height:1.05;margin:8px 0">${tplEsc(p.name)}</h1></div></div>
    <h2 style="font-size:20px;color:#334155">${tplEsc(p.title)}</h2>
    <p style="color:#475569;max-width:640px;margin:10px 0">${tplEsc(p.tagline || '')}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
      ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${tplEsc(p.email)}">Email me</a>` : ''}
      ${p.github ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.github)}" target="_blank">GitHub</a>` : ''}
      ${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.linkedin)}" target="_blank">LinkedIn</a>` : ''}${tplShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.instagram)}" target="_blank">Instagram</a>` : ''}
      ${p.phone ? `<span class="badge">☎ ${tplEsc(p.phone)}</span>` : ''}
    </div></div>
    <div class="two" style="margin-top:14px"><div class="card"><h3>Skills</h3><div class="badges" style="justify-content:flex-start;margin-top:10px">${skills}</div></div>
    <div class="card"><h3>Contact</h3><p class="mono" style="font-size:13px">${tplEsc(p.email || '')}<br>${tplEsc(p.phone || '')}<br>${tplEsc(p.location || '')}</p></div></div>
    <h2 class="title" style="margin-top:26px">Selected work</h2><div class="dir-grid">${projects}</div>
  </section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderTerminal(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'terminal';
  document.title = `${p.name} ~ $ whoami | portfoolio.me`;
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">${tplEsc(s)}</span></a>`).join(' ');
  const projects = (p.projects || []).map((pr) => `
    <div class="card"><p class="mono" style="color:#4ade80">$ open ${tplEsc(pr.title.toLowerCase().replace(/\s+/g, '-'))}</p>
    <h3>> ${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <p class="mono" style="font-size:12.5px;color:#86efac">${(pr.tags || []).map(tplEsc).join(' • ')}</p>
    <a class="btn btn-ghost btn-sm" href="${tplEsc(pr.url)}" target="_blank">$ visit --url →</a></div>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <section class="wrap" style="padding:140px 0 30px">
    <div class="card"><p class="mono">$ whoami</p><h1>${tplEsc(p.name)} <span style="color:#4ade80">@${tplEsc(p.username)}</span></h1>
    ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" style="width:96px;height:96px;border-radius:12px;object-fit:cover;margin:10px 0;border:1px solid #166534">` : ''}
    <p class="mono" style="color:#86efac">${tplEsc(p.title)} — ${tplEsc(p.location || 'remote')}</p>
    <p style="margin-top:8px">${tplEsc(p.tagline || '')}</p>
    <p class="mono" style="margin-top:10px">$ contact --email ${tplEsc(p.email || '')} ${p.github ? `--github ${tplEsc(p.github)}` : ''}${p.linkedin ? ` --linkedin ${tplEsc(p.linkedin)}` : ''}${tplShowInsta(p) ? ` --instagram ${tplEsc(p.instagram)}` : ''}</p></div>
    <div class="card" style="margin-top:14px"><p class="mono">$ ls --skills</p><div style="margin-top:8px">${skills}</div></div>
    <h2 class="title" style="margin-top:22px">$ ls --projects</h2><div class="dir-grid">${projects}</div>
  </section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderCreative(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'creative';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const icon = (typeof projIcon === 'function') ? projIcon : (pr) => `<span style="font-size:56px">${tplEsc(pr.emoji || '*')}</span>`;
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">${tplEsc(s)}</span></a>`).join('');
  const projects = (p.projects || []).map((pr, i) => `
    <article class="proj"><div class="proj-top p${(i % 6) + 1}"><div class="proj-art">${icon(pr)}</div></div>
    <div class="proj-body"><h3>${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <div class="tags">${(pr.tags || []).map((t) => `<span>${tplEsc(t)}</span>`).join('')}</div>
    <div class="proj-actions"><a class="primary" href="${tplEsc(pr.url)}" target="_blank">Explore →</a></div></div></article>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <header class="hero wrap"><div style="text-align:center;padding:40px 0 10px">
    ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" style="width:96px;height:96px;border-radius:28px;object-fit:cover;margin:0 auto 10px;display:block">` : `<div style="width:96px;height:96px;border-radius:28px;margin:0 auto;display:grid;place-items:center;font-size:44px;font-weight:800;color:#fff;background:linear-gradient(135deg,#f472b6,#8b5cf6,#22d3ee);box-shadow:0 18px 44px rgba(139,92,246,.45)">${tplEsc((p.name || '?').trim().charAt(0).toUpperCase())}</div>`}
    <h1 style="font-size:clamp(40px,7vw,76px)">${tplEsc(p.name)}</h1>
    <p class="sub" style="margin:10px auto;max-width:600px">${tplEsc(p.title)} • ${tplEsc(p.tagline || '')}</p>
    <div class="badges" style="justify-content:center">${skills}</div>
    <div class="hero-cta" style="justify-content:center;display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      ${p.email ? `<a class="btn btn-primary" href="mailto:${tplEsc(p.email)}">Say hi 👋</a>` : ''}
      ${p.github ? `<a class="btn btn-ghost" href="${tplEsc(p.github)}" target="_blank">GitHub</a>` : ''}
      ${p.linkedin ? `<a class="btn btn-ghost" href="${tplEsc(p.linkedin)}" target="_blank">LinkedIn</a>` : ''}
      ${tplShowInsta(p) ? `<a class="btn btn-ghost" href="${tplEsc(p.instagram)}" target="_blank">Instagram</a>` : ''}
    </div></div></header>
  <section class="wrap"><div class="proj-grid">${projects}</div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderAurora(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'aurora';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const icon = (typeof projIcon === 'function') ? projIcon : (() => '');
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">${tplEsc(s)}</span></a>`).join('');
  const projects = (p.projects || []).map((pr, i) => `
    <article class="proj"><div class="proj-top p${(i % 6) + 1}"><div class="proj-art">${icon(pr)}</div><div class="stars">${tplEsc(pr.stars || 'Live')}</div></div>
    <div class="proj-body"><h3>${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <div class="tags">${((pr.technologies || pr.tags) || []).map((t) => `<span>${tplEsc(t)}</span>`).join('')}</div>
    <div class="proj-actions"><a class="primary" href="${tplEsc(pr.url)}" target="_blank">View →</a>${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank">Demo</a>` : ''}</div></div></article>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <header class="hero wrap"><div style="text-align:center;padding:50px 0 10px">
    ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block">` : ''}
    <p class="mono" style="letter-spacing:3px;font-size:12px;opacity:.8">✦ PORTFOLIO ${new Date().getFullYear()} ✦</p>
    <h1 style="font-size:clamp(44px,7.5vw,84px);line-height:1.02">${tplEsc(p.name)}</h1>
    <p class="sub" style="margin:12px auto;max-width:560px">${tplEsc(p.title)} — ${tplEsc(p.tagline || '')}</p>
    <div class="badges" style="justify-content:center">${skills}</div>
    <div class="hero-cta" style="justify-content:center;display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
      ${p.email ? `<a class="btn btn-primary" href="mailto:${tplEsc(p.email)}">Get in touch</a>` : ''}
      ${p.github ? `<a class="btn btn-ghost" href="${tplEsc(p.github)}" target="_blank">GitHub</a>` : ''}
      ${p.linkedin ? `<a class="btn btn-ghost" href="${tplEsc(p.linkedin)}" target="_blank">LinkedIn</a>` : ''}${tplShowInsta(p) ? `<a class="btn btn-ghost" href="${tplEsc(p.instagram)}" target="_blank">Instagram</a>` : ''}
    </div></div></header>
  <section class="wrap"><span class="eyebrow">● Selected work</span><div class="proj-grid" style="margin-top:16px">${projects || '<p>No projects yet.</p>'}</div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderEditorial(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'editorial';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">${tplEsc(s)}</span></a>`).join(' ');
  const projects = (p.projects || []).map((pr, i) => `
    <div class="card" style="margin-bottom:12px"><p class="mono" style="font-size:12px;opacity:.7">No. ${String(i + 1).padStart(2, '0')}</p>
    <h3 style="font-size:24px">${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <p style="font-size:13px"><i>${((pr.technologies || pr.tags) || []).map(tplEsc).join(' · ')}</i></p>
    <p><a href="${tplEsc(pr.url)}" target="_blank" style="font-weight:800">Read the story →</a>${pr.demoUrl ? ` &nbsp;·&nbsp; <a href="${tplEsc(pr.demoUrl)}" target="_blank" style="font-weight:800">Live demo →</a>` : ''}</p></div>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <section class="wrap" style="padding:140px 0 20px;max-width:760px">
    ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;margin-bottom:12px">` : ''}
    <p class="mono" style="font-size:13px">The portfolio of</p>
    <h1 style="font-size:clamp(44px,7vw,76px);line-height:1.02">${tplEsc(p.name)}</h1>
    <h2 style="font-size:22px;font-style:italic">${tplEsc(p.title)}</h2>
    <p style="font-size:18px;margin-top:10px">${esc2(p.tagline)}</p>
    <p style="margin-top:12px">${p.email ? `<a href="mailto:${tplEsc(p.email)}" style="font-weight:800">${tplEsc(p.email)}</a>` : ''}${p.location ? ` · ${tplEsc(p.location)}` : ''}${p.github ? ` · <a href="${tplEsc(p.github)}" target="_blank" style="font-weight:800">GitHub</a>` : ''}${p.linkedin ? ` · <a href="${tplEsc(p.linkedin)}" target="_blank" style="font-weight:800">LinkedIn</a>` : ''}${tplShowInsta(p) ? ` · <a href="${tplEsc(p.instagram)}" target="_blank" style="font-weight:800">Instagram</a>` : ''}</p>
    <hr style="margin:22px 0;border:none;border-top:2px solid currentColor;opacity:.2">
    <h3>Index of capabilities</h3><div style="margin-top:8px">${skills || '<p>No skills listed yet.</p>'}</div>
  </section>
  <section class="wrap" style="max-width:760px"><h2 style="font-size:32px">Selected work</h2><div style="margin-top:14px">${projects || '<p>No projects yet.</p>'}</div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}
function esc2(s) { return tplEsc(s || ''); }
// Resume section (shared) — auto-built from profile info, themed via profile.resume.theme
function rsSec(p) { return (window.PortfoolioResume ? window.PortfoolioResume.sectionHTML(p) : ''); }

function renderBrutalist(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'brutalist';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">★ ${tplEsc(s)}</span></a>`).join(' ');
  const projects = (p.projects || []).map((pr) => `
    <div class="card"><h3 style="font-size:22px">■ ${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <p>${((pr.technologies || pr.tags) || []).map((t) => `<span class="badge">${tplEsc(t)}</span>`).join(' ')}</p>
    <p><a class="btn btn-primary btn-sm" href="${tplEsc(pr.url)}" target="_blank">CODE →</a> ${pr.demoUrl ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(pr.demoUrl)}" target="_blank">DEMO →</a>` : ''}</p></div>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <section class="wrap" style="padding:140px 0 20px">
    <span class="badge">● OPEN FOR WORK</span>
    <div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin-top:12px">
    <div style="flex:1;min-width:260px;">
    <h1 style="font-size:clamp(46px,8vw,96px);line-height:.95;text-transform:uppercase">${tplEsc(p.name)}</h1>
    <h2 style="font-size:clamp(20px,3vw,30px);background:#000;color:#fef08a;display:inline-block;padding:6px 14px;margin-top:10px">${tplEsc(p.title)}</h2>
    <p class="sub" style="margin-top:12px;max-width:600px;font-weight:600">${esc2(p.tagline)}</p>
    <div style="margin-top:12px">${skills}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      ${p.email ? `<a class="btn btn-primary" href="mailto:${tplEsc(p.email)}">HIRE ME →</a>` : ''}
      ${p.github ? `<a class="btn btn-ghost" href="${tplEsc(p.github)}" target="_blank">GITHUB →</a>` : ''}
      ${p.linkedin ? `<a class="btn btn-ghost" href="${tplEsc(p.linkedin)}" target="_blank">LINKEDIN →</a>` : ''}
      ${tplShowInsta(p) ? `<a class="btn btn-ghost" href="${tplEsc(p.instagram)}" target="_blank">INSTAGRAM →</a>` : ''}
    </div>
    </div>
    ${p.avatarUrl ? `<div class="brut-portrait"><img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}"></div>` : ''}
    </div>
  </section>
  <section class="wrap"><h2 style="font-size:34px">▼ WORK</h2><div class="dir-grid" style="margin-top:14px">${projects || '<p>No projects yet.</p>'}</div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderAfterglow(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'afterglow';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const icon = (typeof projIcon === 'function') ? projIcon : (() => '');
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">${tplEsc(s)}</span></a>`).join('');
  const projects = (p.projects || []).map((pr, i) => `
    <div class="ag-row"><span class="ag-num">${String(i + 1).padStart(2, '0')}</span>
    <div style="flex:1;min-width:220px"><h3>${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <div class="tags">${((pr.technologies || pr.tags) || []).map((t) => `<span>${tplEsc(t)}</span>`).join('')}</div></div>
    <div style="display:flex;gap:8px;align-items:center;flex-shrink:0"><a class="btn btn-primary btn-sm" href="${tplEsc(pr.url)}" target="_blank">View →</a>${pr.demoUrl ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(pr.demoUrl)}" target="_blank">Demo</a>` : ''}</div></div>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <header class="hero wrap"><div class="ag-split">
    <div>
    <p class="mono ag-kicker">— GOLDEN HOUR, SHIPPED —</p>
    <h1>${tplEsc(p.name)}</h1>
    <div class="ag-sunbar"></div>
    <p class="sub">${tplEsc(p.title)} — ${tplEsc(p.tagline || '')}</p>
    <div class="badges" style="justify-content:flex-start;margin-top:12px">${skills}</div>
    <div class="hero-cta" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
      ${p.email ? `<a class="btn btn-primary" href="mailto:${tplEsc(p.email)}">Say hello</a>` : ''}
      ${p.github ? `<a class="btn btn-ghost" href="${tplEsc(p.github)}" target="_blank">GitHub</a>` : ''}
      ${p.linkedin ? `<a class="btn btn-ghost" href="${tplEsc(p.linkedin)}" target="_blank">LinkedIn</a>` : ''}
      ${tplShowInsta(p) ? `<a class="btn btn-ghost" href="${tplEsc(p.instagram)}" target="_blank">Instagram</a>` : ''}
    </div></div>
    ${p.avatarUrl ? `<div class="ag-sunring"><img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}"></div>` : '<div class="ag-sunring ag-sunring-empty"></div>'}
  </div></header>
  <section class="wrap"><span class="eyebrow">● After dark, still shipping</span>
  <div style="margin-top:16px">${projects || '<p>No projects yet.</p>'}</div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderUltraviolet(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'ultraviolet';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const icon = (typeof projIcon === 'function') ? projIcon : (() => '');
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">◈ ${tplEsc(s)}</span></a>`).join(' ');
  const projects = (p.projects || []).map((pr) => `
    <div class="uv-row"><div style="flex:1;min-width:200px">
    <p class="mono" style="font-size:12px;color:#e0aaff">~/signal/${tplEsc(pr.title.toLowerCase().replace(/\s+/g, '-'))}</p>
    <h3>${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p></div>
    <div style="display:flex;gap:8px;align-items:center;flex-shrink:0"><a href="${tplEsc(pr.url)}" target="_blank" style="font-weight:800">open →</a>${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank" style="font-weight:800">demo →</a>` : ''}</div></div>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <section class="wrap" style="padding:140px 0 20px"><div class="uv-grid">
    <aside class="uv-rail">
      ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}">` : `<div class="uv-orb">${tplEsc((p.name || '?').trim().charAt(0).toUpperCase())}</div>`}
      <h1>${tplEsc(p.name)}</h1>
      <p class="mono uv-status">◉ signal: strong</p>
      <div class="uv-links">
      ${p.email ? `<a href="mailto:${tplEsc(p.email)}">email →</a>` : ''}
      ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank">github →</a>` : ''}
      ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank">linkedin →</a>` : ''}
      ${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank">instagram →</a>` : ''}
      </div>
    </aside>
    <div>
      <p class="mono" style="font-size:13px;color:#e0aaff">◈ ${tplEsc(p.title)}</p>
      <p style="margin-top:10px;max-width:560px;font-size:19px">${esc2(p.tagline)}</p>
      <div style="margin-top:12px">${skills}</div>
      <div style="margin-top:26px;height:2px;background:linear-gradient(90deg,transparent,#b5179e,#4cc9f0,transparent)"></div>
      <h2 class="mono" style="margin-top:22px;font-size:15px;color:#e0aaff">~/transmissions</h2>
      <div style="margin-top:6px">${projects || '<p>No projects yet.</p>'}</div>
    </div>
  </div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

function renderTidepool(p) {
  normTpl(p);
  const skillLink = (s) => `?u=${encodeURIComponent(p.username)}&skill=${encodeURIComponent(String(s).toLowerCase())}`;

  document.body.dataset.template = 'tidepool';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const icon = (typeof projIcon === 'function') ? projIcon : (() => '');
  const skills = (p.skills || []).map((s) => `<a href="${skillLink(s)}" style="text-decoration:none"><span class="badge">◉ ${tplEsc(s)}</span></a>`).join(' ');
  const projects = (p.projects || []).map((pr, i) => `
    <article class="proj"><div class="proj-top p${(i % 6) + 1}"><div class="proj-art">${icon(pr)}</div><div class="stars">${tplEsc(pr.stars || 'Live')}</div></div>
    <div class="proj-body"><h3>${tplEsc(pr.title)}</h3><p>${tplEsc(pr.desc)}</p>
    <div class="tags">${((pr.technologies || pr.tags) || []).map((t) => `<span>${tplEsc(t)}</span>`).join('')}</div>
    <div class="proj-actions"><a class="primary" href="${tplEsc(pr.url)}" target="_blank">Dive in →</a>${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank">Demo</a>` : ''}</div></div></article>`).join('');
  document.getElementById('app').innerHTML = `${tplNav(p)}
  <section class="wrap" style="padding:140px 0 20px">
    <div class="card"><p class="mono" style="color:#80ffdb">○ depth: portfolio trench · pressure: nominal</p>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:8px">
    ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:2px solid #80ffdb;box-shadow:0 0 30px rgba(46,196,182,.7)">` : ''}
    <div><h1 style="font-size:clamp(38px,6vw,64px)">${tplEsc(p.name)}</h1>
    <p class="mono">${esc2(p.title)} — ${tplEsc(p.location || 'remote reef')}</p></div></div>
    <p style="margin-top:10px">${esc2(p.tagline)}</p>
    <div style="margin-top:10px">${skills}</div>
    <p style="margin-top:12px">${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${tplEsc(p.email)}">Send a bubble</a>` : ''} ${p.github ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.github)}" target="_blank">GitHub</a>` : ''} ${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.linkedin)}" target="_blank">LinkedIn</a>` : ''} ${tplShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.instagram)}" target="_blank">Instagram</a>` : ''}</p></div>
  </section>
  <section class="wrap"><h2 class="title">Catch of the <span class="grad">day</span></h2><div class="proj-grid tp-zig" style="margin-top:14px">${projects || '<p>Nothing surfaced yet.</p>'}</div></section>${rsSec(p)}${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

window.PortfoolioTemplates = { minimal: renderMinimal, terminal: renderTerminal, creative: renderCreative, aurora: renderAurora, editorial: renderEditorial, brutalist: renderBrutalist, afterglow: renderAfterglow, ultraviolet: renderUltraviolet, tidepool: renderTidepool };
window.PortfoolioTemplateList = TEMPLATES;
