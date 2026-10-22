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
  { id: 'motion', name: 'Motion Flow', desc: 'Light cream, animated word reveal, work rows', emoji: '⚡', best: 'Designers • Motion lovers' },
  { id: 'darkpro', name: 'Dark Pro', desc: 'Dark sidebar nav with gold accent', emoji: '🌑', best: 'Product designers • Dark UI' },
  { id: 'fullpage', name: 'Fullpage Scroll', desc: 'Full-height sections, red accent, slider', emoji: '📄', best: 'Agencies • Bold presentation' },
  { id: 'moderncv', name: 'Modern CV', desc: 'Interactive dev portfolio with animations, RTL support', emoji: '💼', best: 'Full Stack • UI/UX • Bilingual' },
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
    <div class="tags">${((pr.technologies || pr.tags) || []).map((t) => `<span>${tplEsc(t)}</span>`).join('')}</div>
    <div style="margin-top:10px"><a class="btn btn-ghost btn-sm" href="${tplEsc(pr.url)}" target="_blank">View project →</a>${pr.demoUrl ? ` <a class="btn btn-ghost btn-sm" href="${tplEsc(pr.demoUrl)}" target="_blank">Demo →</a>` : ''}</div></div>`).join('');
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

// Motion Flow (Dominique R. style) — light cream, word-reveal hero, work rows, live stats
const MOTION_GRADS = [
  'linear-gradient(135deg,#ff6a3d,#ffb36b)',
  'linear-gradient(135deg,#3d5afe,#8ab4ff)',
  'linear-gradient(135deg,#00bfa5,#b9f6ca)',
  'linear-gradient(135deg,#8e24aa,#f48fb1)',
  'linear-gradient(135deg,#f9a825,#ffe082)',
  'linear-gradient(135deg,#00838f,#4dd0e1)',
];
function renderMotion(p) {
  normTpl(p);
  const skills = (p.skills || []).map((s) => `<span class="skill">${tplEsc(s)}</span>`).join('');
  const rows = (p.projects || []).map((pr, i) => `
    <li class="rv" style="--d:${i * 60}ms">
      <a class="row" href="${tplEsc(pr.url || '#')}" data-g="${MOTION_GRADS[i % MOTION_GRADS.length]}">
        <b>${String(i + 1).padStart(2, '0')}</b>
        <h3>${tplEsc(pr.title)}</h3>
        <span>${tplEsc((pr.technologies || pr.tags || []).slice(0, 2).join(' · '))}</span>
        <span>${pr.repo && pr.repo.updatedAt ? new Date(pr.repo.updatedAt).getFullYear() : new Date().getFullYear()}</span>
      </a>
    </li>`).join('');
  const heroWords = (p.name || p.title || 'Portfolio').split(' ');
  const heroMid = Math.max(1, Math.ceil(heroWords.length / 2));
  const heroL1 = heroWords.slice(0, heroMid).join(' ');
  const heroL2 = heroWords.slice(heroMid).join(' ');

  document.body.dataset.template = 'motion';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const app = document.getElementById('app');
  app.innerHTML = `
  <div id="bar" aria-hidden="true"></div>
  <div class="blob" aria-hidden="true"></div>
  <div class="pv" aria-hidden="true"><i></i></div>
  <nav class="motion-nav pad">
    <a class="logo" href="/">${tplEsc(p.name)}</a>
    <nav>
      <a class="hide" href="#work">Work</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </nav>
  <main id="top">
    <div class="hero pad">
      <h1 class="lx-title" aria-label="${tplEsc(p.name || p.title || 'Portfolio')}">
        <span class="w"><span style="--i:0">${tplEsc(heroL1)}</span></span>
        ${heroL2 ? `<span class="w"><span style="--i:1">${tplEsc(heroL2)}</span></span>` : ''}
      </h1>
      <div class="hero-meta">
        <p class="rv" style="--d:700ms">${tplEsc(p.title ? `${p.title}${p.tagline ? ' — ' + p.tagline : ''}` : (p.tagline || ''))}</p>
        <div class="scroll rv" style="--d:900ms"><i></i>Scroll</div>
      </div>
    </div>
    <section class="pad" id="work">
      <p class="eyebrow rv">Selected work</p>
      <ul class="work-rows">${rows || '<li class="rv">No projects yet.</li>'}</ul>
    </section>
    ${rsSec(p)}
    <section class="pad" id="about">
      <p class="eyebrow rv">About</p>
      <p class="lead rv">${tplEsc(p.tagline || p.title || '')}</p>
      ${skills ? `<div class="skills rv">${skills}</div>` : ''}
    </section>
    <section class="pad contact" id="contact">
      <p class="eyebrow rv">Say hello</p>
      <a class="big rv" href="mailto:${tplEsc(p.email || '')}">${tplEsc(p.name || 'Get in touch')}</a>
      <div class="contact-links" style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap">
        ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${tplEsc(p.email)}"><i class="fa-solid fa-envelope"></i> Email</a>` : ''}
        ${p.github ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
        ${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
        ${tplShowInsta(p) ? `<a class="btn btn-ghost btn-sm" href="${tplEsc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
      </div>
    </section>
  </main>
  <footer class="pad">
    <span>© <span id="yr"></span> ${tplEsc(p.name)}</span>
    <span>Built with portfoolio.me</span>
  </footer>`;
  if (typeof window.initMotionTheme === 'function') {
    window.initMotionTheme();
  }
  window.scrollTo(0, 0);
}

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

function dpProjectIcon(pr) {
  const t = (((pr.title || '') + ' ' + (pr.tags || []).join(' ') + ' ' + (pr.technologies || []).join(' '))).toLowerCase();
  if (/campus|college|student|school|education/.test(t)) return '<i class="fa-solid fa-graduation-cap"></i>';
  if (/ai|interview|bot|agent|robot|brain|llm|gpt/.test(t)) return '<i class="fa-solid fa-robot"></i>';
  if (/dash|lead|analy|chart|crm|sales|finance|stock/.test(t)) return '<i class="fa-solid fa-chart-line"></i>';
  if (/health|med|fit|hospital|care/.test(t)) return '<i class="fa-solid fa-heart-pulse"></i>';
  if (/whatsapp|chat|support|message|social/.test(t)) return '<i class="fa-solid fa-comments"></i>';
  if (/game|monopoly|play|fun|arcade/.test(t)) return '<i class="fa-solid fa-gamepad"></i>';
  if (/web|app|site|frontend|design|ui/.test(t)) return '<i class="fa-solid fa-laptop-code"></i>';
  return '<i class="fa-solid fa-code"></i>';
}

// Dark Pro (Dark portfolio style) — sticky sidebar nav, gold accent, dark cards
function renderDarkpro(p) {
  normTpl(p);
  const skills = (p.skills || []).map((s) => `<li><span class="skill-name">${tplEsc(s)}</span></li>`).join('');
  const projects = (p.projects || []).map((pr) => {
    const screenshot = pr.image || pr.imageUrl || pr.screenshot || (pr.repo && pr.repo.screenshot ? pr.repo.screenshot : '');
    return `
    <li class="proj-item">
      <a href="${tplEsc(pr.url || '#')}" target="_blank" rel="noopener">
        <figure class="proj-img">
          ${screenshot
            ? `<div class="proj-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></div><img src="${tplEsc(screenshot)}" alt="${tplEsc(pr.title)}" loading="lazy" onerror="this.style.display='none'">`
            : `<div class="proj-placeholder"><div class="proj-placeholder-icon">${dpProjectIcon(pr)}</div><span class="proj-placeholder-title">${tplEsc(pr.title)}</span></div><div class="proj-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>`}
        </figure>
        <h3 class="proj-title">${tplEsc(pr.title)}</h3>
        <p class="proj-cat">${tplEsc((pr.technologies || pr.tags || []).slice(0, 2).join(' • ') || 'Project')}</p>
      </a>
    </li>`;
  }).join('');

  document.body.dataset.template = 'darkpro';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const app = document.getElementById('app');
  app.innerHTML = `
  <main class="dp-shell">
    <aside class="dp-sidebar">
      <div class="dp-info">
        <figure class="dp-avatar">
          ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}">` : `<span>${tplEsc((p.name || '?').charAt(0).toUpperCase())}</span>`}
        </figure>
        <div class="dp-ident">
          <h1 class="dp-name">${tplEsc(p.name)}</h1>
          <p class="dp-title">${tplEsc(p.title)}</p>
        </div>
      </div>
      <div class="dp-sep"></div>
      <ul class="dp-contacts">
        ${p.email ? `<li><i class="fa-regular fa-envelope"></i><a href="mailto:${tplEsc(p.email)}">${tplEsc(p.email)}</a></li>` : ''}
        ${p.phone ? `<li><i class="fa-solid fa-phone"></i><a href="tel:${tplEsc(p.phone)}">${tplEsc(p.phone)}</a></li>` : ''}
        ${p.location ? `<li><i class="fa-solid fa-location-dot"></i><span>${tplEsc(p.location)}</span></li>` : ''}
        ${p.github ? `<li><i class="fa-brands fa-github"></i><a href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub</a></li>` : ''}
        ${p.linkedin ? `<li><i class="fa-brands fa-linkedin"></i><a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>` : ''}
      </ul>
      <div class="dp-sep"></div>
      <ul class="dp-social">
        ${p.github ? `<li><a href="${tplEsc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i></a></li>` : ''}
        ${p.linkedin ? `<li><a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i></a></li>` : ''}
        ${tplShowInsta(p) ? `<li><a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i></a></li>` : ''}
        ${p.email ? `<li><a href="mailto:${tplEsc(p.email)}"><i class="fa-solid fa-envelope"></i></a></li>` : ''}
      </ul>
    </aside>
    <div class="dp-main">
      <nav class="dp-nav">
        <ul>
          <li><button class="dp-nav-link active" data-dp-page="about">About</button></li>
          <li><button class="dp-nav-link" data-dp-page="portfolio">Portfolio</button></li>
          <li><button class="dp-nav-link" data-dp-page="resume">Resume</button></li>
          <li><button class="dp-nav-link" data-dp-page="contact">Contact</button></li>
        </ul>
      </nav>
      <article class="dp-page active" data-dp-content="about">
        <h2 class="dp-h2">About me</h2>
        <p class="dp-text">${tplEsc(p.tagline || p.title || '')}</p>
        ${p.resume && p.resume.summary ? `<p class="dp-text">${tplEsc(p.resume.summary)}</p>` : ''}
        ${skills ? `<h3 class="dp-h3">My Skills</h3><ul class="dp-skills">${skills}</ul>` : ''}
      </article>
      <article class="dp-page" data-dp-content="portfolio">
        <h2 class="dp-h2">Portfolio</h2>
        <ul class="dp-projects">${projects || '<li class="dp-text">No projects yet.</li>'}</ul>
      </article>
      <article class="dp-page" data-dp-content="resume">
        ${rsSec(p)}
      </article>
      <article class="dp-page" data-dp-content="contact">
        <h2 class="dp-h2">Contact</h2>
        <div class="dp-contact-links">
          ${p.email ? `<a class="btn btn-primary" href="mailto:${tplEsc(p.email)}">SEND MESSAGE</a>` : ''}
          ${p.github ? `<a class="btn btn-ghost" href="${tplEsc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
          ${p.linkedin ? `<a class="btn btn-ghost" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
          ${tplShowInsta(p) ? `<a class="btn btn-ghost" href="${tplEsc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
        </div>
      </article>
    </div>
  </main>
  ${tplFoot(p)}`;
  function switchDpTab(key) {
    app.querySelectorAll('[data-dp-page]').forEach(x => x.classList.toggle('active', x.dataset.dpPage === key));
    app.querySelectorAll('[data-dp-content]').forEach(pg => pg.classList.toggle('active', pg.dataset.dpContent === key));
  }
  app.querySelectorAll('[data-dp-page]').forEach(b => {
    b.onclick = (e) => {
      if (e) e.preventDefault();
      try { history.replaceState(null, '', '#' + b.dataset.dpPage); } catch (_) {}
      switchDpTab(b.dataset.dpPage);
      window.scrollTo(0, 0);
    };
  });
  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#', '').toLowerCase();
    if (['about', 'portfolio', 'resume', 'contact'].includes(h)) switchDpTab(h);
  });
  const hash = (location.hash || '').replace('#', '').toLowerCase();
  const qTab = (new URL(location.href).searchParams.get('tab') || new URL(location.href).searchParams.get('page') || '').toLowerCase();
  const startTab = ['about', 'portfolio', 'resume', 'contact'].includes(hash) ? hash : (['about', 'portfolio', 'resume', 'contact'].includes(qTab) ? qTab : 'about');
  switchDpTab(startTab);
  window.scrollTo(0, 0);
}

// Fullpage Scroll (Brad Engelhardt style) — full-height sections, red accent, horizontal slider
function renderFullpage(p) {
  normTpl(p);
  const slides = (p.projects || []).map((pr) => `
    <div class="fp-slide">
      <h3>${tplEsc(pr.title)}</h3>
      <p>${tplEsc(pr.desc || pr.title || '')}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="btn btn-ghost btn-sm" href="${tplEsc(pr.url || '#')}" target="_blank" rel="noopener">View →</a>
        ${pr.demoUrl ? `<a class="btn btn-primary btn-sm" href="${tplEsc(pr.demoUrl)}" target="_blank" rel="noopener">Demo →</a>` : ''}
      </div>
    </div>`).join('');
  const skills = (p.skills || []).map((s) => `<span class="fp-skill">${tplEsc(s)}</span>`).join('');

  document.body.dataset.template = 'fullpage';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="fp-nav">
    <a class="fp-logo" href="/"><img class="brand-logo" src="/favicon.png" alt="portfoolio.me" width="30" height="30">${tplEsc(p.name)}</a>
    <ul class="fp-links">
      <li><a href="#fp-about">ABOUT</a></li>
      <li><a href="#fp-work">PORTFOLIO</a></li>
      <li><a href="#fp-contact">CONTACT</a></li>
    </ul>
  </div>
  <div id="fp-nav-dots" class="fp-dots" aria-hidden="true"></div>
  <div class="fp-fullpage">
    <section class="fp-section fp-hero" id="fp-about">
      <h1 class="fp-h1">${tplEsc((p.name || '').toUpperCase())}</h1>
      <p class="fp-typed" id="fpTyped">${tplEsc(p.title || '')}</p>
      <a class="fp-scroll" href="#fp-work"><i class="fa-solid fa-chevron-down"></i></a>
    </section>
    <section class="fp-section" id="fp-work">
      <h2 class="fp-h2">PROJECTS</h2>
      <div class="fp-slider">${slides || '<p class="fp-text">No projects yet.</p>'}</div>
    </section>
    ${rsSec(p)}
    <section class="fp-section" id="fp-about2">
      <h2 class="fp-h2">ABOUT ME</h2>
      <p class="fp-text">${tplEsc(p.tagline || p.title || '')}</p>
      ${p.resume && p.resume.summary ? `<p class="fp-text">${tplEsc(p.resume.summary)}</p>` : ''}
      ${skills ? `<div class="fp-skills">${skills}</div>` : ''}
    </section>
    <section class="fp-section" id="fp-contact">
      <h2 class="fp-h2">CONTACT ME</h2>
      <p class="fp-text">${tplEsc(p.tagline || 'Let us build something together.')}</p>
      <div class="fp-contact-links">
        ${p.email ? `<a class="btn btn-primary" href="mailto:${tplEsc(p.email)}">SEND MESSAGE</a>` : ''}
        ${p.github ? `<a class="btn btn-ghost" href="${tplEsc(p.github)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
        ${p.linkedin ? `<a class="btn btn-ghost" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
        ${tplShowInsta(p) ? `<a class="btn btn-ghost" href="${tplEsc(p.instagram)}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
      </div>
    </section>
  </div>
  ${tplFoot(p)}`;
  window.scrollTo(0, 0);
}

// Modern CV — Interactive Developer CV Portfolio (Bilingual AR/EN, Dark/Light, Animated)
function renderModerncv(p) {
  normTpl(p);
  document.body.dataset.template = 'moderncv';
  document.body.className = 'body-main';
  document.body.setAttribute('data-theme', 'dark');
  document.body.setAttribute('data-lang', 'en');
  document.body.setAttribute('data-dir', 'ltr');
  document.title = `${p.name || 'Developer'} — ${p.title || 'Developer CV'} | portfoolio.me`;

  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Full Stack Developer & UI/UX Designer');
  const desc = tplEsc(p.tagline || 'Passionate developer creating exceptional digital experiences with modern technologies.');
  const aboutText = tplEsc(p.bio || p.desc || p.tagline || "I'm a passionate Full Stack Developer with over 5 years of experience in building modern web applications and mobile solutions. I specialize in JavaScript technologies, React, Node.js, and creating beautiful user interfaces.");
  const email = tplEsc(p.email || 'developer@example.com');
  const phone = tplEsc(p.phone || '+966 50 123 4567');
  const location = tplEsc(p.location || 'Riyadh, Saudi Arabia');

  // Avatar
  const avatarHtml = (p.avatarUrl || p.avatar_url)
    ? `<img src="${tplEsc(p.avatarUrl || p.avatar_url)}" alt="${name}" class="profile-img" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
    : `<div class="profile-placeholder"><i class="fas fa-code"></i></div>`;

  // Code block skills
  const userSkills = Array.isArray(p.skills) && p.skills.length ? p.skills : ['React', 'Node.js', 'TypeScript'];
  const codeSkills = userSkills.slice(0, 3).map(s => `'${tplEsc(s)}'`).join(', ');

  // Skills Categories
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
    return items.map(s => `
      <div class="skill-item" data-skill="${tplEsc(s.name)}" data-percent="${s.pct}">
        <div class="skill-header">
          <span class="skill-name">${tplEsc(s.name)}</span>
          <span class="skill-percent">0%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress"></div>
        </div>
      </div>`).join('');
  }

  // Experience
  let expList = [];
  if (Array.isArray(p.experience) && p.experience.length) {
    expList = p.experience.map(e => ({
      year: `${tplEsc(e.start || '2022')} - ${e.current ? 'Present' : tplEsc(e.end || 'Present')}`,
      isCurrent: Boolean(e.current),
      title: tplEsc(e.role || e.title || 'Developer'),
      company: tplEsc(e.company || 'Tech Company Inc.'),
      desc: tplEsc(e.desc || 'Developed and maintained modern web applications.'),
      achievements: Array.isArray(e.achievements) ? e.achievements.map(a => tplEsc(a)) : [],
      tags: Array.isArray(e.tags) ? e.tags.map(t => tplEsc(t)) : (Array.isArray(e.technologies) ? e.technologies.map(t => tplEsc(t)) : ['React', 'Node.js', 'TypeScript'])
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

  const expHtml = expList.map(e => `
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
          ${e.achievements.map(a => `<div class="achievement-item"><i class="fas fa-check-circle"></i><span>${a}</span></div>`).join('')}
        </div>` : ''}
        <div class="timeline-tags">
          ${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');

  // Projects
  let projList = [];
  if (Array.isArray(p.projects) && p.projects.length) {
    projList = p.projects.map((pr, i) => ({
      title: tplEsc(pr.title || `Project ${i + 1}`),
      desc: tplEsc(pr.desc || 'A modern web application built with clean architecture and cutting-edge technologies.'),
      tags: Array.isArray(pr.technologies || pr.tags) ? (pr.technologies || pr.tags).map(t => tplEsc(t)) : ['React', 'TypeScript', 'Node.js'],
      url: pr.demoUrl || pr.url || '#',
      repo: pr.repo?.url || (pr.url && pr.url.includes('github') ? pr.url : '#'),
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

  const projHtml = projList.map(pr => `
    <div class="project-card">
      <div class="project-image">
        <div class="project-overlay">
          <div class="project-links">
            <a href="${tplEsc(pr.url)}" target="_blank" rel="noopener" class="project-link" title="View Project"><i class="fas fa-external-link-alt"></i></a>
            <a href="${tplEsc(pr.repo)}" target="_blank" rel="noopener" class="project-link" title="View Code"><i class="fab fa-github"></i></a>
          </div>
        </div>
        <div class="project-placeholder"><i class="fas ${pr.icon || 'fa-code'}"></i></div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${pr.title}</h3>
        <p class="project-description">${pr.desc}</p>
        <div class="project-tags">${pr.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </div>`).join('');

  // Stats
  const projCount = (p.projects && p.projects.length) || 50;
  const expCount = (p.experience && p.experience.length ? (p.experience.length + 2) : 5);

  const app = document.getElementById('app');
  app.innerHTML = `
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
              ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="social-icon" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
              ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
              ${p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener" class="social-icon" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
              ${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
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
              <a href="${tplEsc(p.linkedin || '#')}" target="_blank" rel="noopener noreferrer" class="footer-author-link">
                <i class="fas fa-code"></i>
                <span>${name}</span>
              </a>
            </p>
          </div>
          <div class="footer-social">
            ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="footer-social-link"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
            ${p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
          </div>
        </div>
      </div>
    </footer>
  `;

  window.scrollTo(0, 0);

  // Initialize interactive logic and animations
  initModerncvRuntime();
}

function initModerncvRuntime() {
  const AppState = {
    currentLang: 'en',
    currentTheme: 'dark',
    currentSection: 'home',
    isMenuOpen: false,
    isLoaded: false
  };

  function setLanguage(lang) {
    AppState.currentLang = lang;
    document.body.setAttribute('data-lang', lang);
    document.body.setAttribute('data-dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-text-en], [data-text-ar]').forEach(el => {
      const en = el.getAttribute('data-text-en');
      const ar = el.getAttribute('data-text-ar');
      if (lang === 'ar' && ar) el.textContent = ar;
      else if (en) el.textContent = en;
    });

    document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]').forEach(el => {
      const en = el.getAttribute('data-placeholder-en');
      const ar = el.getAttribute('data-placeholder-ar');
      if (lang === 'ar' && ar) el.setAttribute('placeholder', ar);
      else if (en) el.setAttribute('placeholder', en);
    });

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      const txt = langToggle.querySelector('.lang-text');
      if (txt) txt.textContent = lang === 'en' ? 'AR' : 'EN';
    }
  }

  function toggleLanguage() {
    setLanguage(AppState.currentLang === 'en' ? 'ar' : 'en');
  }

  function setTheme(theme) {
    AppState.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function toggleTheme() {
    setTheme(AppState.currentTheme === 'dark' ? 'light' : 'dark');
  }

  function toggleMobileMenu() {
    AppState.isMenuOpen = !AppState.isMenuOpen;
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    if (navMenu) navMenu.classList.toggle('active', AppState.isMenuOpen);
    if (menuToggle) menuToggle.classList.toggle('active', AppState.isMenuOpen);
  }

  // Bind controls
  const langToggle = document.getElementById('langToggle');
  if (langToggle) langToggle.onclick = toggleLanguage;

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.onclick = toggleTheme;

  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) menuToggle.onclick = toggleMobileMenu;

  // Nav links smooth scroll & active tracking
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const header = document.querySelector('.main-header');
        const headerHeight = header ? header.offsetHeight : 80;
        window.scrollTo({
          top: targetSection.offsetTop - headerHeight,
          behavior: 'smooth'
        });
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (AppState.isMenuOpen) toggleMobileMenu();
      }
    };
  });

  // Scroll listener for sticky header & section spying
  function onScroll() {
    const header = document.querySelector('.main-header');
    if (header) {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => {
      if (scrollPos >= s.offsetTop && scrollPos < s.offsetTop + s.offsetHeight) {
        const id = s.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Floating particles
  const particles = document.getElementById('particles');
  if (particles) {
    particles.innerHTML = '';
    const symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', '+', '-', ';', ':', '&', '|', '%', '$', '#', '@'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = (10 + Math.random() * 10) + 's';
      particles.appendChild(p);
    }
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      const msg = AppState.currentLang === 'ar' ? 'تم إرسال الرسالة بنجاح!' : 'Message sent successfully!';
      alert(msg);
      contactForm.reset();
    };
  }

  // Loader animation
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loaderPercent');
  if (loader && loaderPercent) {
    let progress = 0;
    const iv = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(iv);
        loaderPercent.textContent = '100%';
        setTimeout(() => {
          if (typeof anime !== 'undefined') {
            anime({
              targets: loader,
              opacity: [1, 0],
              duration: 500,
              easing: 'easeInOutQuad',
              complete: () => {
                loader.classList.add('hidden');
                triggerAnimations();
              }
            });
          } else {
            loader.classList.add('hidden');
            triggerAnimations();
          }
        }, 250);
      } else {
        loaderPercent.textContent = Math.floor(progress) + '%';
      }
    }, 60);
  } else {
    triggerAnimations();
  }

  function triggerAnimations() {
    if (typeof anime === 'undefined') {
      // Dynamic fallback load if anime is not available
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
      script.onload = () => runAnimeAnimations();
      document.head.appendChild(script);
      return;
    }
    runAnimeAnimations();
  }

  function runAnimeAnimations() {
    if (typeof anime === 'undefined') return;

    // Typing effect on name
    const heroNameVal = document.getElementById('heroNameVal');
    if (heroNameVal) {
      const fullText = heroNameVal.textContent;
      heroNameVal.textContent = '';
      anime({
        targets: { v: 0 },
        v: fullText.length,
        duration: 1500,
        delay: 300,
        easing: 'easeInOutQuad',
        update: anim => {
          heroNameVal.textContent = fullText.substring(0, Math.floor(anim.animatables[0].target.v));
        }
      });
    }

    // Hero title & description
    anime({ targets: '.hero-title', opacity: [0, 1], translateX: [-30, 0], delay: 600, duration: 800, easing: 'easeOutExpo' });
    anime({ targets: '.hero-description', opacity: [0, 1], translateY: [20, 0], delay: 900, duration: 800, easing: 'easeOutExpo' });
    anime({ targets: '.hero-buttons .btn', opacity: [0, 1], scale: [0.8, 1], delay: anime.stagger(100, { start: 1100 }), duration: 600, easing: 'easeOutBack' });
    anime({ targets: '.hero-social .social-icon', opacity: [0, 1], scale: [0, 1], delay: anime.stagger(80, { start: 1300 }), duration: 600, easing: 'easeOutBack' });
    anime({ targets: '#profileImage', opacity: [0, 1], scale: [0.8, 1], delay: 800, duration: 1200, easing: 'easeOutElastic(1, .8)' });
    anime({ targets: '.floating-badge', opacity: [0, 1], scale: [0, 1], delay: anime.stagger(150, { start: 1200 }), duration: 800, easing: 'easeOutBack' });

    // Intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
      // Skill bars
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const bar = item.querySelector('.skill-progress');
            const pctEl = item.querySelector('.skill-percent');
            const targetPct = parseInt(item.getAttribute('data-percent') || 85, 10);
            if (bar) {
              anime({ targets: bar, width: ['0%', targetPct + '%'], duration: 1800, easing: 'easeOutExpo' });
            }
            if (pctEl) {
              anime({
                targets: { v: 0 },
                v: targetPct,
                duration: 1800,
                easing: 'easeOutExpo',
                update: anim => {
                  pctEl.textContent = Math.floor(anim.animatables[0].target.v) + '%';
                }
              });
            }
            skillObserver.unobserve(item);
          }
        });
      }, { threshold: 0.3 });
      document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

      // Stats counters
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = parseInt(el.getAttribute('data-count') || 0, 10);
            anime({
              targets: { v: 0 },
              v: targetVal,
              duration: 2000,
              easing: 'easeOutExpo',
              update: anim => {
                el.textContent = Math.floor(anim.animatables[0].target.v);
              }
            });
            statObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

      // Cards & Timelines
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [35, 0],
              duration: 700,
              easing: 'easeOutExpo'
            });
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('.project-card, .timeline-item, .skill-category, .contact-item').forEach(el => cardObserver.observe(el));
    } else {
      // Fallback
      document.querySelectorAll('.skill-progress').forEach(el => {
        const pct = el.closest('.skill-item')?.getAttribute('data-percent') || '85';
        el.style.width = pct + '%';
      });
      document.querySelectorAll('.skill-percent').forEach(el => {
        const pct = el.closest('.skill-item')?.getAttribute('data-percent') || '85';
        el.textContent = pct + '%';
      });
      document.querySelectorAll('.stat-number').forEach(el => {
        el.textContent = el.getAttribute('data-count') || '0';
      });
    }

    // Parallax on profile image & grid
    const profileImg = document.getElementById('profileImage');
    const gridBg = document.querySelector('.code-grid-bg');
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (profileImg && scrolled < 800) {
        profileImg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
      if (gridBg && scrolled < 1200) {
        gridBg.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    }, { passive: true });
  }
}

window.PortfoolioTemplates = { minimal: renderMinimal, terminal: renderTerminal, creative: renderCreative, aurora: renderAurora, editorial: renderEditorial, brutalist: renderBrutalist, afterglow: renderAfterglow, ultraviolet: renderUltraviolet, tidepool: renderTidepool, motion: renderMotion, darkpro: renderDarkpro, fullpage: renderFullpage, moderncv: renderModerncv };
window.PortfoolioTemplateList = TEMPLATES;
