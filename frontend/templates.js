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

// Modern CV — Interactive developer portfolio with animations, RTL support, bilingual
function renderModerncv(p) {
  normTpl(p);
  document.body.dataset.template = 'moderncv';
  document.body.setAttribute('data-lang', 'en');
  document.body.setAttribute('data-dir', 'ltr');
  document.title = `${p.name} — ${p.title} | portfoolio.me`;

  const isRTL = false;
  const tEn = (s) => tplEsc(s || '');
  const tAr = (s) => tplEsc(s || '');

  const skills = (p.skills || []).map((s) => `<span class="skill-badge">${tplEsc(s)}</span>`).join('');

  const projects = (p.projects || []).map((pr, i) => `
    <div class="project-card">
      <div class="project-image">
        <div class="project-overlay">
          <div class="project-links">
            <a href="${tplEsc(pr.url || '#')}" class="project-link" title="View Project"><i class="fas fa-external-link-alt"></i></a>
            <a href="#" class="project-link" title="View Code"><i class="fab fa-github"></i></a>
          </div>
        </div>
        <div class="project-placeholder"><i class="fas ${pr.emoji ? '' : 'fa-code'}"></i></div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${tplEsc(pr.title)}</h3>
        <p class="project-description">${tplEsc(pr.desc)}</p>
        <div class="project-tags">${(pr.tags || []).map(t => `<span class="tag">${tplEsc(t)}</span>`).join('')}</div>
      </div>
    </div>`).join('');

  const experiences = (p.experience || []).map((exp) => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <div class="timeline-year">${tplEsc(exp.start)} — ${exp.current ? 'Present' : tplEsc(exp.end)}</div>
          ${exp.current ? '<div class="timeline-badge">Current</div>' : ''}
        </div>
        <h3 class="timeline-title">${tplEsc(exp.role)}</h3>
        <div class="timeline-company"><i class="fas fa-building"></i> ${tplEsc(exp.company)}</div>
        <p class="timeline-description">${tplEsc(exp.desc)}</p>
        <div class="timeline-achievements">
          ${(exp.achievements || []).map(a => `<div class="achievement-item"><i class="fas fa-check-circle"></i><span>${tplEsc(a)}</span></div>`).join('')}
        </div>
        <div class="timeline-tags">${(exp.tags || []).map(t => `<span class="tag">${tplEsc(t)}</span>`).join('')}</div>
      </div>
    </div>`).join('');

  const stats = [
    { label: 'Projects', count: p.projects?.length || 0 },
    { label: 'Years Experience', count: p.experience?.length || 0 },
    { label: 'Happy Clients', count: 30 }
  ].map(s => `<div class="stat-item"><div class="stat-number" data-count="${s.count}">0</div><div class="stat-label">${tplEsc(s.label)}</div></div>`).join('');

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
            <span class="name-value" id="heroNameVal">${tplEsc(p.name)}</span>
            <span class="name-suffix">;</span>
          </h1>
          <div class="hero-title">
            <span class="title-prefix">//</span>
            <span class="title-text" data-text-en="${tplEsc(p.title)}" data-text-ar="${tplEsc(p.title)}">${tplEsc(p.title)}</span>
          </div>
          <p class="hero-description" data-text-en="${tplEsc(p.tagline || 'Passionate developer creating exceptional digital experiences with modern technologies.')}" data-text-ar="${tplEsc(p.tagline || 'مطور شغوف بإنشاء تجارب رقمية استثنائية باستخدام التقنيات الحديثة.')}">
            ${tplEsc(p.tagline || 'Passionate developer creating exceptional digital experiences with modern technologies.')}
          </p>
          <div class="hero-buttons">
            <a href="#contact" class="btn btn-primary"><span data-text-en="Get In Touch" data-text-ar="تواصل معي">Get In Touch</span><i class="fas fa-arrow-right"></i></a>
            <a href="#projects" class="btn btn-secondary"><span data-text-en="View Projects" data-text-ar="عرض المشاريع">View Projects</span><i class="fas fa-code"></i></a>
          </div>
          <div class="hero-social">
            ${p.github ? `<a href="${tplEsc(p.github)}" class="social-icon" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
            ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" class="social-icon" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${p.twitter ? `<a href="${tplEsc(p.twitter)}" class="social-icon" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
            ${p.email ? `<a href="mailto:${tplEsc(p.email)}" class="social-icon" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
          </div>
        </div>
        <div class="hero-image-wrapper">
          <div class="hero-image-container">
            <div class="profile-image-glow"></div>
            <div class="profile-image-frame">
              <div class="profile-image" id="profileImage">
                ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${tplEsc(p.name)}" class="profile-img">` : `<div class="profile-placeholder"><i class="fas fa-code"></i></div>`}
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
              <p class="about-text" data-text-en="${tplEsc(p.tagline || 'I am a passionate Full Stack Developer with over 5 years of experience...')}" data-text-ar="${tplEsc(p.tagline || 'أنا مطور Full Stack شغوف...')}">
                ${tplEsc(p.tagline || 'I am a passionate Full Stack Developer with over 5 years of experience in building modern web applications.')}
              </p>
            </div>
            <div class="about-stats">${stats}</div>
          </div>
          <div class="about-image-wrapper">
            <div class="about-image-container">
              <div class="code-block">
                <div class="code-line"><span class="code-keyword">const</span> <span class="code-variable">developer</span> <span class="code-operator">=</span> <span class="code-brace">{</span></div>
                <div class="code-line indent"><span class="code-property">name</span><span class="code-operator">:</span> <span class="code-string">'${tplEsc(p.name)}'</span><span class="code-comma">,</span></div>
                <div class="code-line indent"><span class="code-property">title</span><span class="code-operator">:</span> <span class="code-string">'${tplEsc(p.title)}'</span><span class="code-comma">,</span></div>
                <div class="code-line indent"><span class="code-property">skills</span><span class="code-operator">:</span> <span class="code-bracket">[</span><span class="code-string">'${(p.skills || []).slice(0,3).join("','")}'</span><span class="code-bracket">]</span><span class="code-comma">,</span></div>
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
            <div class="skill-items">
              ${(['React','Vue.js','TypeScript','Next.js']).map(s => {
                const has = (p.skills || []).includes(s);
                return has ? `<div class="skill-item" data-skill="${tplEsc(s)}" data-percent="95"><div class="skill-header"><span class="skill-name">${tplEsc(s)}</span><span class="skill-percent">0%</span></div><div class="skill-bar"><div class="skill-progress"></div></div></div>` : '';
              }).join('')}
            </div>
          </div>
          <div class="skill-category">
            <h3 class="category-title" data-text-en="Backend" data-text-ar="الخلفية">Backend</h3>
            <div class="skill-items">
              ${(['Node.js','Express','MongoDB','PostgreSQL']).map(s => {
                const has = (p.skills || []).includes(s);
                return has ? `<div class="skill-item" data-skill="${tplEsc(s)}" data-percent="92"><div class="skill-header"><span class="skill-name">${tplEsc(s)}</span><span class="skill-percent">0%</span></div><div class="skill-bar"><div class="skill-progress"></div></div></div>` : '';
              }).join('')}
            </div>
          </div>
          <div class="skill-category">
            <h3 class="category-title" data-text-en="Tools & Others" data-text-ar="الأدوات وغيرها">Tools & Others</h3>
            <div class="skill-items">
              ${(['Git','Docker','AWS','Figma']).map(s => {
                const has = (p.skills || []).includes(s);
                return has ? `<div class="skill-item" data-skill="${tplEsc(s)}" data-percent="75"><div class="skill-header"><span class="skill-name">${tplEsc(s)}</span><span class="skill-percent">0%</span></div><div class="skill-bar"><div class="skill-progress"></div></div></div>` : '';
              }).join('')}
            </div>
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
        <div class="timeline">
          ${experiences || '<div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"><h3 class="timeline-title">No experience yet</h3><p class="timeline-description">Add experience from your dashboard.</p></div></div>'}
        </div>
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
        <div class="projects-grid">
          ${projects || '<p class="empty-msg">No projects yet.</p>'}
        </div>
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
            ${p.email ? `<div class="contact-item"><div class="contact-icon"><i class="fas fa-envelope"></i></div><div class="contact-details"><h4 class="contact-label" data-text-en="Email" data-text-ar="البريد الإلكتروني">Email</h4><a href="mailto:${tplEsc(p.email)}" class="contact-value">${tplEsc(p.email)}</a></div></div>` : ''}
            ${p.phone ? `<div class="contact-item"><div class="contact-icon"><i class="fas fa-phone"></i></div><div class="contact-details"><h4 class="contact-label" data-text-en="Phone" data-text-ar="الهاتف">Phone</h4><a href="tel:${tplEsc(p.phone)}" class="contact-value">${tplEsc(p.phone)}</a></div></div>` : ''}
            ${p.location ? `<div class="contact-item"><div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div><div class="contact-details"><h4 class="contact-label" data-text-en="Location" data-text-ar="الموقع">Location</h4><span class="contact-value">${tplEsc(p.location)}</span></div></div>` : ''}
          </div>
          <form class="contact-form" id="contactForm" onsubmit="event.preventDefault();alert('${AppState ? (AppState.currentLang === 'ar' ? 'تم إرسال الرسالة بنجاح!' : 'Message sent successfully!') : 'Message sent successfully!'}');this.reset();">
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
          <p class="footer-text"><span class="footer-copyright">© 2025 ${tplEsc(p.name)} Portfolio</span> <span class="footer-divider">•</span> <span class="footer-built">Built with passion and code</span></p>
          <p class="footer-author"><span class="footer-by-text" data-text-en="by" data-text-ar="بواسطة">by</span> <a href="#" class="footer-author-link"><i class="fas fa-code"></i><span>${tplEsc(p.name)}</span></a></p>
        </div>
        <div class="footer-social">
          ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" class="footer-social-link" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
          ${p.github ? `<a href="${tplEsc(p.github)}" class="footer-social-link" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
          ${p.twitter ? `<a href="${tplEsc(p.twitter)}" class="footer-social-link" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
        </div>
      </div>
    </div>
  </footer>

  ${tplFoot(p)}`;

  window.scrollTo(0, 0);

  setTimeout(() => {
    initModerncvAnimations();
  }, 100);
}

function initModerncvAnimations() {
  if (typeof anime === 'undefined') return;

  const nameVal = document.getElementById('heroNameVal');
  if (nameVal) {
    const txt = nameVal.textContent;
    nameVal.textContent = '';
    anime({ targets: {v:0}, v: txt.length, duration: 1500, delay: 500, easing: 'easeInOutQuad', update: a => nameVal.textContent = txt.substring(0, Math.floor(a.animatables[0].target.v)) });
  }

  anime({ targets: '.skill-progress', width: el => el.parentElement.querySelector('.skill-percent')?.dataset?.pct || '90%', duration: 2000, delay: anime.stagger(100), easing: 'easeOutExpo' });
  anime({ targets: '.skill-percent', innerHTML: [0, el => el.parentElement?.previousElementSibling?.dataset?.pct || '90'], duration: 2000, easing: 'easeOutExpo', round: 1, update: a => a.animatables[0].target.textContent = Math.floor(a.animatables[0].target.innerHTML) + '%' });

  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count || 0);
    anime({ targets: {v:0}, v: target, duration: 2000, easing: 'easeOutExpo', update: a => el.textContent = Math.floor(a.animatables[0].target.v) });
  });

  const particles = document.getElementById('particles');
  if (particles) {
    const symbols = ['{','}','[',']','(',')','<','>','/','*','=','+','-',';',':','&','|','$','#','@'];
    for(let i=0;i<20;i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = symbols[Math.floor(Math.random()*symbols.length)];
      p.style.left = Math.random()*100+'%';
      p.style.animationDelay = Math.random()*15+'s';
      p.style.animationDuration = (10+Math.random()*10)+'s';
      particles.appendChild(p);
    }
  }

  document.querySelectorAll('.project-card, .timeline-item, .skill-category, .contact-item').forEach((el,i) => {
    anime({ targets: el, opacity: [0,1], translateY: [30,0], delay: i*80, duration: 800, easing: 'easeOutExpo' });
  });

  document.querySelectorAll('.section').forEach(section => {
    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
      obs.observe(section);
    }
  });
}

window.PortfoolioTemplates = { minimal: renderMinimal, terminal: renderTerminal, creative: renderCreative, aurora: renderAurora, editorial: renderEditorial, brutalist: renderBrutalist, afterglow: renderAfterglow, ultraviolet: renderUltraviolet, tidepool: renderTidepool, motion: renderMotion, darkpro: renderDarkpro, fullpage: renderFullpage, moderncv: renderModerncv };
window.PortfoolioTemplateList = TEMPLATES;
