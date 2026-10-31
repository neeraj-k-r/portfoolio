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
  { id: 'darkpro', name: 'Dark Pro', desc: 'Dark sidebar nav with gold accent', emoji: '🌑', best: 'Product designers • Dark UI' },
  { id: 'fullpage', name: 'Fullpage Scroll', desc: 'Full-height sections, red accent, slider', emoji: '📄', best: 'Agencies • Bold presentation' },
  { id: 'moderncv', name: 'Modern CV', desc: 'Interactive dev portfolio with animations, RTL support', emoji: '💼', best: 'Full Stack • UI/UX • Bilingual' },
  { id: 'ultracode', name: 'Ultra Code', desc: 'Dark crimson theme with vertical sidebar, qualification timelines, skills tabs, work filters & modals', emoji: '🔴', best: 'Developers • Designers • Modern portfolio' },
  { id: 'devblue', name: 'Dev Blue', desc: 'Royal blue clean portfolio with smooth ScrollReveal, skill progress bars & work showcase', emoji: '🔷', best: 'Web Designers • Frontend • Clean UI' },
  { id: 'cube', name: '3D Cube', desc: 'Interactive 3D cube swiper in charcoal & mint green', emoji: '🟩', best: 'Web Developers • Modern 3D' },
  { id: 'nova', name: 'Nova Galaxy', desc: 'Deep space navy & teal particle network', emoji: '🌌', best: 'Full Stack • AI / ML • Modern' },
  { id: 'codeflow', name: 'Codeflow', desc: 'Deep-navy dev with live scroll code tab', emoji: '⚡', best: 'Software Engineers • Systems' },
  { id: 'wave', name: 'Neon Wave', desc: 'Emerald neon frequency lines on pitch black', emoji: '🌊', best: 'Creative Devs • High Contrast' },
  { id: 'assistant', name: 'AI Assistant', desc: 'ChatGPT-style conversational portfolio chat', emoji: '🤖', best: 'AI Engineers • Data • Interactive' },
  { id: 'console', name: 'Dev Console', desc: 'Developer terminal window with live shell', emoji: '🖥️', best: 'Backend • DevOps • Terminal Devs' },
  { id: 'snowcard', name: 'Snowcard', desc: 'Dotted canvas with brutalist yellow stickers', emoji: '❄️', best: 'Designers • Frontend • Memorable' },
  { id: 'parchment', name: 'Parchment Scroll', desc: 'Antique scroll letter with wax seal & serif', emoji: '📜', best: 'Writers • Scholars • Academics' },
  { id: 'cloud', name: 'Cloud Blue', desc: 'Airy sky blue cloudscape with soft cards', emoji: '☁️', best: 'Web Dev • Clean • Friendly UI' },
  { id: 'github', name: 'GitHub Profile', desc: 'Authentic dark developer profile with pinned repos, README card & contribution graph', emoji: '🐙', best: 'Developers • Open Source • Full Stack' },
  { id: 'particle', name: 'Particle Mesh', desc: 'Interactive 3D particle mesh with glowing gradients & dual-action hero', emoji: '✨', best: 'Full Stack • AI / ML • Creative Devs' },
  { id: 'panels', name: 'Panels Showcase', desc: 'Sleek tabbed sliding viewport panels with purple gradient hero & dark mode', emoji: '🗂️', best: 'Full Stack • Product Devs • Modern UI' },
  { id: 'monolith', name: 'Monolith Brutalist', desc: 'Heavy editorial typography with brutalist borders & hard drop shadows', emoji: '⬛', best: 'Full Stack • Bold Personalities • Minimal' },
  { id: 'editor', name: 'VS Code Editor', desc: 'VS Code IDE theme with file explorer, code tabs, and Copilot panel', emoji: '💻', best: 'Full Stack • Systems • Developers' },
  { id: 'magazine', name: 'Editorial Magazine', desc: 'Literary editorial broadsheet with Fraunces drop caps & warm parchment paper', emoji: '📰', best: 'Writers • ML Engineers • Scholars' },
  { id: 'bold', name: 'Bold Lime', desc: 'High-contrast dark mode with electric lime accents and oversized display typography', emoji: '⚡', best: 'Full Stack • Systems • Bold Personalities' },
  { id: 'clean', name: 'Clean Pro', desc: 'Friendly light mode with pill navigation, royal purple accents, and floating soft-shadow cards', emoji: '🕊️', best: 'SDE • Product Designers • Friendly Clean UI' },
  { id: 'vibrant', name: 'Vibrant Gradient', desc: 'Playful designer portfolio with rainbow gradient typography and lilac radial glows', emoji: '🌈', best: 'Designers • Frontend • Creative Technologists' },
  { id: 'neon', name: 'Neon Cyberpunk', desc: 'Synthwave aesthetic with 3D animated perspective grid floor, Orbitron glitch titles, and laser glow', emoji: '🌆', best: 'Game Devs • Web3 • Cyberpunk • Creative Coders' },
  { id: 'hacker', name: 'Hacker Terminal', desc: 'Matrix phosphor green, CRT scanlines, and authentic bash command prompt UI', emoji: '💻', best: 'Cybersecurity • Linux • Systems • Terminal Lovers' },

  { id: 'gallery', name: 'Gallery', desc: 'Visual masonry grid for artists and photographers', emoji: '🖼️', best: 'Photographers • Visual Artists', track: 'visual' },
  { id: 'studio', name: 'Studio', desc: 'Light editorial covers with refined typography', emoji: '☀️', best: 'Brand Designers • Art Directors', track: 'visual' },
  { id: 'noir', name: 'Noir', desc: 'Dark full-bleed visual showcases with deep shadows', emoji: '🌙', best: 'Cinematographers • 3D Artists', track: 'visual' },
  { id: 'museum', name: 'Museum', desc: 'Framed gallery walls with classic museum aesthetics', emoji: '🏛️', best: 'Fine Artists • Painters', track: 'visual' },
  { id: 'catalog', name: 'Catalog', desc: 'Print art-book plates and archival layouts', emoji: '📖', best: 'Book Designers • Printmakers', track: 'visual' },
  { id: 'bloom', name: 'Bloom', desc: 'Soft pastel dreamscapes with delicate color palettes', emoji: '🌸', best: 'Illustrators • Concept Artists', track: 'visual' },
  { id: 'motion', name: 'Motion Flow', desc: 'Light cream, kinetic word reveal, motion gradients', emoji: '⚡', best: 'Motion Designers • Animators', track: 'visual' },
  { id: 'atelier', name: 'Atelier', desc: 'Haute couture minimal editorial with Roman numeral plates & gold hairline rules', emoji: '🏛️', best: 'Fashion Stylists • Luxury Editorial • Art Directors', track: 'visual' },
  { id: 'cinema', name: 'Cinema', desc: 'Obsidian 2.39:1 widescreen stills with camera HUD, timecode & REC dot', emoji: '🎬', best: 'Filmmakers • Cinematographers • VFX Artists', track: 'visual' },
  { id: 'arch', name: 'Arch Blueprint', desc: 'Architectural drafting grid with plate specs, dimension stamps & crosshairs', emoji: '📐', best: 'Architects • Interior Designers • Industrial Designers', track: 'visual' },
  { id: 'zine', name: 'Risograph Zine', desc: 'Indie art zine with washi tape strips, pop halftone shadows & sticker badges', emoji: '🎨', best: 'Illustrators • Comic Artists • Printmakers', track: 'visual' },
  { id: 'zen', name: 'Zen Wabi-Sabi', desc: 'Serene Japanese ceramic studio with ensō brush avatar & organic stone layout', emoji: '🍵', best: 'Ceramicists • Sculptors • Lifestyle Curators', track: 'visual' },
  { id: 'desire', name: 'Desire Studio', desc: 'Vibrant designer portfolio with interactive loupe lens, asymmetric cards & services pricing', emoji: '✨', best: 'UI/UX Designers • Product Designers • Creative Studios', track: 'visual' },
  { id: 'lumina', name: 'Lumina Prism', desc: 'Holographic glassmorphism with iridescent refractive shimmer and chromatic glowing cards', emoji: '💎', best: '3D Artists • Motion Designers • Digital Sculptors', track: 'visual' },
  { id: 'vogue', name: 'Vogue Editorial', desc: 'High-fashion magazine spread with Didot typography, issue volume badge & full-bleed photography', emoji: '👠', best: 'Fashion Stylists • Models • Art Directors • Photographers', track: 'visual' },
  { id: 'filmstrip', name: 'Filmstrip Reel', desc: 'Panoramic horizontal cinema reel with 35mm film perforation accents & darkroom atmosphere', emoji: '🎞️', best: 'Cinematographers • Directors • Photographers • Visual Storytellers', track: 'visual' }
];

function tplEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function normTpl(p) {
  if (typeof document !== 'undefined' && document.body && document.body.classList && typeof document.body.classList.remove === 'function') {
    document.body.classList.remove('pf-theme-bold', 'pf-theme-vibrant', 'pf-theme-clean', 'pf-theme-editorial');
  }
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
  const qTab = (new URLSearchParams(location.search).get('tab') || new URLSearchParams(location.search).get('page') || '').toLowerCase();
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
        <span class="badge-title">${tplEsc(sk.name)}</span>
        <span class="badge-libs">${sk.count > 1 ? `${sk.count} projects` : 'Verified Skill'}</span>
      </div>
    </div>
  `).join('');

  const codeSkills = allSkillsList.length
    ? allSkillsList.slice(0, 4).map((s) => `'${tplEsc(s.name)}'`).join(', ')
    : `'Coding'`;

  // Experience (taken strictly from profile/resume data)
  const rawExp = (Array.isArray(p.experience) && p.experience.length)
    ? p.experience
    : (p.resume && Array.isArray(p.resume.experience) && p.resume.experience.length)
      ? p.resume.experience
      : [];

  const expList = rawExp.map((e) => ({
    year: [e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || (e.year || 'Present'),
    isCurrent: Boolean(e.current || String(e.end || '').toLowerCase() === 'present'),
    title: tplEsc(e.role || e.title || 'Developer'),
    company: tplEsc(e.company || ''),
    desc: tplEsc(e.desc || ''),
    achievements: Array.isArray(e.achievements)
      ? e.achievements.map((a) => tplEsc(String(a).trim())).filter(Boolean)
      : String(e.desc || '').split('\n').map((s) => tplEsc(s.trim().replace(/^[-•*]\s*/, ''))).filter((s) => s.length > 5),
    tags: Array.isArray(e.tags) ? e.tags.map(t => tplEsc(t)) : (Array.isArray(e.technologies) ? e.technologies.map(t => tplEsc(t)) : [])
  }));

  const expHtml = expList.length
    ? `<div class="timeline">${expList.map((e) => `
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div class="timeline-year">${e.year}</div>
              ${e.isCurrent ? '<div class="timeline-badge">Current</div>' : ''}
            </div>
            <h3 class="timeline-title">${e.title}</h3>
            ${e.company ? `<div class="timeline-company"><i class="fas fa-building"></i> ${e.company}</div>` : ''}
            ${e.desc ? `<p class="timeline-description">${e.desc}</p>` : ''}
            ${e.achievements.length ? `
            <div class="timeline-achievements">
              ${e.achievements.map((a) => `<div class="achievement-item"><i class="fas fa-check-circle"></i><span>${a}</span></div>`).join('')}
            </div>` : ''}
            ${e.tags.length ? `
            <div class="timeline-tags">
              ${e.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
            </div>` : ''}
          </div>
        </div>`).join('')}</div>`
    : `<div class="timeline-empty" style="text-align:center;padding:3rem 1.5rem;background:var(--bg-card);border:1px dashed var(--border);border-radius:16px;max-width:600px;margin:0 auto">
        <i class="fas fa-briefcase" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:1rem;display:block"></i>
        <h3 style="font-size:1.2rem;color:var(--text-primary);margin-bottom:0.5rem;font-family:var(--font-code)" data-text-en="No experience added yet" data-text-ar="لا توجد خبرات مضافة بعد">No experience added yet</h3>
        <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.6" data-text-en="Experience entries from resume will appear here once added." data-text-ar="ستظهر الخبرات من السيرة الذاتية هنا بمجرد إضافتها.">Experience entries from resume will appear here once added.</p>
      </div>`;

  // Projects
  let projList = [];
  if (Array.isArray(p.projects) && p.projects.length) {
    projList = p.projects.map((pr, i) => {
      const repoUrl = (pr.repo && pr.repo.fullName)
        ? `https://github.com/${pr.repo.fullName}`
        : (pr.repo?.url || (pr.url && pr.url.includes('github') ? pr.url : '#'));
      const liveUrl = pr.demoUrl || pr.url || repoUrl;
      return {
        title: tplEsc(pr.title || `Project ${i + 1}`),
        desc: tplEsc(pr.desc || 'A web project showcasing development skills and clean architecture.'),
        tags: Array.isArray(pr.technologies || pr.tags) ? (pr.technologies || pr.tags).map(t => tplEsc(t)) : ['JavaScript'],
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
            <a href="${tplEsc(pr.url)}" target="_blank" rel="noopener" class="project-link" title="View Project"><i class="fas fa-external-link-alt"></i></a>
            <a href="${tplEsc(pr.repo)}" target="_blank" rel="noopener" class="project-link" title="View Code"><i class="fab fa-github"></i></a>
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
              <span class="name-ident">name</span>
              <span class="name-operator">=</span>
              <span class="name-value" id="heroNameVal">${name}</span><span class="name-suffix">;</span>
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
  initModerncvRuntime(p);
}

function initModerncvRuntime(p) {
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
      const nameInput = document.getElementById('contactName') || contactForm.querySelector('input[type="text"]');
      const emailInput = document.getElementById('contactEmail') || contactForm.querySelector('input[type="email"]');
      const subjInput = document.getElementById('contactSubject') || contactForm.querySelectorAll('input[type="text"]')[1];
      const msgInput = document.getElementById('contactMessage') || contactForm.querySelector('textarea');
      const statusEl = document.getElementById('contactStatus');
      const submitBtn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('button[type="submit"]');

      const senderName = nameInput ? nameInput.value.trim() : '';
      const senderEmail = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjInput ? subjInput.value.trim() : '';
      const messageVal = msgInput ? msgInput.value.trim() : '';

      const emailLink = document.querySelector('.contact-item a[href^="mailto:"]');
      const targetEmail = (p && p.email) ? p.email : (emailLink ? emailLink.getAttribute('href').replace(/^mailto:/, '') : '');
      const mailSubject = encodeURIComponent(subjectVal || (`Portfolio Message from ${senderName}`));
      const mailBody = encodeURIComponent(
        `${messageVal}\n\n---\nFrom: ${senderName}\nEmail: ${senderEmail}\nSent via portfoolio.me`
      );
      const mailtoUrl = `mailto:${targetEmail || 'contact@portfoolio.me'}?subject=${mailSubject}&body=${mailBody}`;

      if (statusEl) {
        statusEl.style.display = 'flex';
        const successText = AppState.currentLang === 'ar'
          ? `جارٍ فتح تطبيق البريد لإرسال رسالتك... إذا لم يفتح تلقائياً، <a href="${mailtoUrl}">انقر هنا</a>`
          : `Opening your email client to send your message... If it doesn't open, <a href="${mailtoUrl}">click here</a>.`;
        statusEl.innerHTML = `<i class="fas fa-check-circle" style="color:#4ade80"></i> <span>${successText}</span>`;
      }

      window.location.href = mailtoUrl;

      if (submitBtn) {
        const span = submitBtn.querySelector('span');
        const origText = span ? span.innerText : 'Send Message';
        if (span) span.innerText = (AppState.currentLang === 'ar' ? 'تم الإرسال!' : 'Message Ready!');
        setTimeout(() => {
          if (span) span.innerText = origText;
        }, 4000);
      }
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
      const targetHead = document.head || document.body || document.documentElement;
      if (targetHead && targetHead.appendChild) targetHead.appendChild(script);
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
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
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

/* ==========================================================================
   ULTRA CODE Theme (Sidebar Nav, Neon Crimson, Dark Theme, Interactive Popups)
   ========================================================================== */
function renderUltracode(p) {
  normTpl(p);
  document.body.dataset.template = 'ultracode';
  document.body.className = 'body-main';
  document.body.setAttribute('data-theme', 'dark');
  document.title = `${p.name || 'Developer'} — ${p.title || 'Ultra Code Portfolio'} | portfoolio.me`;

  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Full Stack Developer');
  const tagline = tplEsc(p.tagline || 'I have high level experience in web design, development knowledge and producing quality work');
  const bio = tplEsc(p.bio || p.desc || p.tagline || `I'm a dedicated web developer with extensive knowledge and years of experience, delivering high-impact solutions across modern web technologies, UI/UX architecture, and systems engineering.`);
  const email = tplEsc(p.email || '');
  const phone = tplEsc(p.phone || '');
  const location = tplEsc(p.location || '');
  const logoLetter = (p.name || 'M').trim()[0].toUpperCase();

  const avatarImg = (p.avatarUrl || p.avatar_url)
    ? tplEsc(p.avatarUrl || p.avatar_url)
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
        <h3 class="timeline-title">${tplEsc(ed.institution || ed.school || ed.college || 'University')}</h3>
        <p class="timeline-text">${tplEsc(ed.degree || ed.field || ed.major || 'Degree / Diploma')}</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>${tplEsc(ed.year || ed.period || ed.dates || 'Completed')}</span>
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
        <h3 class="timeline-title">${tplEsc(ex.company || ex.organization || 'Tech Company')}</h3>
        <p class="timeline-text">${tplEsc(ex.role || ex.title || ex.position || 'Software Developer')}</p>
        <span class="timeline-date"><i class="uil uil-calendar-alt"></i>${tplEsc(ex.period || ex.dates || ex.duration || 'Past Experience')}</span>
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

  // --- Real Skills Derivation (from user dashboard & projects) ---
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

  // 1) p.skills
  const explicitSkills = Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? p.skills.split(',') : []);
  explicitSkills.forEach(s => addSkill(s, 3));

  // 2) p.projects
  if (Array.isArray(p.projects)) {
    p.projects.forEach(pr => {
      const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
      techs.forEach(t => addSkill(t, 2));
    });
  }

  // 3) p.resume.skills
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
      return `<p style="color:var(--text-color);font-size:var(--small-font-size);padding:1rem 0">No skills listed in this category.</p>`;
    }
    return list.map(s => `
      <div class="skills-data">
        <div class="skills-titles">
          <h3 class="skills-name">${tplEsc(s.name)}</h3>
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
      const prTitle = tplEsc(pr.title || `Project ${idx + 1}`);
      const prDesc = tplEsc(pr.desc || 'A modern digital application crafted with attention to performance, UI/UX, and robust architecture.');
      const techs = (Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : [])).map(t => tplEsc(t)).join(', ') || 'Modern Web';
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
              <li>View - <span><a href="${tplEsc(prUrl)}" target="_blank" rel="noopener">${liveDomain}</a></span></li>
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
  const githubLink = p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="home-social-link" title="GitHub"><i class="uil uil-github-alt"></i></a>` : '';
  const linkedinLink = p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="home-social-link" title="LinkedIn"><i class="uil uil-linkedin-alt"></i></a>` : '';
  const instagramLink = tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="home-social-link" title="Instagram"><i class="uil uil-instagram"></i></a>` : '';
  const twitterLink = p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener" class="home-social-link" title="Twitter"><i class="uil uil-twitter"></i></a>` : '';

  const footerGithub = p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-github-alt"></i></a>` : '';
  const footerLinkedin = p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-linkedin-alt"></i></a>` : '';
  const footerInstagram = tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-instagram"></i></a>` : '';
  const footerTwitter = p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener" class="footer-social"><i class="uil uil-twitter"></i></a>` : '';
  const userServices = (Array.isArray(p.services) && p.services.length)
    ? p.services
    : (p.resume && Array.isArray(p.resume.services) && p.resume.services.length)
    ? p.resume.services
    : null;

  const hasServices = Boolean(userServices && userServices.length);
  const servicesHtml = hasServices ? userServices.map(s => `
    <div class="services-content">
      <div>
        <i class="${tplEsc(s.icon || 'uil uil-code-branch')} services-icon"></i>
        <h3 class="services-title">${tplEsc(s.title || 'Service')}</h3>
      </div>
      <p class="services-modal-description" style="margin-top:12px;font-size:0.92rem;color:var(--text-color);line-height:1.6">${tplEsc(s.desc || '')}</p>
    </div>
  `).join('') : '';

  const servicesSection = hasServices ? `
    <!-- Services Section -->
    <section class="services section" id="services">
      <h2 class="section-title" data-heading="Services">What I Offer</h2>
      <div class="services-container container grid">
        ${servicesHtml}
      </div>
    </section>
  ` : '';

  const servicesNavLink = hasServices ? `<li class="nav-item"><a href="#services" class="nav-link">Services</a></li>` : '';
  const servicesFooterLink = hasServices ? `<li><a href="#services">Services</a></li>` : '';

  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Mobile Nav Toggle -->
    <div class="nav-toggle" id="nav-toggle">
      <i class="uil uil-bars"></i>
    </div>

    <!-- Sidebar Navigation -->
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

    <!-- Main Content Area -->
    <main class="main">
      <!-- Home Section -->
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

      <!-- About Section -->
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

      <!-- Qualifications Section -->
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

      <!-- Skills Section -->
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

      <!-- Work Section -->
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

      <!-- Portfolio Popup Modal -->
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

      <!-- Contact Section -->
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
                <span class="contact-card-data">${tplEsc(p.github.replace(/^https?:\/\//, ''))}</span>
                <a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="contact-button">View Profile <i class="uil uil-arrow-right contact-button-icon"></i></a>
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

      <!-- Footer -->
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
  `;

  window.scrollTo(0, 0);

  // Initialize interactive behaviors
  initUltracodeRuntime(p);
}

function initUltracodeRuntime(p) {
  // 1. Toggling Skill Tabs
  const tabs = document.querySelectorAll('body[data-template="ultracode"] .skills-header[data-target]');
  const tabContents = document.querySelectorAll('body[data-template="ultracode"] .skills-group[data-content]');

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
  const filterBtns = document.querySelectorAll('body[data-template="ultracode"] .work-filters .work-item');
  const workCards = document.querySelectorAll('body[data-template="ultracode"] .work-card');
  const workContainer = document.querySelector('body[data-template="ultracode"] .work-container');

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

  document.querySelectorAll('body[data-template="ultracode"] .work-button').forEach(btn => {
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
  const modalViews = document.querySelectorAll('body[data-template="ultracode"] .services-modal');
  const modalBtns = document.querySelectorAll('body[data-template="ultracode"] .services-button');
  const modalCloses = document.querySelectorAll('body[data-template="ultracode"] .services-modal-close');

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
  const inputs = document.querySelectorAll('body[data-template="ultracode"] .input');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentNode.classList.add('focus');
    });
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.parentNode.classList.remove('focus');
      }
    });
    if (input.value.trim() !== '') {
      input.parentNode.classList.add('focus');
    }
  });

  const contactForm = document.getElementById('ultracodeContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cName = (document.getElementById('ucName')?.value || '').trim();
      const cEmail = (document.getElementById('ucEmail')?.value || '').trim();
      const cPhone = (document.getElementById('ucPhone')?.value || '').trim();
      const cMsg = (document.getElementById('ucMessage')?.value || '').trim();

      const subject = encodeURIComponent(`Portfolio Inquiry from ${cName}`);
      const body = encodeURIComponent(`Hi ${p.name || 'there'},\n\nName: ${cName}\nEmail: ${cEmail}\nPhone: ${cPhone}\n\nMessage:\n${cMsg}\n\n-- Sent via portfoolio.me`);

      const mailto = `mailto:${p.email || 'hello@portfoolio.me'}?subject=${subject}&body=${body}`;
      window.location.href = mailto;

      const statusEl = document.getElementById('ucStatus');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = `✓ Thank you! Opening your email client to reach <b>${p.email || 'developer'}</b>...`;
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

  document.querySelectorAll('body[data-template="ultracode"] .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('show-sidebar');
    });
  });

  const btnShare = document.getElementById('btnShare');
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareData = {
        title: `${p.name || 'Developer'} — Portfolio`,
        text: p.tagline || `Check out ${p.name || 'this developer'}'s portfolio on portfoolio.me`,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch {}
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Portfolio link copied to clipboard!');
        } catch {
          prompt('Copy this portfolio link:', window.location.href);
        }
      }
    });
  }

  // 8. Scroll Section Active Link Highlighter
  const sections = document.querySelectorAll('body[data-template="ultracode"] section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 80;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector('body[data-template="ultracode"] .nav-menu a[href*=' + sectionId + ']');
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   DEV BLUE / MARLON Theme (Royal Blue, Clean Grid, ScrollReveal, Skills Bars)
   ========================================================================== */
function devblueSkillIcon(name) {
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

function renderDevblue(p) {
  normTpl(p);
  document.body.dataset.template = 'devblue';
  document.body.className = 'body-main';
  document.title = `${p.name || 'Developer'} — ${p.title || 'Personal Portfolio'} | portfoolio.me`;

  const name = tplEsc(p.name || 'Marlon');
  const title = tplEsc(p.title || 'Web Designer');
  const bio = tplEsc(p.bio || p.desc || p.tagline || `As a passionate web designer, I thrive on creating visually appealing and user-friendly websites. My journey in web design began with a fascination for how design can enhance user experience.`);
  const email = tplEsc(p.email || '');

  const avatarImg = (p.avatarUrl || p.avatar_url)
    ? tplEsc(p.avatarUrl || p.avatar_url)
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
      const icon = devblueSkillIcon(sk.name);
      return `
        <div class="skills-data">
          <div class="skills-names">
            <i class='${icon} skills-icon'></i>
            <span class="skills-name">${tplEsc(sk.name.toUpperCase())}</span>
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
      const prTitle = tplEsc(pr.title || `Project ${idx + 1}`);
      const prDesc = tplEsc(pr.desc || pr.description || 'Web development project built with modern best practices.');
      const prUrl = pr.url || pr.demoUrl || '#';
      const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
      const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
      const hasRealImg = Boolean(pr.image || pr.img) && !/postimg\.cc/.test(pr.image || pr.img || '');
      const imgHtml = hasRealImg ? `<img src="${tplEsc(pr.image || pr.img)}" alt="${prTitle}" class="work-card-img">` : '';

      const isGithub = pr.repo || /github\.com/.test(pr.url || '');
      const ghLink = isGithub && pr.url ? `<a href="${tplEsc(pr.url)}" target="_blank" rel="noopener" class="work-card-link" title="Source Code"><i class='bx bxl-github'></i></a>` : '';
      const demoLink = prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="work-card-link" title="Live Preview"><i class='bx bx-link-external'></i></a>` : (!isGithub && prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" class="work-card-link" title="Open Link"><i class='bx bx-link-external'></i></a>` : '');

      const tagsHtml = techs.length
        ? `<div class="work-card-tags">${techs.slice(0, 4).map(t => `<span class="work-tag">${tplEsc(t)}</span>`).join('')}</div>`
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
            <h3 class="work-card-title"><a href="${tplEsc(prUrl)}" ${prUrl !== '#' ? 'target="_blank" rel="noopener"' : ''}>${prTitle}</a></h3>
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
  const linkedinIcon = p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-linkedin'></i></a>` : '';
  const instagramIcon = tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-instagram'></i></a>` : '';
  const githubIcon = p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-github'></i></a>` : '';
  const twitterIcon = p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener" class="home-social-icon"><i class='bx bxl-twitter'></i></a>` : '';

  const footerLinkedin = p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-linkedin'></i></a>` : '';
  const footerInstagram = tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-instagram'></i></a>` : '';
  const footerGithub = p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-github'></i></a>` : '';
  const footerTwitter = p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener" class="footer-icon"><i class='bx bxl-twitter'></i></a>` : '';

  const app = document.getElementById('app');
  app.innerHTML = `
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
  `;

  window.scrollTo(0, 0);
  initDevblueRuntime(p);
}

function initDevblueRuntime(p) {
  // 1. Toggling Mobile Menu
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }

  // 2. Active Link on Click & Auto Close Mobile Menu
  const navLinks = document.querySelectorAll('body[data-template="devblue"] .nav-link, body[data-template="marlon"] .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      if (nav) nav.classList.remove('show');
    });
  });

  // 3. Scroll Section Active Link Highlighter
  const sections = document.querySelectorAll('body[data-template="devblue"] section[id], body[data-template="marlon"] section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector('body[data-template="devblue"] .nav-menu a[href*=' + sectionId + '], body[data-template="marlon"] .nav-menu a[href*=' + sectionId + ']');
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

      const subject = encodeURIComponent(`Portfolio Inquiry from ${cName}`);
      const body = encodeURIComponent(`Hi ${p.name || 'there'},\n\nName: ${cName}\nEmail: ${cEmail}\n\nMessage:\n${cMsg}\n\n-- Sent via portfoolio.me`);
      window.location.href = `mailto:${p.email || 'hello@portfoolio.me'}?subject=${subject}&body=${body}`;

      const statusEl = document.getElementById('dbStatus');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = `✓ Opening your email client to reach ${p.name || 'developer'}...`;
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

      sr.reveal('body[data-template="devblue"] .home-title, body[data-template="marlon"] .home-title', {});
      sr.reveal('body[data-template="devblue"] .button, body[data-template="marlon"] .button', { delay: 150 });
      sr.reveal('body[data-template="devblue"] .home-img, body[data-template="marlon"] .home-img', { delay: 300 });
      sr.reveal('body[data-template="devblue"] .home-social, body[data-template="marlon"] .home-social', { delay: 300 });

      sr.reveal('body[data-template="devblue"] .about-data, body[data-template="marlon"] .about-data', {});
      sr.reveal('body[data-template="devblue"] .about-subtitle, body[data-template="marlon"] .about-subtitle', { delay: 150 });
      sr.reveal('body[data-template="devblue"] .about-text, body[data-template="marlon"] .about-text', { delay: 250 });

      sr.reveal('body[data-template="devblue"] .skills-header-block, body[data-template="marlon"] .skills-header-block', { delay: 100 });
      sr.reveal('body[data-template="devblue"] .skills-data, body[data-template="marlon"] .skills-data', { interval: 100 });

      sr.reveal('body[data-template="devblue"] .work-card, body[data-template="marlon"] .work-card', { interval: 100 });
      sr.reveal('body[data-template="devblue"] .contact-input, body[data-template="marlon"] .contact-input', { interval: 150 });
    }
  } catch (err) {
    console.warn('ScrollReveal warning:', err);
  }
}

function renderCube(p) {
  normTpl(p);
  document.body.dataset.template = 'cube';
  document.body.className = 'body-main';
  document.title = `${p.name || 'Developer'} — ${p.title || 'Personal Portfolio'} | portfoolio.me`;

  const name = tplEsc(p.name || 'Muzammal');
  const title = tplEsc(p.title || 'Web Developer');
  const bio = tplEsc(p.bio || p.desc || p.tagline || 'Passionate web developer specializing in building modern, interactive, and high-performance digital experiences.');
  const email = tplEsc(p.email || '');
  const phone = tplEsc(p.phone || '');
  const location = tplEsc(p.location || 'Worldwide / Remote');
  const username = tplEsc(p.username || 'user');

  const avatarImg = (p.avatarUrl || p.avatar_url)
    ? tplEsc(p.avatarUrl || p.avatar_url)
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
          <p>${tplEsc(sk)}</p>
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
      <div class="service-icon"><i class="${tplEsc(s.icon || 'fa-solid fa-code')}"></i></div>
      <h2>${tplEsc(s.title)}</h2>
      <p>${tplEsc(s.desc)}</p>
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
    const tags = ((pr.technologies || pr.tags) || []).map(t => `<span class="cube-tag">${tplEsc(t)}</span>`).join('');
    return `
      <div class="cube-project">
        <div class="cube-project-top">
          <div class="cube-project-icon"><i class="${iconClass}"></i></div>
          <div class="cube-project-links">
            ${pr.url ? `<a class="cube-project-link" href="${tplEsc(pr.url)}" target="_blank" title="View Source"><i class="fa-brands fa-github"></i></a>` : ''}
            ${pr.demoUrl ? `<a class="cube-project-link" href="${tplEsc(pr.demoUrl)}" target="_blank" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
          </div>
        </div>
        <h3 class="cube-project-title"><a href="${tplEsc(pr.url || pr.demoUrl || '#')}" target="_blank">${tplEsc(pr.title)}</a></h3>
        <p class="cube-project-desc">${tplEsc(pr.desc || 'A featured software project demonstrating technical craftsmanship.')}</p>
        <div class="cube-project-tags">${tags}</div>
      </div>
    `;
  }).join('');

  document.getElementById('app').innerHTML = `
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

          <!-- Slide: Contact Me -->
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
                  ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" title="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
                  ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>` : ''}
                  ${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>` : ''}
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
  `;

  window.scrollTo(0, 0);
  initCubeRuntime(p);
}

function initCubeRuntime(p) {
  if (typeof Swiper !== 'undefined') {
    if (window.cubeSwiper && typeof window.cubeSwiper.destroy === 'function') {
      try { window.cubeSwiper.destroy(true, true); } catch {}
    }
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
        const links = document.querySelectorAll(".cube-aside .Links li");
        links.forEach(l => l.classList.remove("activeLink"));
        if (links[window.cubeSwiper.activeIndex]) {
          links[window.cubeSwiper.activeIndex].classList.add("activeLink");
        }
      });
    } catch (e) {
      console.warn('Swiper init warning:', e);
    }
  }

  window.cubeNavigate = function(indx) {
    const links = document.querySelectorAll(".cube-aside .Links li");
    links.forEach(l => l.classList.remove("activeLink"));
    if (links[indx]) links[indx].classList.add("activeLink");
    if (window.cubeSwiper) {
      window.cubeSwiper.slideTo(indx, 800, true);
    }
  };
  window.Navigate = window.cubeNavigate;

  const contactForm = document.getElementById('cubeContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cName = (document.getElementById('cubeName')?.value || '').trim();
      const cEmail = (document.getElementById('cubeEmail')?.value || '').trim();
      const cMsg = (document.getElementById('cubeMsg')?.value || '').trim();

      const subject = encodeURIComponent(`Portfolio Inquiry from ${cName}`);
      const body = encodeURIComponent(`Hi ${p.name || 'there'},\n\nName: ${cName}\nEmail: ${cEmail}\n\nMessage:\n${cMsg}\n\n-- Sent via portfoolio.me`);
      window.location.href = `mailto:${p.email || 'hello@portfoolio.me'}?subject=${subject}&body=${body}`;

      const statusEl = document.getElementById('cubeStatus');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = `✓ Opening your email client to reach ${p.name || 'developer'}...`;
      }
    });
  }
}


/* ==========================================================================
   REVERSE-ENGINEERED PORTFOLIO TEMPLATES (from thetailorcv.com/portfolio)
   Nova, Codeflow, Wave, Assistant, Console, Snowcard, Parchment, Cloud
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. NOVA GALAXY — Deep space navy & teal constellation particles
   -------------------------------------------------------------------------- */
function renderNova(p) {
  normTpl(p);
  document.body.dataset.template = 'nova';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Full Stack Engineer');
  const tagline = tplEsc(p.tagline || 'Building impactful digital solutions with modern technology.');
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, a dedicated technologist passionate about engineering scalable, elegant, and reliable systems.`);
  const location = tplEsc(p.location || 'Remote / Worldwide');
  const email = tplEsc(p.email || '');
  const firstName = (p.name || '').trim().split(' ')[0] || 'developer';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const expHtml = rawExp.map(e => `
    <div class="nv-card">
      <div class="nv-card-top">
        <div>
          <h3 class="nv-card-role">${tplEsc(e.role || e.title || 'Software Engineer')}</h3>
          <div class="nv-card-org">${tplEsc(e.company || e.organization || '')}</div>
        </div>
        <div class="nv-card-meta">
          <span>${tplEsc(e.location || '')}</span>
          <span class="pill">${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</span>
        </div>
      </div>
      ${e.desc ? `<p class="nv-card-desc">${tplEsc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <div class="nv-keyh">Key Contributions</div>
        <ul class="nv-dots">${(e.bullets || e.achievements).map(b => `<li>${tplEsc(b)}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `).join('');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack engineering project built with modern best practices.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const img = pr.image || pr.img || '';
    return `
      <div class="nv-projx">
        <div class="nv-projx-shot">
          ${img ? `<img src="${tplEsc(img)}" alt="${prTitle}">` : `<div class="ph">${prTitle.slice(0, 2).toUpperCase()}</div>`}
        </div>
        <div class="nv-projx-info">
          <h3>${prTitle} ${prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" class="nv-checkout">Code ↗</a>` : ''}${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="nv-checkout">Live Demo ↗</a>` : ''}</h3>
          <p>${prDesc}</p>
          <div class="nv-pill-tags">
            ${techs.map(t => `<span class="nv-ptag">✦ ${tplEsc(t)}</span>`).join('')}
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
              <span class="nm">${tplEsc(s)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = `
    <canvas id="nv-canvas"></canvas>
    <nav class="nv-nav">
      <div class="nv-nav-in">
        <a href="#home" class="nv-brand">&lt;${tplEsc(firstName.toLowerCase())} /&gt;</a>
        <div class="nv-links" id="nv-links">
          <a href="#home" class="on">Home</a>
          <a href="#about">About</a>
          ${expHtml ? `<a href="#experience">Experience</a>` : ''}
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <a class="btn btn-ghost btn-sm" href="/" style="font-size:12px;padding:6px 12px">Make yours</a>
          ${email ? `<a class="btn btn-primary btn-sm" href="mailto:${email}" style="font-size:12px;padding:6px 14px">Hire ${tplEsc(firstName)}</a>` : ''}
        </div>
      </div>
    </nav>
    <header class="nv-hero" id="home">
      <div class="nv-avatar-ring">
        ${p.avatarUrl ? `<img class="nv-avatar" src="${tplEsc(p.avatarUrl)}" alt="${name}">` : `<div class="nv-avatar ph">${name.charAt(0)}</div>`}
        <span class="nv-avatar-dot"></span>
      </div>
      <h1>Hi! I'm <span class="g">${name}</span>.</h1>
      <div class="nv-type"><span class="a">A </span><span class="t" id="nv-typed">${title}</span><span class="cur">|</span></div>
      <p class="nv-quote">"${tagline}"</p>
      <div class="nv-loc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;vertical-align:-2px"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg> ${location}</div>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <a href="#projects" class="nv-btn nv-btn-teal">View My Work →</a>
        ${email ? `<a href="mailto:${email}" class="nv-btn nv-btn-ghost">Contact Me</a>` : ''}
      </div>
    </header>
    <section class="nv-section" id="about">
      <div class="nv-wrap nv-about">
        <h2 class="nv-title">About <span class="g">Me</span></h2>
        <div class="nv-rule"></div>
        <div class="nv-about-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 9-3 3 3 3M16 9l3 3-3 3"/></svg></div>
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
        <p class="nv-lead">Selected systems, applications, and tools crafted with attention to performance and detail.</p>
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
        <p class="nv-lead">Interested in collaboration, opportunities, or discussing ideas? Let's connect.</p>
        <div class="nv-connect" style="max-width:760px;margin:0 auto">
          ${email ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">Email</h3><p class="nv-card-desc" style="margin:0 0 14px"><a href="mailto:${email}" style="color:var(--nv-teal)">${email}</a></p><a href="mailto:${email}" class="nv-btn nv-btn-teal" style="font-size:0.85rem;padding:8px 20px">Send Message</a></div>` : ''}
          ${p.github ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">GitHub</h3><p class="nv-card-desc" style="margin:0 0 14px"><a href="${tplEsc(p.github)}" target="_blank" rel="noopener" style="color:var(--nv-teal)">GitHub Profile</a></p><a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="nv-btn nv-btn-ghost" style="font-size:0.85rem;padding:8px 20px">View Code</a></div>` : ''}
          ${p.linkedin ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">LinkedIn</h3><p class="nv-card-desc" style="margin:0 0 14px"><a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" style="color:var(--nv-teal)">LinkedIn Network</a></p><a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="nv-btn nv-btn-ghost" style="font-size:0.85rem;padding:8px 20px">Connect</a></div>` : ''}
          ${tplShowInsta(p) ? `<div class="nv-card" style="text-align:center"><h3 class="nv-card-role" style="margin-bottom:8px">Instagram</h3><p class="nv-card-desc" style="margin:0 0 14px"><a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" style="color:var(--nv-teal)">Instagram Feed</a></p><a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="nv-btn nv-btn-ghost" style="font-size:0.85rem;padding:8px 20px">Follow</a></div>` : ''}
        </div>
      </div>
    </section>
    ${tplFoot(p)}
  `;

  window.scrollTo(0, 0);
  initNovaRuntime(p);
}

function initNovaRuntime(p) {
  const canvas = document.getElementById('nv-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const count = Math.min(85, Math.round(W * H / 18000));
      pts = [];
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45
        });
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0 || pt.x > W) pt.vx *= -1;
        if (pt.y < 0 || pt.y > H) pt.vy *= -1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45,212,191,0.75)';
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const pt2 = pts[j];
          const dx = pt.x - pt2.x, dy = pt.y - pt2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.strokeStyle = `rgba(45,212,191,${(1 - dist / 120) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      if (typeof window !== 'undefined' && window.requestAnimationFrame) window.requestAnimationFrame(draw);
      else if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(draw);
    };
    draw();
  }

  const roles = [p.title || 'Developer', 'Full Stack Engineer', 'Creative Problem Solver'].filter(Boolean);
  const typedEl = document.getElementById('nv-typed');
  if (typedEl && roles.length) {
    let rIdx = 0, cIdx = 0, deleting = false;
    const tick = () => {
      const cur = roles[rIdx % roles.length];
      typedEl.textContent = deleting ? cur.slice(0, cIdx--) : cur.slice(0, cIdx++);
      if (!deleting && cIdx > cur.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
      if (deleting && cIdx < 0) {
        deleting = false;
        cIdx = 0;
        rIdx++;
      }
      setTimeout(tick, deleting ? 45 : 95);
    };
    tick();
  }
}

/* --------------------------------------------------------------------------
   2. CODEFLOW — Deep navy / blue dev with live scroll code progress
   -------------------------------------------------------------------------- */
function renderCodeflow(p) {
  normTpl(p);
  document.body.dataset.template = 'codeflow';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Software Engineer');
  const tagline = tplEsc(p.tagline || 'Building production-ready software with modern engineering principles.');
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, a software engineer specializing in scalable systems and robust digital products.`);
  const email = tplEsc(p.email || '');

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const expHtml = rawExp.map(e => `
    <div class="cf-card" style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <h3 style="margin:0 0 4px;color:#fff;font-size:1.25rem">${tplEsc(e.role || e.title || 'Role')}</h3>
          <p style="margin:0;color:var(--cf-cyan);font-weight:600">${tplEsc(e.company || e.organization || '')}</p>
        </div>
        <span class="cf-tag">${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</span>
      </div>
      ${e.desc ? `<p style="margin:14px 0 0;color:var(--cf-dim)">${tplEsc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <ul style="margin:12px 0 0;padding-left:20px;color:var(--cf-dim)">${(e.bullets || e.achievements).map(b => `<li style="margin-bottom:6px">${tplEsc(b)}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `).join('');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack software solution.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const img = pr.image || pr.img || '';
    return `
      <div class="cf-card" style="margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div>
            <h3 style="color:#fff;font-size:1.4rem;margin:0 0 6px">${prTitle}</h3>
            <p style="color:var(--cf-dim);margin:0 0 14px;max-width:640px">${prDesc}</p>
          </div>
          <div style="display:flex;gap:10px">
            ${prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" class="cf-btn cf-btn-outline" style="padding:8px 16px;font-size:0.85rem">Code ↗</a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="cf-btn cf-btn-blue" style="padding:8px 16px;font-size:0.85rem">Live Demo ↗</a>` : ''}
          </div>
        </div>
        <div class="cf-tags" style="margin-top:12px">
          ${techs.map(t => `<span class="cf-tag">${tplEsc(t)}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const skillsHtml = `
    <div class="cf-stack">
      <div class="cf-stack-card" style="grid-column: 1 / -1;">
        <div class="cf-tags" style="justify-content:center;gap:12px">
          ${skills.map(s => `<span class="cf-tag" style="font-size:0.95rem;padding:8px 18px">✦ ${tplEsc(s)}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = `
    <div class="cf-prog">
      <span class="pct" id="cfPct">→ 0%</span>
      <div class="cf-keys">
        <div class="cf-keys-fill" id="cfFill"></div>
        <div class="cf-keys-text"><span class="cf-key on">const</span> dev = { name: "${name}", status: "building" };<span class="cf-cursor"></span></div>
      </div>
      <span class="cf-remain" id="cfRemain">portfolio flow</span>
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
        <div>
          <a class="cf-btn cf-btn-ghost" href="/" style="font-size:0.85rem;padding:8px 14px">Make yours</a>
        </div>
      </nav>
      <header class="cf-hero" style="min-height:70vh">
        <div>
          <div class="cf-hey">⚡ Hey there, I'm</div>
          <h1 class="cf-type">${name}</h1>
          <div class="cf-headline"><span id="cfTyped">${title}</span><span class="cur">|</span></div>
          <p class="cf-lead">${tagline}</p>
          <div class="cf-actions">
            <a href="#projects" class="cf-btn cf-btn-blue">Explore Projects →</a>
            ${email ? `<a href="mailto:${email}" class="cf-btn cf-btn-outline">Say Hello</a>` : ''}
          </div>
          <div class="cf-hero-socials">
            ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" title="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
            ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>` : ''}
            ${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" title="Instagram"><i class="fa-brands fa-instagram"></i></a>` : ''}
            ${email ? `<a href="mailto:${email}" title="Email"><i class="fa-solid fa-envelope"></i></a>` : ''}
          </div>
        </div>
        <div style="text-align:center">
          ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${name}" class="cf-hero-photo">` : `<div class="cf-hero-photo ph">${name.charAt(0)}</div>`}
        </div>
      </header>
      <section class="cf-section" id="about">
        <h2 class="cf-title">About Overview</h2>
        <p class="cf-sub">Core background, mindset, and experience.</p>
        <div class="cf-card" style="max-width:820px;margin:0 auto;text-align:center">
          <p style="font-size:1.1rem;line-height:1.8">${bio}</p>
          ${p.location ? `<p style="color:var(--cf-cyan);font-weight:600;margin-top:14px">📍 Based in ${tplEsc(p.location)}</p>` : ''}
        </div>
      </section>
      ${expHtml ? `
        <section class="cf-section" id="experience">
          <h2 class="cf-title">Experience &amp; Track Record</h2>
          <p class="cf-sub">Roles and accomplishments.</p>
          <div style="max-width:820px;margin:0 auto">${expHtml}</div>
        </section>
      ` : ''}
      <section class="cf-section" id="skills">
        <h2 class="cf-title">Core Technologies</h2>
        <p class="cf-sub">Languages, frameworks, and engineering tools.</p>
        ${skillsHtml}
      </section>
      <section class="cf-section" id="projects">
        <h2 class="cf-title">Featured Work</h2>
        <p class="cf-sub">Selected applications and development highlights.</p>
        <div style="max-width:860px;margin:0 auto">${projectsHtml || '<p style="text-align:center;color:var(--cf-faint)">No projects listed yet.</p>'}</div>
      </section>
      <section class="cf-section" id="contact" style="text-align:center">
        <h2 class="cf-title">Get in Touch</h2>
        <p class="cf-sub">Let's discuss new opportunities, contracts, or engineering challenges.</p>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          ${email ? `<a href="mailto:${email}" class="cf-btn cf-btn-blue">Email Me (${email})</a>` : ''}
          ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="cf-btn cf-btn-outline">LinkedIn Message</a>` : ''}
        </div>
      </section>
    </div>
    ${tplFoot(p)}
  `;

  window.scrollTo(0, 0);
  initCodeflowRuntime(p);
}

function initCodeflowRuntime(p) {
  const pctEl = document.getElementById('cfPct');
  const fillEl = document.getElementById('cfFill');
  const onScroll = () => {
    const docEl = document.documentElement || document.body || {};
    const st = window.scrollY || docEl.scrollTop || 0;
    const h = (docEl.scrollHeight || 1000) - (window.innerHeight || 800);
    const pct = h > 0 ? Math.min(100, Math.max(0, Math.round((st / h) * 100))) : 0;
    if (pctEl) pctEl.textContent = `→ ${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const typedEl = document.getElementById('cfTyped');
  const roles = [p.title || 'Software Developer', 'System Architect', 'Full Stack Builder'].filter(Boolean);
  if (typedEl && roles.length) {
    let rIdx = 0, cIdx = 0, del = false;
    const tick = () => {
      const cur = roles[rIdx % roles.length];
      typedEl.textContent = del ? cur.slice(0, cIdx--) : cur.slice(0, cIdx++);
      if (!del && cIdx > cur.length) { del = true; setTimeout(tick, 1400); return; }
      if (del && cIdx < 0) { del = false; cIdx = 0; rIdx++; }
      setTimeout(tick, del ? 45 : 95);
    };
    tick();
  }
}

/* --------------------------------------------------------------------------
   3. NEON WAVE — Emerald neon frequency lines on black
   -------------------------------------------------------------------------- */
function renderWave(p) {
  normTpl(p);
  document.body.dataset.template = 'wave';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Creative Technologist');
  const tagline = tplEsc(p.tagline || 'Designing high-performance systems with digital elegance.');
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, creating digital products at the intersection of robust backend architecture and striking visual aesthetics.`);
  const email = tplEsc(p.email || '');

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const expHtml = rawExp.map(e => `
    <div class="w-tl">
      <div class="w-tl-dot"></div>
      <div class="w-tl-card">
        <h3>${tplEsc(e.role || e.title || 'Role')}</h3>
        <div class="w-tl-date">${tplEsc(e.company || '')} • ${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</div>
        ${e.desc ? `<p>${tplEsc(e.desc)}</p>` : ''}
        ${(e.bullets || e.achievements || []).length ? `
          <ul>${(e.bullets || e.achievements).map(b => `<li>${tplEsc(b)}</li>`).join('')}</ul>
        ` : ''}
      </div>
    </div>
  `).join('');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Modern web software showcase.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const img = pr.image || pr.img || '';
    return `
      <div class="w-show">
        <div class="w-show-media">
          ${img ? `<img src="${tplEsc(img)}" alt="${prTitle}">` : `<div class="w-show-ph">${prTitle.slice(0, 2).toUpperCase()}</div>`}
        </div>
        <div class="w-show-info">
          <h3>${prTitle}</h3>
          <p style="color:var(--w-dim);line-height:1.7">${prDesc}</p>
          <div class="w-tags">
            ${techs.map(t => `<span class="w-tag">✦ ${tplEsc(t)}</span>`).join('')}
          </div>
          <div style="display:flex;gap:12px;margin-top:14px">
            ${prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" class="w-btn w-btn-green" style="padding:8px 18px">Code →</a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" class="w-btn w-btn-blue" style="padding:8px 18px">Live Demo →</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const skillsHtml = `
    <div class="w-chips">
      ${skills.map(s => `<span class="w-chip">✦ ${tplEsc(s)}</span>`).join('')}
    </div>
  `;

  document.getElementById('app').innerHTML = `
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
          ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${name}" class="w-about-photo">` : `<div class="w-about-photo ph">${name.charAt(0)}</div>`}
          <div class="w-about-text">
            <p>${bio}</p>
            ${p.location ? `<p><b>Location:</b> ${tplEsc(p.location)}</p>` : ''}
            <div class="w-socials">
              ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="w-soc"><i class="fa-brands fa-github"></i></a>` : ''}
              ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" class="w-soc"><i class="fa-brands fa-linkedin"></i></a>` : ''}
              ${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener" class="w-soc"><i class="fa-brands fa-instagram"></i></a>` : ''}
              ${email ? `<a href="mailto:${email}" class="w-soc"><i class="fa-solid fa-envelope"></i></a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </section>
    ${expHtml ? `
      <section class="w-section" id="journey">
        <div class="w-wrap">
          <div class="w-head">
            <h2>Journey &amp; Experience</h2>
            <p>Milestones and professional path.</p>
          </div>
          <div class="w-timeline">${expHtml}</div>
        </div>
      </section>
    ` : ''}
    <section class="w-section" id="skills">
      <div class="w-wrap">
        <div class="w-head">
          <h2>Capabilities &amp; Skills</h2>
          <p>Technologies used to bring ideas to reality.</p>
        </div>
        ${skillsHtml}
      </div>
    </section>
    <section class="w-section" id="projects">
      <div class="w-wrap">
        <div class="w-head">
          <h2>Selected Work</h2>
          <p>Highlighted engineering builds and applications.</p>
        </div>
        <div class="w-showcase">${projectsHtml || '<p style="text-align:center;color:var(--w-faint)">Projects coming soon.</p>'}</div>
      </div>
    </section>
    <section class="w-section" id="contact" style="text-align:center">
      <div class="w-wrap">
        <div class="w-head">
          <h2>Get in Touch</h2>
          <p>Open for contracts, full-time roles, and technical advisory.</p>
        </div>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
          ${email ? `<a href="mailto:${email}" class="w-btn w-btn-green">Email: ${email}</a>` : ''}
          ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="w-btn w-btn-dark">GitHub</a>` : ''}
        </div>
      </div>
    </section>
    ${tplFoot(p)}
  `;

  window.scrollTo(0, 0);
  initWaveRuntime(p);
}

function initWaveRuntime(p) {
  const canvas = document.getElementById('w-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => {
    const parent = canvas.parentElement || {};
    W = canvas.width = parent.offsetWidth || window.innerWidth || 1200;
    H = canvas.height = parent.offsetHeight || window.innerHeight || 800;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  const LINES = 120;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.0006;
    for (let i = 0; i < LINES; i++) {
      const prog = i / LINES;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 10) {
        const nx = x / W;
        const y = H * (0.2 + 0.6 * prog)
          + Math.sin(nx * 5 + t + prog * 4) * 50 * Math.sin(t * 0.4 + prog * 2)
          + Math.sin(nx * 10 - t * 1.2 + prog * 2) * 20;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const alpha = 0.04 + 0.18 * Math.pow(Math.sin(t * 0.6 + prog * Math.PI), 2);
      ctx.strokeStyle = `rgba(46,230,166,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (typeof window !== 'undefined' && window.requestAnimationFrame) window.requestAnimationFrame(draw);
    else if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(draw);
  };
  draw();
}

/* --------------------------------------------------------------------------
   4. AI ASSISTANT — ChatGPT-style conversational portfolio chat
   -------------------------------------------------------------------------- */
function renderAssistant(p) {
  normTpl(p);
  document.body.dataset.template = 'assistant';
  document.title = `${p.name} — AI Assistant Portfolio | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Software Engineer');
  const firstName = (p.name || '').trim().split(' ')[0] || 'the candidate';

  document.getElementById('app').innerHTML = `
    <div class="as-app" id="asApp">
      <div class="as-backdrop" onclick="document.getElementById('asApp').classList.remove('nav-open')"></div>
      <aside class="as-side">
        <button type="button" class="as-newchat" id="asNewChat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New Portfolio Chat
        </button>
        <div class="as-side-label">QUICK PROMPTS</div>
        <div class="as-side-list">
          <button type="button" class="as-side-item" data-q="Tell me about yourself"><span class="ic">👤</span> About ${tplEsc(firstName)}</button>
          <button type="button" class="as-side-item" data-q="Show me your projects"><span class="ic">💻</span> Featured Projects</button>
          <button type="button" class="as-side-item" data-q="What are your skills?"><span class="ic">⚡</span> Technical Skills</button>
          <button type="button" class="as-side-item" data-q="What is your experience?"><span class="ic">💼</span> Work Experience</button>
          <button type="button" class="as-side-item" data-q="How can I contact or hire you?"><span class="ic">📬</span> Contact &amp; Hire</button>
        </div>
        <div class="as-side-foot">
          ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${name}" class="av">` : `<div class="av">${name.charAt(0)}</div>`}
          <div class="meta">
            <b>${name}</b>
            <span>${title}</span>
          </div>
        </div>
      </aside>
      <main class="as-main">
        <div class="as-top">
          <button type="button" class="as-burger" onclick="document.getElementById('asApp').classList.toggle('nav-open')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div class="pill">
            <span>${name} AI Assistant</span>
          </div>
          <span class="badge">Model: Portfoolio-4.5</span>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
            <a href="/" class="btn btn-ghost btn-sm" style="font-size:12px;padding:4px 10px">Make yours</a>
            <button type="button" class="as-theme-btn" id="asThemeToggle" title="Toggle Theme">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ic-sun"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
          </div>
        </div>
        <div class="as-scroll" id="asScroll">
          <div class="as-thread" id="asThread">
            <div class="as-msg bot">
              <div class="av"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div>
              <div class="body">
                <p>Hello! 👋 I'm <b>${name}</b>'s AI assistant. I can answer questions about their work experience, key projects, technical skills, or how to get in touch.</p>
                <p>What would you like to explore?</p>
              </div>
            </div>
          </div>
          <div class="as-suggest" id="asSuggest">
            <button type="button" class="as-chip" data-q="Tell me about yourself">
              <span class="t">About ${tplEsc(firstName)}</span>
              <span class="d">Bio, role, and summary</span>
            </button>
            <button type="button" class="as-chip" data-q="Show me your projects">
              <span class="t">Projects</span>
              <span class="d">What they've built &amp; shipped</span>
            </button>
            <button type="button" class="as-chip" data-q="What are your skills?">
              <span class="t">Skills &amp; Stack</span>
              <span class="d">Languages, tools &amp; frameworks</span>
            </button>
            <button type="button" class="as-chip" data-q="What is your experience?">
              <span class="t">Experience</span>
              <span class="d">Career history &amp; roles</span>
            </button>
            <button type="button" class="as-chip" data-q="How can I contact or hire you?">
              <span class="t">Contact</span>
              <span class="d">Email, socials &amp; hire details</span>
            </button>
          </div>
        </div>
        <div class="as-composer">
          <div class="as-composer-inner">
            <div class="as-inputbar">
              <textarea id="asInput" rows="1" placeholder="Message ${tplEsc(firstName)}'s AI Assistant..."></textarea>
              <button type="button" class="as-send" id="asSend" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="as-disclaimer">Powered by portfoolio.me • Interactive conversational portfolio</div>
          </div>
        </div>
      </main>
    </div>
  `;

  initAssistantRuntime(p);
}

function initAssistantRuntime(p) {
  const name = tplEsc(p.name || 'Developer');
  const firstName = (p.name || '').trim().split(' ')[0] || 'the candidate';
  const thread = document.getElementById('asThread');
  const scroll = document.getElementById('asScroll');
  const input = document.getElementById('asInput');
  const send = document.getElementById('asSend');
  const suggest = document.getElementById('asSuggest');
  const newChat = document.getElementById('asNewChat');
  const themeToggle = document.getElementById('asThemeToggle');

  const scrollToBottom = () => {
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  };

  const addUserMsg = (text) => {
    const div = document.createElement('div');
    div.className = 'as-msg user';
    div.innerHTML = `<div class="bubble">${tplEsc(text)}</div>`;
    thread.appendChild(div);
    scrollToBottom();
  };

  const addBotMsg = (html) => {
    const div = document.createElement('div');
    div.className = 'as-msg bot';
    div.innerHTML = `
      <div class="av"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div>
      <div class="body">${html}</div>
    `;
    thread.appendChild(div);
    scrollToBottom();
  };

  const answerQuestion = (q) => {
    const query = q.toLowerCase();
    if (/skill|tech|stack|language|framework|tool/.test(query)) {
      const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
      if (!skills.length) return `<p>${name} hasn't listed skills yet.</p>`;
      return `
        <p>${name} works proficiently with the following technologies:</p>
        <div class="tags">${skills.map(s => `<span class="tag">${tplEsc(s)}</span>`).join('')}</div>
      `;
    }
    if (/project|built|built|code|app|work|portfolio/.test(query)) {
      const prs = p.projects || [];
      if (!prs.length) return `<p>${name} has not added specific project showcases yet.</p>`;
      return `
        <p>Here are key projects shipped by ${name}:</p>
        <ul>
          ${prs.map(pr => `
            <li>
              <b>${tplEsc(pr.title)}</b> - ${tplEsc(pr.desc || '')}
              <div class="card-links">
                ${pr.url ? `<a href="${tplEsc(pr.url)}" target="_blank" rel="noopener">Code Repo ↗</a>` : ''}
                ${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank" rel="noopener">Live Demo ↗</a>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    }
    if (/experience|job|career|role|company|employ/.test(query)) {
      const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
      if (!rawExp.length) return `<p>Work experience has not been populated yet.</p>`;
      return `
        <p>Career highlights for ${name}:</p>
        <ul>
          ${rawExp.map(e => `
            <li>
              <b>${tplEsc(e.role || e.title)}</b> @ ${tplEsc(e.company || '')} <span class="sub">(${tplEsc(e.year || e.dates || 'Recent')})</span>
              ${e.desc ? `<br><span class="sub">${tplEsc(e.desc)}</span>` : ''}
            </li>
          `).join('')}
        </ul>
      `;
    }
    if (/contact|email|reach|hire|touch|phone|talk/.test(query)) {
      return `
        <p>You can connect with ${name} directly:</p>
        <div class="card-links">
          ${p.email ? `<a href="mailto:${tplEsc(p.email)}">✉️ Email ${tplEsc(p.email)}</a>` : ''}
          ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn Profile</a>` : ''}
          ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">🐙 GitHub Profile</a>` : ''}
          ${tplShowInsta(p) ? `<a href="${tplEsc(p.instagram)}" target="_blank" rel="noopener">📷 Instagram</a>` : ''}
        </div>
      `;
    }
    if (/about|who|bio|summary|intro/.test(query)) {
      return `
        <p><b>${name}</b> — ${tplEsc(p.title || 'Developer')}</p>
        <p>${tplEsc(p.bio || p.summary || p.tagline || 'Dedicated software engineer crafting modern web applications.')}</p>
        ${p.location ? `<p>📍 Based in <b>${tplEsc(p.location)}</b></p>` : ''}
      `;
    }
    if (/hi|hello|hey|yo/.test(query)) {
      return `<p>Hey! Feel free to ask about ${name}'s skills, projects, work experience, or how to get in touch!</p>`;
    }
    return `
      <p>I can tell you all about ${name} across these topics:</p>
      <div class="tags">
        <span class="tag">Projects</span>
        <span class="tag">Technical Skills</span>
        <span class="tag">Work Experience</span>
        <span class="tag">Contact Info</span>
      </div>
      <p>What would you like to know more about?</p>
    `;
  };

  const handleAsk = (q) => {
    if (!q || !q.trim()) return;
    if (suggest) suggest.style.display = 'none';
    addUserMsg(q.trim());
    setTimeout(() => {
      addBotMsg(answerQuestion(q));
    }, 280);
    const appEl = document.getElementById('asApp');
    if (appEl) appEl.classList.remove('nav-open');
  };

  const submitInput = () => {
    const val = (input?.value || '').trim();
    if (!val) return;
    input.value = '';
    send.disabled = true;
    handleAsk(val);
  };

  if (input) {
    input.addEventListener('input', () => {
      send.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitInput();
      }
    });
  }
  if (send) send.addEventListener('click', submitInput);

  document.querySelectorAll('[data-q]').forEach(btn => {
    btn.addEventListener('click', () => {
      handleAsk(btn.getAttribute('data-q'));
    });
  });

  if (newChat) {
    newChat.addEventListener('click', () => {
      thread.innerHTML = `
        <div class="as-msg bot">
          <div class="av"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div>
          <div class="body">
            <p>Chat reset! Ask me anything about <b>${name}</b>'s work, experience, or skills.</p>
          </div>
        </div>
      `;
      if (suggest) suggest.style.display = '';
      const appEl = document.getElementById('asApp');
      if (appEl) appEl.classList.remove('nav-open');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('as-light');
    });
  }
}

/* --------------------------------------------------------------------------
   5. DEV CONSOLE — Terminal window with command shell & tabs
   -------------------------------------------------------------------------- */
function renderConsole(p) {
  normTpl(p);
  document.body.dataset.template = 'console';
  document.title = `${p.name} ~ $ console | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Systems Engineer');
  const email = tplEsc(p.email || '');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  document.getElementById('app').innerHTML = `
    <div class="cs-top">
      <a href="/" class="cs-brand"><span class="cs-logo">&lt;/&gt;</span>${name}</a>
      <div class="cs-nav">
        <a href="#whoami">whoami</a>
        <a href="#skills">skills</a>
        <a href="#projects">projects</a>
        <a href="#contact">contact</a>
      </div>
      <div>
        <a href="/" class="btn btn-ghost btn-sm" style="font-size:12px">Make yours</a>
      </div>
    </div>
    <main style="max-width:1100px;margin:20px auto;padding:0 20px 60px">
      <div class="cs-hero" id="whoami">
        <div class="cs-mini-term">
          <div class="cs-mini-line">user@portfoolio:~$ whoami</div>
          <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);margin:14px 0 6px">${name}</h1>
          <p style="color:var(--cs-muted);font-size:1.1rem">${title}</p>
          <div class="cs-mini-meta">
            <span>● Status: Available for hire</span><br>
            <span>● Tagline: ${tplEsc(p.tagline || 'Building high-performance software')}</span>
          </div>
          <div class="cs-progress"><i style="width: 88%;"></i></div>
        </div>
      </div>

      <div class="cs-section" id="skills">
        <h2>$ cat skills.json</h2>
        <div class="cs-pills">
          ${skills.map(s => `<span>✦ ${tplEsc(s)}</span>`).join('')}
        </div>
      </div>

      <div class="cs-section" id="projects">
        <h2>$ ls -la ./projects/</h2>
        <div class="cs-grid">
          ${projects.map((pr, i) => `
            <div class="cs-card">
              <h3>${tplEsc(pr.title)}</h3>
              <p>${tplEsc(pr.desc || 'Software repository')}</p>
              <div class="cs-links">
                ${pr.url ? `<a href="${tplEsc(pr.url)}" target="_blank" rel="noopener">source</a>` : ''}
                ${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank" rel="noopener">live-demo</a>` : ''}
              </div>
            </div>
          `).join('') || '<p class="cs-muted">No projects found.</p>'}
        </div>
      </div>

      <div class="cs-section" id="terminal-window">
        <h2>$ bash --interactive</h2>
        <div class="cs-window">
          <div class="cs-win-head">
            <span style="color:#ff5f56">●</span>
            <span style="color:#ffbd2e">●</span>
            <span style="color:#27c93f">●</span>
            <div class="cs-tab">portfoolio-shell</div>
            <div class="cs-window-actions">_ □ ×</div>
          </div>
          <div class="cs-terminal">
            <div id="csTerminalOutput">
              <div class="cs-command-card">
                <h3>System Initialized: Portfoolio Shell v2.4</h3>
                <p class="cs-muted">Available commands: <b>skills</b>, <b>projects</b>, <b>exp</b>, <b>contact</b>, <b>clear</b>, <b>help</b></p>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:14px">
              <span style="color:var(--cs-green)">$</span>
              <input type="text" id="csInput" placeholder="Type a command (e.g. 'skills' or 'contact')..." style="flex:1;background:transparent;border:none;color:#fff;font-family:inherit;outline:none;font-size:0.95rem">
            </div>
          </div>
        </div>
      </div>

      <div class="cs-section cs-contact" id="contact">
        <h2>$ ping contact</h2>
        <p>Reach out to discuss engineering roles or projects.</p>
        <div class="cs-contact-row">
          ${email ? `<a href="mailto:${email}">✉️ ${email}</a>` : ''}
          ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
          ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
        </div>
      </div>
    </main>
    ${tplFoot(p)}
  `;

  initConsoleRuntime(p);
}

function initConsoleRuntime(p) {
  const input = document.getElementById('csInput');
  const output = document.getElementById('csTerminalOutput');
  if (!input || !output) return;

  const runCommand = (cmd) => {
    const c = cmd.trim().toLowerCase();
    const entry = document.createElement('div');
    entry.className = 'cs-command-card';

    if (c === 'clear') {
      output.innerHTML = '';
      return;
    }
    if (c === 'skills') {
      const s = (p.skills || []).map(x => typeof x === 'string' ? x : x.name).join(', ');
      entry.innerHTML = `<h3>$ skills</h3><p>${tplEsc(s || 'None listed')}</p>`;
    } else if (c === 'projects') {
      const prs = (p.projects || []).map(pr => pr.title).join(' | ');
      entry.innerHTML = `<h3>$ projects</h3><p>${tplEsc(prs || 'No projects listed')}</p>`;
    } else if (c === 'exp') {
      const rawExp = (p.experience || (p.resume && p.resume.experience) || []).map(e => `${e.role || e.title} @ ${e.company}`).join('; ');
      entry.innerHTML = `<h3>$ exp</h3><p>${tplEsc(rawExp || 'No experience listed')}</p>`;
    } else if (c === 'contact') {
      entry.innerHTML = `<h3>$ contact</h3><p>Email: ${tplEsc(p.email || 'None')} | GitHub: ${tplEsc(p.github || 'None')}</p>`;
    } else {
      entry.innerHTML = `<h3>$ ${tplEsc(c)}</h3><p class="cs-muted">Command recognized. Available: <b>skills</b>, <b>projects</b>, <b>exp</b>, <b>contact</b>, <b>clear</b></p>`;
    }
    output.appendChild(entry);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value;
      input.value = '';
      runCommand(v);
    }
  });
}

/* --------------------------------------------------------------------------
   6. SNOWCARD — Light dotted canvas with neo-brutalist yellow stickers
   -------------------------------------------------------------------------- */
function renderSnowcard(p) {
  normTpl(p);
  document.body.dataset.template = 'snowcard';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Product Developer');
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, crafting memorable web applications with bold design and clean code.`);
  const email = tplEsc(p.email || '');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map((pr, i) => `
    <div class="sc-card" style="margin-bottom:24px">
      <h2>${tplEsc(pr.title)}</h2>
      <p>${tplEsc(pr.desc || 'Project showcase')}</p>
      <div style="display:flex;gap:12px;margin-top:14px">
        ${pr.url ? `<a href="${tplEsc(pr.url)}" target="_blank" rel="noopener" style="font-weight:800;text-decoration:underline">Code Repository →</a>` : ''}
        ${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank" rel="noopener" style="font-weight:800;text-decoration:underline">Live Preview →</a>` : ''}
      </div>
    </div>
  `).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  document.getElementById('app').innerHTML = `
    <button type="button" class="sc-mode" id="scModeBtn" aria-label="Toggle dark mode">
      <svg viewBox="0 0 24 24" class="sc-sun"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      <svg viewBox="0 0 24 24" class="sc-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
    <div class="sc-page">
      <div class="sc-date" id="scDate"></div>
      <div class="sc-hero">
        <div class="sc-intro">
          <h1>${name}</h1>
          <h2>${title}</h2>
          <div class="sc-socials">
            ${email ? `<a href="mailto:${email}">Email</a>` : ''}
            ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
            ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
          </div>
        </div>
        <div class="sc-photo">
          ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
        </div>
      </div>
      <nav class="sc-tabs">
        <a href="#about" class="active">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="sc-card" id="about">
        <h2>About</h2>
        <p>${bio}</p>
        ${p.location ? `<p><b>Location:</b> ${tplEsc(p.location)}</p>` : ''}
      </div>
      <div class="sc-card" id="skills">
        <h2>Skills &amp; Toolkit</h2>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${skills.map(s => `<span style="background:var(--sc-yellow);color:#050505;font-weight:800;padding:6px 14px;border:2px solid #000;border-radius:6px">✦ ${tplEsc(s)}</span>`).join('')}
        </div>
      </div>
      <div id="projects">
        <div class="sc-section-head" style="margin-bottom:16px"><h2>Selected Projects</h2></div>
        ${projectsHtml || '<p>No projects listed yet.</p>'}
      </div>
      <div class="sc-card" id="contact" style="text-align:center">
        <h2>Get in Touch</h2>
        <p>Available for select engineering opportunities and projects.</p>
        ${email ? `<a href="mailto:${email}" style="display:inline-block;margin-top:12px;background:#000;color:#fff;padding:12px 24px;border-radius:8px;font-weight:800">Email: ${email}</a>` : ''}
      </div>
    </div>
    ${tplFoot(p)}
  `;

  initSnowcardRuntime(p);
}

function initSnowcardRuntime(p) {
  const dEl = document.getElementById('scDate');
  if (dEl) {
    dEl.textContent = new Date().toLocaleString(undefined, { weekday:'short', year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' });
  }
  const modeBtn = document.getElementById('scModeBtn');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('sc-dark');
    });
  }
}

/* --------------------------------------------------------------------------
   7. PARCHMENT SCROLL — Antique ancient letter on unrolling parchment
   -------------------------------------------------------------------------- */
function renderParchment(p) {
  normTpl(p);
  document.body.dataset.template = 'parchment';
  document.title = `${p.name} — Scroll | portfoolio.me`;
  const name = tplEsc(p.name || 'Scholar');
  const title = tplEsc(p.title || 'Writer & Technologist');
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, crafting enduring works through thoughtful engineering and classical design.`);
  const email = tplEsc(p.email || '');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map(pr => `
    <div class="pa-work">
      <h3>${tplEsc(pr.title)}</h3>
      <p class="pa-prose">${tplEsc(pr.desc || '')}</p>
      <div class="pa-work-links">
        ${pr.url ? `<a href="${tplEsc(pr.url)}" target="_blank" rel="noopener">View Work ❧</a>` : ''}
        ${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank" rel="noopener">Live Demonstration ❧</a>` : ''}
      </div>
    </div>
  `).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  document.getElementById('app').innerHTML = `
    <div class="pa-desk"></div>
    <div class="pa-scroll">
      <div class="pa-rod">
        <span class="knob l"></span>
        <span class="knob r"></span>
      </div>
      <div class="pa-paper">
        <div class="pa-paper-in">
          <header class="pa-hero">
            <div class="pa-salut">To Whom It May Concern</div>
            <div class="pa-portrait">
              ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
            </div>
            <h1 class="pa-name">${name}</h1>
            <div class="pa-flourish"><i></i><span>❦</span><i></i></div>
            <div class="pa-title">${title}</div>
            ${p.location ? `<div class="pa-place">Residing in ${tplEsc(p.location)}</div>` : ''}
            <div class="pa-quote">"${tplEsc(p.tagline || 'In dedication of noble craft and digital excellence.')}"</div>
            <div class="pa-cta">
              ${email ? `<a href="mailto:${email}" class="pa-btn">Send Dispatch ✉</a>` : ''}
              ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener" class="pa-btn pa-btn-ghost">Portfolio Works</a>` : ''}
            </div>
          </header>

          <div class="pa-divider"><i></i><span>❧</span><i></i></div>

          <section class="pa-blk">
            <div class="pa-head">
              <span class="orn">❦</span>
              <h2>About the Craftsman</h2>
              <span class="orn f">❦</span>
            </div>
            <p class="pa-prose pa-dropcap">${bio}</p>
          </section>

          <div class="pa-divider"><i></i><span>❧</span><i></i></div>

          <section class="pa-blk">
            <div class="pa-head">
              <span class="orn">❦</span>
              <h2>Disciplines &amp; Skills</h2>
              <span class="orn f">❦</span>
            </div>
            <div class="pa-tags">
              ${skills.map(s => `<span class="pa-tag">${tplEsc(s)}</span>`).join('')}
            </div>
          </section>

          <div class="pa-divider"><i></i><span>❧</span><i></i></div>

          <section class="pa-blk">
            <div class="pa-head">
              <span class="orn">❦</span>
              <h2>Selected Works</h2>
              <span class="orn f">❦</span>
            </div>
            ${projectsHtml || '<p class="pa-prose" style="text-align:center">Works documented upon inquiry.</p>'}
          </section>

          <div class="pa-divider"><i></i><span>❧</span><i></i></div>

          <section class="pa-blk" style="text-align:center">
            <div class="pa-head">
              <span class="orn">❦</span>
              <h2>Correspondence</h2>
              <span class="orn f">❦</span>
            </div>
            <p class="pa-prose">For commissions, inquiries, or scholarly correspondence:</p>
            ${email ? `<p style="margin-top:12px"><a href="mailto:${email}" class="pa-ink" style="font-size:1.1rem">${email}</a></p>` : ''}
          </section>
        </div>
      </div>
      <div class="pa-rod">
        <span class="knob l"></span>
        <span class="knob r"></span>
      </div>
    </div>
    ${tplFoot(p)}
  `;

  window.scrollTo(0, 0);
}

/* --------------------------------------------------------------------------
   8. CLOUD BLUE — Airy sky-blue cloudscape with friendly cards
   -------------------------------------------------------------------------- */
function renderCloud(p) {
  normTpl(p);
  document.body.dataset.template = 'cloud';
  document.title = `${p.name} — ${p.title} | portfoolio.me`;
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Frontend Engineer');
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, creating friendly, accessible, and delightful digital experiences for everyone.`);
  const email = tplEsc(p.email || '');

  const projects = Array.isArray(p.projects) ? p.projects : [];
  const projectsHtml = projects.map(pr => `
    <div class="cw-card" style="margin-bottom:20px">
      <h3>${tplEsc(pr.title)}</h3>
      <p style="color:var(--cw-muted);margin:8px 0 14px">${tplEsc(pr.desc || '')}</p>
      <div style="display:flex;gap:12px">
        ${pr.url ? `<a href="${tplEsc(pr.url)}" target="_blank" rel="noopener" style="color:var(--cw-accent);font-weight:700">Code →</a>` : ''}
        ${pr.demoUrl ? `<a href="${tplEsc(pr.demoUrl)}" target="_blank" rel="noopener" style="color:var(--cw-accent);font-weight:700">Demo →</a>` : ''}
      </div>
    </div>
  `).join('');

  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);

  document.getElementById('app').innerHTML = `
    <div class="cw-bg">
      <svg class="puff" style="top:15%;left:10%;width:180px;height:70px" viewBox="0 0 100 40"><path d="M10,35 Q20,10 40,20 Q60,5 80,25 Q95,25 95,35 Z"/></svg>
      <svg class="puff p2" style="top:45%;left:60%;width:240px;height:90px" viewBox="0 0 100 40"><path d="M10,35 Q20,10 40,20 Q60,5 80,25 Q95,25 95,35 Z"/></svg>
    </div>
    <div class="cw-main">
      <nav class="cw-nav">
        <div class="cw-logo">${name}</div>
        <div class="cw-links">
          <a href="#about" class="active">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <a href="/" class="btn btn-ghost btn-sm" style="font-size:12px;padding:4px 10px">Make yours</a>
          <button type="button" class="cw-theme" id="cwThemeBtn" title="Toggle theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ic-sun"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>
          </button>
        </div>
      </nav>
      <div class="cw-wrap">
        <header class="cw-hero">
          <div>
            <h1>Hi, I'm ${name}.<br><span class="role" id="cwRole">${title}</span><span class="cw-cursor">|</span></h1>
            <p>${tplEsc(p.tagline || 'Building welcoming web applications and high-quality software.')}</p>
            <div style="display:flex;gap:12px;margin-top:24px">
              <a href="#projects" class="cw-cta">View Projects</a>
              ${email ? `<a href="mailto:${email}" class="btn btn-ghost" style="padding:15px 32px;border-radius:12px">Email Me</a>` : ''}
            </div>
          </div>
          <div style="text-align:center">
            ${p.avatarUrl ? `<img src="${tplEsc(p.avatarUrl)}" alt="${name}" style="width:260px;height:260px;border-radius:50%;object-fit:cover;border:6px solid #fff;box-shadow:var(--cw-shadow)">` : `<div style="width:200px;height:200px;border-radius:50%;background:linear-gradient(135deg,var(--cw-accent),#7aa2ff);color:#fff;display:grid;place-items:center;font-size:4rem;font-weight:800;margin:0 auto">${name.charAt(0)}</div>`}
          </div>
        </header>

        <section class="cw-section" id="about">
          <h2 class="cw-h2">About Me</h2>
          <div class="cw-bar"></div>
          <div class="cw-card" style="max-width:760px;margin:0 auto;text-align:center">
            <p style="font-size:1.1rem;line-height:1.8;color:var(--cw-muted)">${bio}</p>
          </div>
        </section>

        <section class="cw-section alt" id="skills">
          <h2 class="cw-h2">Technical Skills</h2>
          <div class="cw-bar"></div>
          <div class="cw-skills">
            ${skills.map(s => `<span class="cw-skill">✦ ${tplEsc(s)}</span>`).join('')}
          </div>
        </section>

        <section class="cw-section" id="projects">
          <h2 class="cw-h2">Featured Projects</h2>
          <div class="cw-bar"></div>
          <div style="max-width:820px;margin:0 auto">${projectsHtml || '<p style="text-align:center">Projects coming soon.</p>'}</div>
        </section>

        <section class="cw-section alt" id="contact" style="text-align:center">
          <h2 class="cw-h2">Get in Touch</h2>
          <div class="cw-bar"></div>
          <p class="cw-sub">Let's talk about new projects, creative roles, or technology.</p>
          ${email ? `<p style="margin-top:18px"><a href="mailto:${email}" class="cw-cta">Send an Email (${email})</a></p>` : ''}
        </section>
      </div>
    </div>
    ${tplFoot(p)}
  `;

  initCloudRuntime(p);
}






function initEditorRuntime(p) {
  // Live clock
  const clock = document.getElementById('ed-clock');
  function tick() {
    if (clock) {
      const d = new Date();
      clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
  }
  tick();
  if (typeof setInterval === 'function') { setInterval(tick, 15000); }

  // File explorer & tab click scrolling
  const scroller = document.getElementById('ed-scroll');
  function go(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('[data-target]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      go(a.getAttribute('data-target'));
    });
  });

  // Active file highlight as you scroll
  const files = {};
  document.querySelectorAll('.ed-file[data-target]').forEach(f => {
    files[f.getAttribute('data-target')] = f;
  });
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && files[en.target.id]) {
          document.querySelectorAll('.ed-file').forEach(f => f.classList.remove('active'));
          files[en.target.id].classList.add('active');
        }
      });
    }, { root: scroller && scroller.clientHeight ? scroller : null, rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.ed-section').forEach(s => {
      if (files[s.id]) obs.observe(s);
    });
  }

  // Copilot Chatbot
  const chat = document.getElementById('ed-chat');
  const form = document.getElementById('ed-chat-form');
  const input = document.getElementById('ed-chat-input');
  const suggest = document.getElementById('ed-suggest');
  if (!chat || !form || !input) return;

  const fname = (p.name || 'Developer').trim().split(' ')[0] || 'Developer';
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  function el(cls, html) {
    const d = document.createElement('div');
    d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function escStr(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function addUser(t) {
    const m = el('ed-msg ed-msg-user');
    m.appendChild(el('tx', escStr(t)));
    chat.appendChild(m);
    chat.scrollTop = chat.scrollHeight;
  }
  function addBot(t) {
    const m = el('ed-msg');
    m.appendChild(el('av'));
    const tx = el('tx');
    tx.innerHTML = escStr(t).replace(/\n/g, '<br>');
    m.appendChild(tx);
    chat.appendChild(m);
    chat.scrollTop = chat.scrollHeight;
  }

  function reply(q) {
    q = (q || '').toLowerCase();
    if (/\b(hi|hello|hey|yo|greetings)\b/.test(q)) {
      return `Hey! 👋 Ask me about ${fname}'s skills, projects, experience, or contact.`;
    }
    if (/skill|tech|stack|language|tool|know|expert|proficiency/.test(q)) {
      if (!skills.length) return "No skills are listed yet.";
      return `${fname} works with: ${skills.slice(0, 15).join(', ')}.`;
    }
    if (/project|built|build|ship|made|app|portfolio/.test(q)) {
      if (!projects.length) return "No projects are listed yet.";
      return "Here are some highlights:\n" + projects.slice(0, 4).map(pr => "• " + (pr.title || pr.name || 'Project') + (pr.desc || pr.description ? " — " + (pr.desc || pr.description) : "")).join("\n");
    }
    if (/experience|work|job|role|company|career|intern/.test(q)) {
      if (!rawExp.length) return "No work experience is listed yet.";
      return rawExp.slice(0, 4).map(e => "• " + (e.role || e.title || 'Role') + (e.company ? " @ " + e.company : "") + (e.dates || e.year ? " (" + (e.dates || e.year) + ")" : "")).join("\n");
    }
    if (/education|study|degree|college|university|school|grad/.test(q)) {
      if (!education.length) return "No education credentials listed yet.";
      return education.map(e => "• " + (e.institution || e.school || 'University') + (e.degree ? " — " + e.degree : "")).join("\n");
    }
    if (/contact|email|reach|hire|touch|connect|phone|message/.test(q)) {
      const parts = [];
      if (p.email) parts.push("✉ " + p.email);
      if (p.phone) parts.push("☎ " + p.phone);
      if (p.github) parts.push("GitHub: " + p.github);
      if (p.linkedin) parts.push("LinkedIn: " + p.linkedin);
      return parts.length ? ("Here is how to reach " + fname + ":\n" + parts.join("\n")) : "Contact details are not listed yet.";
    }
    if (/who|about|yourself|summary|intro|bio/.test(q)) {
      return p.bio || p.summary || p.tagline || (fname + " — explore the tabs for the full story!");
    }
    return `I can assist with ${fname}'s skills, projects, experience, education, or contact details. Try clicking one of the chips below 👇`;
  }

  function ask(q) {
    if (!q) return;
    addUser(q);
    if (typeof setTimeout === 'function') {
      setTimeout(() => { addBot(reply(q)); }, 350);
    } else {
      addBot(reply(q));
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    ask(q);
  });

  if (suggest) {
    suggest.addEventListener('click', e => {
      const b = e.target.closest('.ed-chip-q');
      if (!b) return;
      ask(b.getAttribute('data-q'));
    });
  }
}


function initMagazineRuntime(p) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.mz-reveal').forEach(el => io.observe(el));
  }
}


function initBoldRuntime(p) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.pf-reveal').forEach(el => io.observe(el));

    const navLinks = Array.from(document.querySelectorAll('.pf-nav-links a'));
    if (navLinks.length) {
      const byId = {};
      navLinks.forEach(a => { byId[a.getAttribute('data-target')] = a; });
      const navObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const a = byId[en.target.id];
            if (a) a.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });
      document.querySelectorAll('.pf-section').forEach(s => { if (byId[s.id]) navObs.observe(s); });
    }
  } else {
    document.querySelectorAll('.pf-reveal').forEach(el => el.classList.add('in'));
  }
}


function initCleanRuntime(p) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.pf-reveal').forEach(el => io.observe(el));

    const navLinks = Array.from(document.querySelectorAll('.pf-nav-links a'));
    if (navLinks.length) {
      const byId = {};
      navLinks.forEach(a => { byId[a.getAttribute('data-target')] = a; });
      const navObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const a = byId[en.target.id];
            if (a) a.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });
      document.querySelectorAll('.pf-section').forEach(s => { if (byId[s.id]) navObs.observe(s); });
    }
  } else {
    document.querySelectorAll('.pf-reveal').forEach(el => el.classList.add('in'));
  }
}


function initVibrantRuntime(p) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.pf-reveal').forEach(el => io.observe(el));

    const navLinks = Array.from(document.querySelectorAll('.pf-nav-links a'));
    if (navLinks.length) {
      const byId = {};
      navLinks.forEach(a => { byId[a.getAttribute('data-target')] = a; });
      const navObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const a = byId[en.target.id];
            if (a) a.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });
      document.querySelectorAll('.pf-section').forEach(s => { if (byId[s.id]) navObs.observe(s); });
    }
  } else {
    document.querySelectorAll('.pf-reveal').forEach(el => el.classList.add('in'));
  }
}


function initNeonRuntime(p) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.nn-reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.nn-reveal').forEach(el => el.classList.add('in'));
  }
}


function initHackerRuntime(p) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.hk-reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.hk-reveal').forEach(el => el.classList.add('in'));
  }
}

function renderHacker(p) {
  normTpl(p);
  document.body.dataset.template = 'hacker';
  const name = tplEsc(p.name || 'HACKER / ENGINEER');
  const title = tplEsc(p.title || 'Machine Learning & Systems');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Driving innovation through advanced systems and terminal automation.');
  const about = tplEsc(p.about || (p.bio && p.bio.length > 60 ? p.bio : 'Passionate about leveraging modern systems and automation to solve complex problems. Focused on high-performance architectures and scalable deployments.'));
  const email = tplEsc(p.email || '');
  const github = tplEsc(p.github || '');
  const linkedin = tplEsc(p.linkedin || '');
  const twitter = tplEsc(p.twitter || '');
  const website = tplEsc(p.website || '');

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const skillsHtml = skills.map(s => `<span>${tplEsc(s)}</span>`).join('');

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || pr.name || `Build ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'High-performance system architecture engineered for scale.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : (prUrl && !prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const techStr = techs.length ? tplEsc(techs.join(', ')) : (pr.subtitle ? tplEsc(pr.subtitle) : '');
    return `
      <article class="hk-card">
        <h3>${prTitle}</h3>
        ${techStr ? `<div class="hk-kick">${techStr}</div>` : ''}
        <p>${prDesc}</p>
        <div class="hk-links">
          ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">launch</a>` : ''}
          ${prGh ? `<a href="${prGh}" target="_blank" rel="noopener">code</a>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const ePeriod = tplEsc(e.period || e.duration || e.date || [e.startDate, e.endDate].filter(Boolean).join(' – ') || 'Present');
    const eRole = tplEsc(e.role || e.title || 'Engineer');
    const eCompany = tplEsc(e.company || e.organization || '');
    const highlights = Array.isArray(e.highlights) ? e.highlights : (Array.isArray(e.description) ? e.description : (e.desc ? [e.desc] : (e.summary ? [e.summary] : [])));
    const hlHtml = highlights.length ? `<ul>${highlights.map(h => `<li>${tplEsc(h)}</li>`).join('')}</ul>` : '';
    return `
      <div class="hk-exp">
        <div class="hk-d">${ePeriod}</div>
        <h3>${eRole}${eCompany ? ` · ${eCompany}` : ''}</h3>
        ${hlHtml}
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => {
    const deg = tplEsc(ed.degree || ed.area || 'Degree');
    const inst = tplEsc(ed.institution || ed.school || 'University');
    const yr = tplEsc(ed.year || ed.date || ed.period || '');
    return `
      <article class="hk-card">
        <div class="hk-kick">${yr || 'credential'}</div>
        <h3>${deg} · ${inst}</h3>
        ${ed.description ? `<p>${tplEsc(ed.description)}</p>` : ''}
      </article>
    `;
  }).join('');

  const socials = [];
  if (github) socials.push(`<a href="${github}" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>`);
  if (linkedin) socials.push(`<a href="${linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>`);
  if (twitter) socials.push(`<a href="${twitter}" target="_blank" rel="noopener" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>`);
  if (website) socials.push(`<a href="${website}" target="_blank" rel="noopener" aria-label="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></a>`);
  if (email) socials.push(`<a href="mailto:${email}" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>`);

  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="hk-nav">
      <a href="#top" class="hk-brand">${name}</a>
      <div class="hk-lk">
        ${skills.length ? '<a href="#skills">stack</a>' : ''}
        ${projects.length ? '<a href="#projects">projects</a>' : ''}
        ${rawExp.length ? '<a href="#exp">history</a>' : ''}
        <a href="#contact">contact</a>
      </div>
    </nav>

    <main class="hk-wrap" id="top">
      <section class="hk-hero">
        <div class="hk-term">
          <div class="hk-bar"><i class="r"></i><i class="y"></i><i class="g"></i><span>${name} — bash</span></div>
          <div class="hk-body">
            <div class="hk-ln"><span class="hk-pr"></span><span class="hk-out">whoami</span></div>
            <h1>${name}</h1>
            <div class="hk-role">${title}</div>
            <div class="hk-ln" style="margin-top:14px"><span class="hk-pr"></span><span class="hk-out">cat about.txt</span></div>
            <p>${bio}<span class="hk-cur"></span></p>
            <div class="hk-cta">
              ${email ? `<a class="hk-btn" href="mailto:${email}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> contact</a>` : ''}
              ${github ? `<a class="hk-btn am" href="${github}" target="_blank" rel="noopener">github</a>` : ''}
              ${linkedin ? `<a class="hk-btn" href="${linkedin}" target="_blank" rel="noopener">linkedin</a>` : ''}
            </div>
          </div>
        </div>
      </section>

      ${about ? `
        <section class="hk-about hk-reveal" id="about">
          <div class="hk-lbl">about</div>
          <p>${about}</p>
        </section>
      ` : ''}

      ${skills.length ? `
        <section class="hk-reveal" id="skills">
          <div class="hk-lbl">stack --list</div>
          <div class="hk-skl">${skillsHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="hk-reveal" id="projects">
          <div class="hk-lbl">projects --all</div>
          <div class="hk-grid hk-g2">${projectsHtml}</div>
        </section>
      ` : ''}

      ${rawExp.length ? `
        <section class="hk-reveal" id="exp">
          <div class="hk-lbl">history --log</div>
          ${expHtml}
        </section>
      ` : ''}

      ${education.length ? `
        <section class="hk-reveal">
          <div class="hk-lbl">credentials</div>
          <div class="hk-grid hk-g2">${eduHtml}</div>
        </section>
      ` : ''}

      <footer class="hk-foot" id="contact">
        <div class="hk-lbl">contact --connect</div>
        ${email ? `<a class="hk-email" href="mailto:${email}">${email}</a>` : ''}
        <div class="hk-s">
          ${socials.join('')}
        </div>
        <p>© ${name} · Built with Portfoolio</p>
      </footer>
    </main>
  `;

  initHackerRuntime(p);
}

function renderNeon(p) {
  normTpl(p);
  document.body.dataset.template = 'neon';
  const name = tplEsc(p.name || 'CYBER ARCHITECT');
  const title = tplEsc(p.title || 'Systems Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Driving innovation in tech through high-performance systems and cyber architecture.');
  const about = tplEsc(p.about || (p.bio && p.bio.length > 60 ? p.bio : 'Driving innovation through advanced algorithms, resilient infrastructure, and high-performance engineering.'));
  const email = tplEsc(p.email || '');
  const github = tplEsc(p.github || '');
  const linkedin = tplEsc(p.linkedin || '');
  const twitter = tplEsc(p.twitter || '');
  const website = tplEsc(p.website || '');

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const skillsHtml = skills.map(s => `<span>${tplEsc(s)}</span>`).join('');

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || pr.name || `Build ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'High-performance system architecture engineered for scale.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : (prUrl && !prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const techStr = techs.length ? tplEsc(techs.join(', ')) : (pr.subtitle ? tplEsc(pr.subtitle) : '');
    return `
      <article class="nn-card">
        <h3>${prTitle}</h3>
        ${techStr ? `<div class="nn-kick">${techStr}</div>` : ''}
        <p>${prDesc}</p>
        <div class="nn-links">
          ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">Launch ↗</a>` : ''}
          ${prGh ? `<a href="${prGh}" target="_blank" rel="noopener">Source ↗</a>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const ePeriod = tplEsc(e.period || e.duration || e.date || [e.startDate, e.endDate].filter(Boolean).join(' – ') || 'Present');
    const eRole = tplEsc(e.role || e.title || 'Engineer');
    const eCompany = tplEsc(e.company || e.organization || '');
    const highlights = Array.isArray(e.highlights) ? e.highlights : (Array.isArray(e.description) ? e.description : (e.desc ? [e.desc] : (e.summary ? [e.summary] : [])));
    const hlHtml = highlights.length ? `<ul>${highlights.map(h => `<li>${tplEsc(h)}</li>`).join('')}</ul>` : '';
    return `
      <div class="nn-exp">
        <div class="nn-d">${ePeriod}</div>
        <h3>${eRole}${eCompany ? ` · ${eCompany}` : ''}</h3>
        ${hlHtml}
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => {
    const deg = tplEsc(ed.degree || ed.area || 'Degree');
    const inst = tplEsc(ed.institution || ed.school || 'University');
    const yr = tplEsc(ed.year || ed.date || ed.period || '');
    return `
      <article class="nn-card">
        <div class="nn-kick">${yr || 'Education'}</div>
        <h3>${deg} · ${inst}</h3>
        ${ed.description ? `<p>${tplEsc(ed.description)}</p>` : ''}
      </article>
    `;
  }).join('');

  const socials = [];
  if (github) socials.push(`<a href="${github}" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>`);
  if (linkedin) socials.push(`<a href="${linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>`);
  if (twitter) socials.push(`<a href="${twitter}" target="_blank" rel="noopener" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>`);
  if (website) socials.push(`<a href="${website}" target="_blank" rel="noopener" aria-label="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></a>`);
  if (email) socials.push(`<a href="mailto:${email}" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>`);

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="nn-grid-floor"></div>

    <nav class="nn-nav">
      <a href="#top" class="nn-brand">${name}</a>
      <div class="nn-lk">
        ${skills.length ? '<a href="#skills">Stack</a>' : ''}
        ${projects.length ? '<a href="#projects">Builds</a>' : ''}
        ${rawExp.length ? '<a href="#exp">Log</a>' : ''}
        <a href="#contact">Ping</a>
      </div>
    </nav>

    <main class="nn-wrap" id="top">
      <section class="nn-hero">
        <div class="nn-tag">// ${title}</div>
        <h1>${name}</h1>
        <div class="nn-role">${title}</div>
        ${bio ? `<p>${bio}</p>` : ''}
        <div class="nn-cta">
          ${email ? `<a class="nn-btn" href="mailto:${email}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> Contact</a>` : ''}
          ${github ? `<a class="nn-btn mg" href="${github}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> GitHub</a>` : ''}
          ${linkedin ? `<a class="nn-btn" href="${linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
        </div>
      </section>

      ${about ? `
        <section class="nn-about nn-reveal" id="about">
          <div class="nn-lbl">About</div>
          <p>${about}</p>
        </section>
      ` : ''}

      ${skills.length ? `
        <section class="nn-reveal" id="skills">
          <div class="nn-lbl">Tech Stack</div>
          <div class="nn-skl">${skillsHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="nn-reveal" id="projects">
          <div class="nn-lbl">Builds</div>
          <div class="nn-grid nn-g2">${projectsHtml}</div>
        </section>
      ` : ''}

      ${rawExp.length ? `
        <section class="nn-reveal" id="exp">
          <div class="nn-lbl">Career Log</div>
          ${expHtml}
        </section>
      ` : ''}

      ${education.length ? `
        <section class="nn-reveal">
          <div class="nn-lbl">Credentials</div>
          <div class="nn-grid nn-g2">${eduHtml}</div>
        </section>
      ` : ''}

      <footer class="nn-foot" id="contact">
        <div class="nn-lbl" style="justify-content:center">Establish Connection</div>
        <div class="nn-s">
          ${socials.join('')}
        </div>
        <p>© ${name} · Built with Portfoolio</p>
      </footer>
    </main>
  `;

  initNeonRuntime(p);
}

function renderVibrant(p) {
  normTpl(p);
  document.body.dataset.template = 'vibrant';
  if (document.body.classList) document.body.classList.add('pf-theme-vibrant');
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Creative Technologist');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Crafting interactive digital products, playful interfaces, and scalable modern web experiences.');
  const location = tplEsc(p.location || 'Remote / Worldwide');
  const email = tplEsc(p.email || '');
  const photo = p.photo || p.avatar || '';
  const firstLetter = (p.name || 'D').trim().charAt(0).toUpperCase();

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || pr.name || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Creative engineering project built with rich interactions and high fidelity.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);

    return `
      <article class="pf-card">
        <div class="pf-card-top">
          <h3>${prTitle}</h3>
          <div class="pf-card-links">
            ${prGh ? `<a href="${prGh}" target="_blank" rel="noopener" title="Code"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" title="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : (prUrl !== '#' && !prGh ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" title="Link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : '')}
          </div>
        </div>
        ${techs.length ? `<div class="pf-card-meta">${techs.slice(0, 4).map(t => tplEsc(t)).join(' • ')}</div>` : ''}
        <p style="color:var(--pf-body);font-size:.95rem;line-height:1.6;margin:12px 0 16px;">${prDesc}</p>
        ${techs.length ? `
          <div class="pf-chips" style="margin-top:auto;">
            ${techs.map(t => `<span class="pf-chip" style="font-size:.76rem;padding:4px 10px;">${tplEsc(t)}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const dateStr = tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent');
    const role = tplEsc(e.role || e.title || 'Engineer');
    const company = tplEsc(e.company || e.organization || '');
    const bullets = (e.bullets || e.achievements || []);
    return `
      <div class="pf-tl-item">
        <div class="pf-tl-date">${dateStr}</div>
        <div>
          <div class="pf-tl-head">
            <h3>${role} ${company ? `<span class="pf-tl-at">· ${company}</span>` : ''}</h3>
            ${e.location ? `<div class="pf-tl-loc">${tplEsc(e.location)}</div>` : ''}
          </div>
          ${e.desc ? `<p style="color:var(--pf-body);font-size:.95rem;margin:8px 0 6px;">${tplEsc(e.desc)}</p>` : ''}
          ${bullets.length ? `
            <ul class="pf-bullets">
              ${bullets.map(b => `<li>${tplEsc(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="pf-edu">
      <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
      <div class="pf-edu-degree">${tplEsc(ed.degree || ed.area || 'Degree')}</div>
      <div class="pf-edu-meta">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')} ${ed.score ? `· ${tplEsc(ed.score)}` : ''}</div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
    <header class="pf-nav" id="top">
      <a href="#top" class="pf-brand">${name}</a>
      <nav class="pf-nav-links" id="pf-navlinks">
        <a href="#about" data-target="about">About</a>
        ${rawExp.length ? '<a href="#experience" data-target="experience">Experience</a>' : ''}
        ${projects.length ? '<a href="#projects" data-target="projects">Work</a>' : ''}
        ${skills.length ? '<a href="#skills" data-target="skills">Skills</a>' : ''}
        <a href="#contact" data-target="contact">Contact</a>
      </nav>
    </header>

    <section class="pf-hero">
      <div class="pf-hero-text">
        <div class="pf-eyebrow">// ${title}</div>
        <h1 class="pf-name">${name}</h1>
        <div class="pf-tagline">${bio}</div>
        <div class="pf-loc">📍 ${location}</div>
        <div class="pf-hero-actions">
          ${email ? `<a class="pf-btn pf-btn-primary" href="mailto:${email}">Get in touch</a>` : ''}
          ${projects.length ? '<a class="pf-btn" href="#projects">View Work</a>' : ''}
        </div>
        <div class="pf-socials">
          ${p.github ? `<a class="pf-social" href="${tplEsc(p.github)}" target="_blank" rel="noopener" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
          ${p.linkedin ? `<a class="pf-social" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>` : ''}
          ${p.website ? `<a class="pf-social" href="${tplEsc(p.website)}" target="_blank" rel="noopener" title="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a>` : ''}
        </div>
      </div>
      <div class="pf-hero-media">
        ${photo ? `<img class="pf-photo" src="${tplEsc(photo)}" alt="${name}">` : `<div class="pf-avatar">${firstLetter}</div>`}
      </div>
    </section>

    <section class="pf-stats pf-reveal">
      <div class="pf-stat"><span class="pf-stat-num">${projects.length || 1}+</span><span class="pf-stat-lbl">Projects Built</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${skills.length || 8}+</span><span class="pf-stat-lbl">Skills &amp; Tools</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${rawExp.length || 1}+</span><span class="pf-stat-lbl">Experiences</span></div>
      <div class="pf-stat"><span class="pf-stat-num">100%</span><span class="pf-stat-lbl">Code Quality</span></div>
    </section>

    <main class="pf-main">
      <section class="pf-section pf-reveal pf-about" id="about">
        <div class="pf-section-head">
          <span class="pf-kicker">// 01</span>
          <h2>About</h2>
          <div class="pf-rule"></div>
        </div>
        <p>${bio}</p>
      </section>

      ${rawExp.length ? `
        <section class="pf-section pf-reveal" id="experience">
          <div class="pf-section-head">
            <span class="pf-kicker">// 02</span>
            <h2>Experience</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-timeline">${expHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="pf-section pf-reveal" id="projects">
          <div class="pf-section-head">
            <span class="pf-kicker">// 03</span>
            <h2>Work</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-cards">${projectsHtml}</div>
        </section>
      ` : ''}

      ${skills.length ? `
        <section class="pf-section pf-reveal" id="skills">
          <div class="pf-section-head">
            <span class="pf-kicker">// 04</span>
            <h2>Skills</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-chips">
            ${skills.map(s => `<span class="pf-chip">${tplEsc(s)}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      ${education.length ? `
        <section class="pf-section pf-reveal" id="education">
          <div class="pf-section-head">
            <span class="pf-kicker">// 05</span>
            <h2>Education</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-edu-grid">${eduHtml}</div>
        </section>
      ` : ''}

      <section class="pf-section pf-reveal pf-contact" id="contact">
        <div class="pf-section-head">
          <h2>Get in Touch</h2>
        </div>
        <div class="pf-contact-lead">Have a project, role, or technical challenge in mind? Let's connect and build something extraordinary.</div>
        <div class="pf-contact-actions">
          ${email ? `<a class="pf-btn pf-btn-primary" href="mailto:${email}">✉ ${email}</a>` : ''}
          ${p.github ? `<a class="pf-btn" href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
          ${p.linkedin ? `<a class="pf-btn" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
        </div>
      </section>

      <footer class="pf-footer">
        <div>© ${name} · Built with Portfoolio</div>
        <div>All rights reserved.</div>
      </footer>
    </main>
  `;

  initVibrantRuntime(p);
}


function renderClean(p) {
  normTpl(p);
  document.body.dataset.template = 'clean';
  if (document.body.classList) document.body.classList.add('pf-theme-clean');
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Product Software Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Crafting elegant, accessible, and high-performance digital applications with modern web technologies.');
  const location = tplEsc(p.location || 'Remote / Worldwide');
  const email = tplEsc(p.email || '');
  const photo = p.photo || p.avatar || '';
  const firstLetter = (p.name || 'D').trim().charAt(0).toUpperCase();

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || pr.name || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack application built with scalable architecture, responsive UI, and clean design.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);

    return `
      <article class="pf-card">
        <div class="pf-card-top">
          <h3>${prTitle}</h3>
          <div class="pf-card-links">
            ${prGh ? `<a href="${prGh}" target="_blank" rel="noopener" title="Code"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" title="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : (prUrl !== '#' && !prGh ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" title="Link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : '')}
          </div>
        </div>
        ${techs.length ? `<div class="pf-card-meta">${techs.slice(0, 4).map(t => tplEsc(t)).join(' • ')}</div>` : ''}
        <p style="color:var(--pf-body);font-size:.95rem;line-height:1.6;margin:12px 0 16px;">${prDesc}</p>
        ${techs.length ? `
          <div class="pf-chips" style="margin-top:auto;">
            ${techs.map(t => `<span class="pf-chip" style="font-size:.76rem;padding:4px 10px;">${tplEsc(t)}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const dateStr = tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent');
    const role = tplEsc(e.role || e.title || 'Engineer');
    const company = tplEsc(e.company || e.organization || '');
    const bullets = (e.bullets || e.achievements || []);
    return `
      <div class="pf-tl-item">
        <div class="pf-tl-date">${dateStr}</div>
        <div>
          <div class="pf-tl-head">
            <h3>${role} ${company ? `<span class="pf-tl-at">· ${company}</span>` : ''}</h3>
            ${e.location ? `<div class="pf-tl-loc">${tplEsc(e.location)}</div>` : ''}
          </div>
          ${e.desc ? `<p style="color:var(--pf-body);font-size:.95rem;margin:8px 0 6px;">${tplEsc(e.desc)}</p>` : ''}
          ${bullets.length ? `
            <ul class="pf-bullets">
              ${bullets.map(b => `<li>${tplEsc(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="pf-edu">
      <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
      <div class="pf-edu-degree">${tplEsc(ed.degree || ed.area || 'Degree')}</div>
      <div class="pf-edu-meta">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')} ${ed.score ? `· ${tplEsc(ed.score)}` : ''}</div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
    <header class="pf-nav" id="top">
      <a href="#top" class="pf-brand">${name}</a>
      <nav class="pf-nav-links" id="pf-navlinks">
        <a href="#about" data-target="about">About</a>
        ${rawExp.length ? '<a href="#experience" data-target="experience">Experience</a>' : ''}
        ${projects.length ? '<a href="#projects" data-target="projects">Work</a>' : ''}
        ${skills.length ? '<a href="#skills" data-target="skills">Skills</a>' : ''}
        <a href="#contact" data-target="contact">Contact</a>
      </nav>
    </header>

    <section class="pf-hero">
      <div class="pf-hero-text">
        <div class="pf-eyebrow">// ${title}</div>
        <h1 class="pf-name">${name}</h1>
        <div class="pf-tagline">${bio}</div>
        <div class="pf-loc">📍 ${location}</div>
        <div class="pf-hero-actions">
          ${email ? `<a class="pf-btn pf-btn-primary" href="mailto:${email}">Get in touch</a>` : ''}
          ${projects.length ? '<a class="pf-btn" href="#projects">View Work</a>' : ''}
        </div>
        <div class="pf-socials">
          ${p.github ? `<a class="pf-social" href="${tplEsc(p.github)}" target="_blank" rel="noopener" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
          ${p.linkedin ? `<a class="pf-social" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>` : ''}
          ${p.website ? `<a class="pf-social" href="${tplEsc(p.website)}" target="_blank" rel="noopener" title="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a>` : ''}
        </div>
      </div>
      <div class="pf-hero-media">
        ${photo ? `<img class="pf-photo" src="${tplEsc(photo)}" alt="${name}">` : `<div class="pf-avatar">${firstLetter}</div>`}
      </div>
    </section>

    <section class="pf-stats pf-reveal">
      <div class="pf-stat"><span class="pf-stat-num">${projects.length || 1}+</span><span class="pf-stat-lbl">Projects Built</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${skills.length || 8}+</span><span class="pf-stat-lbl">Skills &amp; Tools</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${rawExp.length || 1}+</span><span class="pf-stat-lbl">Experiences</span></div>
      <div class="pf-stat"><span class="pf-stat-num">100%</span><span class="pf-stat-lbl">Code Quality</span></div>
    </section>

    <main class="pf-main">
      <section class="pf-section pf-reveal pf-about" id="about">
        <div class="pf-section-head">
          <span class="pf-kicker">// 01</span>
          <h2>About</h2>
          <div class="pf-rule"></div>
        </div>
        <p>${bio}</p>
      </section>

      ${rawExp.length ? `
        <section class="pf-section pf-reveal" id="experience">
          <div class="pf-section-head">
            <span class="pf-kicker">// 02</span>
            <h2>Experience</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-timeline">${expHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="pf-section pf-reveal" id="projects">
          <div class="pf-section-head">
            <span class="pf-kicker">// 03</span>
            <h2>Work</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-cards">${projectsHtml}</div>
        </section>
      ` : ''}

      ${skills.length ? `
        <section class="pf-section pf-reveal" id="skills">
          <div class="pf-section-head">
            <span class="pf-kicker">// 04</span>
            <h2>Skills</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-chips">
            ${skills.map(s => `<span class="pf-chip">${tplEsc(s)}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      ${education.length ? `
        <section class="pf-section pf-reveal" id="education">
          <div class="pf-section-head">
            <span class="pf-kicker">// 05</span>
            <h2>Education</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-edu-grid">${eduHtml}</div>
        </section>
      ` : ''}

      <section class="pf-section pf-reveal pf-contact" id="contact">
        <div class="pf-section-head">
          <h2>Get in Touch</h2>
        </div>
        <div class="pf-contact-lead">Have a project, role, or technical challenge in mind? Let's connect and build something extraordinary.</div>
        <div class="pf-contact-actions">
          ${email ? `<a class="pf-btn pf-btn-primary" href="mailto:${email}">✉ ${email}</a>` : ''}
          ${p.github ? `<a class="pf-btn" href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
          ${p.linkedin ? `<a class="pf-btn" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
        </div>
      </section>

      <footer class="pf-footer">
        <div>© ${name} · Built with Portfoolio</div>
        <div>All rights reserved.</div>
      </footer>
    </main>
  `;

  initCleanRuntime(p);
}


function renderBold(p) {
  normTpl(p);
  document.body.dataset.template = 'bold';
  if (document.body.classList) document.body.classList.add('pf-theme-bold');
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Full Stack Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Building scalable, high-impact software systems with modern web architecture and robust engineering practices.');
  const location = tplEsc(p.location || 'Remote / Worldwide');
  const email = tplEsc(p.email || '');
  const photo = p.photo || p.avatar || '';
  const firstLetter = (p.name || 'D').trim().charAt(0).toUpperCase();

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || pr.name || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack engineering project built with scalable architecture and high performance.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);

    return `
      <article class="pf-card">
        <div class="pf-card-top">
          <h3>${prTitle}</h3>
          <div class="pf-card-links">
            ${prGh ? `<a href="${prGh}" target="_blank" rel="noopener" title="Code"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener" title="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : (prUrl !== '#' && !prGh ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" title="Link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : '')}
          </div>
        </div>
        ${techs.length ? `<div class="pf-card-meta">${techs.slice(0, 4).map(t => tplEsc(t)).join(' • ')}</div>` : ''}
        <p style="color:var(--pf-body);font-size:.95rem;line-height:1.6;margin:12px 0 16px;">${prDesc}</p>
        ${techs.length ? `
          <div class="pf-chips" style="margin-top:auto;">
            ${techs.map(t => `<span class="pf-chip" style="font-size:.76rem;padding:4px 10px;">${tplEsc(t)}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const dateStr = tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent');
    const role = tplEsc(e.role || e.title || 'Engineer');
    const company = tplEsc(e.company || e.organization || '');
    const bullets = (e.bullets || e.achievements || []);
    return `
      <div class="pf-tl-item">
        <div class="pf-tl-date">${dateStr}</div>
        <div>
          <div class="pf-tl-head">
            <h3>${role} ${company ? `<span class="pf-tl-at">· ${company}</span>` : ''}</h3>
            ${e.location ? `<div class="pf-tl-loc">${tplEsc(e.location)}</div>` : ''}
          </div>
          ${e.desc ? `<p style="color:var(--pf-body);font-size:.95rem;margin:8px 0 6px;">${tplEsc(e.desc)}</p>` : ''}
          ${bullets.length ? `
            <ul class="pf-bullets">
              ${bullets.map(b => `<li>${tplEsc(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="pf-edu">
      <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
      <div class="pf-edu-degree">${tplEsc(ed.degree || ed.area || 'Degree')}</div>
      <div class="pf-edu-meta">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')} ${ed.score ? `· ${tplEsc(ed.score)}` : ''}</div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
    <header class="pf-nav" id="top">
      <a href="#top" class="pf-brand">${name}</a>
      <nav class="pf-nav-links" id="pf-navlinks">
        <a href="#about" data-target="about">About</a>
        ${rawExp.length ? '<a href="#experience" data-target="experience">Experience</a>' : ''}
        ${projects.length ? '<a href="#projects" data-target="projects">Work</a>' : ''}
        ${skills.length ? '<a href="#skills" data-target="skills">Skills</a>' : ''}
        <a href="#contact" data-target="contact">Contact</a>
      </nav>
    </header>

    <section class="pf-hero">
      <div class="pf-hero-media">
        ${photo ? `<img class="pf-photo" src="${tplEsc(photo)}" alt="${name}">` : `<div class="pf-avatar">${firstLetter}</div>`}
      </div>
      <div class="pf-hero-text">
        <div class="pf-eyebrow">// ${title}</div>
        <h1 class="pf-name">${name}</h1>
        <div class="pf-tagline">${bio}</div>
        <div class="pf-loc">📍 ${location}</div>
        <div class="pf-hero-actions">
          ${email ? `<a class="pf-btn pf-btn-primary" href="mailto:${email}">Get in touch</a>` : ''}
          ${projects.length ? '<a class="pf-btn" href="#projects">View Work</a>' : ''}
        </div>
        <div class="pf-socials">
          ${p.github ? `<a class="pf-social" href="${tplEsc(p.github)}" target="_blank" rel="noopener" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
          ${p.linkedin ? `<a class="pf-social" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>` : ''}
          ${p.website ? `<a class="pf-social" href="${tplEsc(p.website)}" target="_blank" rel="noopener" title="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a>` : ''}
        </div>
      </div>
    </section>

    <section class="pf-stats pf-reveal">
      <div class="pf-stat"><span class="pf-stat-num">${projects.length || 1}+</span><span class="pf-stat-lbl">Projects Built</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${skills.length || 8}+</span><span class="pf-stat-lbl">Skills &amp; Tools</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${rawExp.length || 1}+</span><span class="pf-stat-lbl">Experiences</span></div>
      <div class="pf-stat"><span class="pf-stat-num">100%</span><span class="pf-stat-lbl">Code Quality</span></div>
    </section>

    <main class="pf-main">
      <section class="pf-section pf-reveal pf-about" id="about">
        <div class="pf-section-head">
          <span class="pf-kicker">// 01</span>
          <h2>About</h2>
          <div class="pf-rule"></div>
        </div>
        <p>${bio}</p>
      </section>

      ${rawExp.length ? `
        <section class="pf-section pf-reveal" id="experience">
          <div class="pf-section-head">
            <span class="pf-kicker">// 02</span>
            <h2>Experience</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-timeline">${expHtml}</div>
        </section>
      ` : ''}

      ${projects.length ? `
        <section class="pf-section pf-reveal" id="projects">
          <div class="pf-section-head">
            <span class="pf-kicker">// 03</span>
            <h2>Work</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-cards">${projectsHtml}</div>
        </section>
      ` : ''}

      ${skills.length ? `
        <section class="pf-section pf-reveal" id="skills">
          <div class="pf-section-head">
            <span class="pf-kicker">// 04</span>
            <h2>Skills</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-chips">
            ${skills.map(s => `<span class="pf-chip">${tplEsc(s)}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      ${education.length ? `
        <section class="pf-section pf-reveal" id="education">
          <div class="pf-section-head">
            <span class="pf-kicker">// 05</span>
            <h2>Education</h2>
            <div class="pf-rule"></div>
          </div>
          <div class="pf-edu-grid">${eduHtml}</div>
        </section>
      ` : ''}

      <section class="pf-section pf-reveal pf-contact" id="contact">
        <div class="pf-section-head">
          <h2>Get in Touch</h2>
        </div>
        <div class="pf-contact-lead">Have a project, role, or technical challenge in mind? Let's connect and build something extraordinary.</div>
        <div class="pf-contact-actions">
          ${email ? `<a class="pf-btn pf-btn-primary" href="mailto:${email}">✉ ${email}</a>` : ''}
          ${p.github ? `<a class="pf-btn" href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
          ${p.linkedin ? `<a class="pf-btn" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}
        </div>
      </section>

      <footer class="pf-footer">
        <div>© ${name} · Built with Portfoolio</div>
        <div>All rights reserved.</div>
      </footer>
    </main>
  `;

  initBoldRuntime(p);
}


function renderMagazine(p) {
  normTpl(p);
  document.body.dataset.template = 'magazine';
  if (document.body.classList) document.body.classList.add('pf-theme-editorial');
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Machine Learning Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Driving innovation with advanced algorithms, scalable system architectures, and human-centered digital experiences.');
  const location = tplEsc(p.location || 'Global Edition');
  const email = tplEsc(p.email || '');

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const projectsHtml = projects.map((pr, i) => {
    const num = String(i + 1).padStart(2, '0');
    const prTitle = tplEsc(pr.title || pr.name || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Engineered scalable solutions with modern software architectures and high data fidelity.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);

    return `
      <article class="mz-pj mz-reveal">
        <div class="mz-no">${num}</div>
        <div>
          <h3>${prTitle}</h3>
          ${techs.length ? `<div class="mz-kick">${techs.map(t => tplEsc(t)).join(', ')}</div>` : ''}
          <p>${prDesc}</p>
        </div>
        <div class="mz-links">
          ${prGh ? `<a href="${prGh}" target="_blank" rel="noopener">Code Repo ↗</a>` : ''}
          ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">Live View ↗</a>` : (prUrl !== '#' && !prGh ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener">Explore ↗</a>` : '')}
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const dateStr = tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent');
    const role = tplEsc(e.role || e.title || 'Engineer');
    const company = tplEsc(e.company || e.organization || '');
    const bullets = (e.bullets || e.achievements || []);
    return `
      <div class="mz-exp mz-reveal">
        <div class="mz-d">${dateStr}</div>
        <div>
          <h3>${role} ${company ? `· ${company}` : ''}</h3>
          ${e.location ? `<div style="color:var(--mz-mut);font-size:13px;margin-bottom:6px">${tplEsc(e.location)}</div>` : ''}
          ${e.desc ? `<p style="color:var(--mz-mut);font-size:15px;margin:0 0 6px">${tplEsc(e.desc)}</p>` : ''}
          ${bullets.length ? `
            <ul>
              ${bullets.map(b => `<li>${tplEsc(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="mz-exp mz-reveal">
      <div class="mz-d">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || 'Credential')}</div>
      <div>
        <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
        <p style="font-weight:600;color:var(--mz-ink)">${tplEsc(ed.degree || ed.area || 'Degree')} ${ed.score ? `· ${tplEsc(ed.score)}` : ''}</p>
      </div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
    <nav class="mz-nav">
      <a href="#top" class="mz-brand">${name}</a>
      <div class="mz-lk">
        ${projects.length ? '<a href="#projects">Work</a>' : ''}
        ${skills.length ? '<a href="#skills">Skills</a>' : ''}
        ${rawExp.length ? '<a href="#exp">Career</a>' : ''}
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <main class="mz-wrap" id="top">
      <div class="mz-mast">
        <span>The Portfolio</span>
        <span>${location}</span>
        <span>Vol. 01</span>
      </div>

      <section class="mz-hero">
        <div class="mz-kicker">${title}</div>
        <h1>${name}</h1>
        <div class="mz-lead">
          <div>
            <div class="mz-dek">${bio}</div>
            <div class="mz-cta">
              ${email ? `<a class="mz-btn p" href="mailto:${email}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> Get in touch</a>` : ''}
              ${projects.length ? '<a class="mz-btn s" href="#projects">View Selected Work</a>' : ''}
            </div>
          </div>
          <div class="mz-role">${title}</div>
        </div>
      </section>

      <section class="mz-section mz-about mz-reveal" id="about">
        <div class="mz-lbl"><small>Feature</small>About</div>
        <div class="mz-cols">
          <p>${bio}</p>
        </div>
      </section>

      ${projects.length ? `
        <section class="mz-section mz-reveal" id="projects">
          <div class="mz-lbl"><small>Portfolio</small>Selected Work</div>
          <div class="mz-projects-grid">${projectsHtml}</div>
        </section>
      ` : ''}

      ${skills.length ? `
        <section class="mz-section mz-reveal" id="skills">
          <div class="mz-lbl"><small>Toolkit</small>Skills</div>
          <div class="mz-skl">
            ${skills.map(s => `<span>${tplEsc(s)}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      ${rawExp.length ? `
        <section class="mz-section mz-reveal" id="exp">
          <div class="mz-lbl"><small>Timeline</small>Career</div>
          <div>${expHtml}</div>
        </section>
      ` : ''}

      ${education.length ? `
        <section class="mz-section mz-reveal">
          <div class="mz-lbl"><small>Record</small>Credentials</div>
          <div>${eduHtml}</div>
        </section>
      ` : ''}

      <footer class="mz-foot mz-reveal" id="contact">
        <div class="mz-lbl"><small>Letters</small>Get in touch</div>
        ${email ? `<a href="mailto:${email}" class="mz-foot-email">${email}</a>` : ''}
        <div class="mz-socials">
          ${p.github ? `<a class="mz-soc" href="${tplEsc(p.github)}" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
          ${p.linkedin ? `<a class="mz-soc" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>` : ''}
          ${p.website ? `<a class="mz-soc" href="${tplEsc(p.website)}" target="_blank" rel="noopener" aria-label="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a>` : ''}
        </div>
        <div style="margin-top:34px;font-size:12px;color:var(--mz-mut);text-transform:uppercase;letter-spacing:.12em">
          // Published by ${name} via Portfoolio
        </div>
      </footer>
    </main>
  `;

  initMagazineRuntime(p);
}


function renderEditor(p) {
  normTpl(p);
  document.body.dataset.template = 'editor';
  const name = tplEsc(p.name || 'Developer');
  const nameParts = (p.name || 'Developer').trim().split(' ');
  const firstName = tplEsc(nameParts[0] || 'Developer');
  const lastName = tplEsc(nameParts.slice(1).join(' ') || '');
  const title = tplEsc(p.title || 'Software Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || 'Crafting intelligent solutions through modern software engineering and exceptional user experiences.');
  const location = tplEsc(p.location || 'Worldwide');
  const email = tplEsc(p.email || '');
  const phone = tplEsc(p.phone || '');
  const slug = tplEsc((p.slug || firstName).toLowerCase().replace(/[^a-z0-9]/g, '-'));

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const ghUser = p.github_username || (p.github ? p.github.replace(/^https?:\/\/github\.com\//, '').replace(/\/.*$/, '') : '');

  const projectsHtml = projects.map((pr, i) => {
    const num = String(i + 1).padStart(2, '0');
    const prTitle = tplEsc(pr.title || pr.name || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack software engineering project.');
    const prUrl = pr.url || pr.demoUrl || pr.github || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const prGh = pr.github ? tplEsc(pr.github) : (prUrl.includes('github.com') ? tplEsc(prUrl) : '');
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const fileName = prTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.tsx';

    return `
      <article class="ed-pcard">
        <div class="ed-pcard-bar">
          <span class="dots"><i></i><i></i><i></i></span>
          <span class="fn">${tplEsc(fileName)}</span>
          <span class="idx">${num}</span>
        </div>
        <div class="ed-pcard-body">
          ${techs.length ? `<div class="ed-cat">${tplEsc(techs[0].toUpperCase())}</div>` : ''}
          <h3>${prTitle}</h3>
          <p>${prDesc}</p>
          ${techs.length ? `<div class="ed-chips" style="margin-bottom:12px">${techs.map(t => `<span class="ed-chip" style="font-size:11px;padding:3px 8px">${tplEsc(t)}</span>`).join('')}</div>` : ''}
          <div class="ed-pcard-links">
            ${prGh ? `<a class="ed-plink" href="${prGh}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
            ${prDemo ? `<a class="ed-plink primary" href="${prDemo}" target="_blank" rel="noopener">Live Demo ↗</a>` : (prUrl !== '#' && !prGh ? `<a class="ed-plink primary" href="${tplEsc(prUrl)}" target="_blank" rel="noopener">View Project ↗</a>` : '')}
          </div>
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => {
    const dateStr = tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent');
    const role = tplEsc(e.role || e.title || 'Engineer');
    const company = tplEsc(e.company || e.organization || '');
    const bullets = (e.bullets || e.achievements || []);
    return `
      <div class="ed-tl-item">
        <div class="ed-tl-date">${dateStr}</div>
        <div>
          <h3>${role} ${company ? `<span class="at">· ${company}</span>` : ''}</h3>
          ${e.location ? `<div style="color:var(--ed-faint);font-size:12px;margin:2px 0 6px;">${tplEsc(e.location)}</div>` : ''}
          ${e.desc ? `<p style="color:var(--ed-dim);font-size:13px;line-height:1.6;margin:0 0 6px;">${tplEsc(e.desc)}</p>` : ''}
          ${bullets.length ? `
            <ul style="margin:6px 0 0;padding-left:18px;color:var(--ed-dim);font-size:12.5px;line-height:1.6;">
              ${bullets.map(b => `<li style="margin-bottom:4px">${tplEsc(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const eduHtml = education.map(ed => `
    <div class="ed-edu">
      <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
      <div class="deg">${tplEsc(ed.degree || ed.area || 'Degree')}</div>
      <div class="meta">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')} ${ed.score ? `· ${tplEsc(ed.score)}` : ''}</div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
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
                    ${skills.map(s => `<span class="ed-chip">${tplEsc(s)}</span>`).join('')}
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
                  <div class="ed-subcomment">git log --author="${tplEsc(ghUser)}"</div>
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
                  ${p.github ? `<a class="ed-soc" href="${tplEsc(p.github)}" target="_blank" rel="noopener" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
                  ${p.linkedin ? `<a class="ed-soc" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg></a>` : ''}
                  ${p.website ? `<a class="ed-soc" href="${tplEsc(p.website)}" target="_blank" rel="noopener" title="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg></a>` : ''}
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
  `;

  initEditorRuntime(p);
}


function renderMonolith(p) {
  normTpl(p);
  document.body.dataset.template = 'monolith';
  const name = tplEsc(p.name || 'Developer');
  const nameParts = (p.name || 'Developer').trim().split(' ');
  const firstName = tplEsc(nameParts[0] || 'DEV');
  const lastName = tplEsc(nameParts.slice(1).join(' ') || 'ENGINEER');
  const title = tplEsc(p.title || 'Full Stack Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || `Transforming ideas into scalable high-impact digital solutions with modern software architecture.`);
  const location = tplEsc(p.location || 'Worldwide');
  const email = tplEsc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const topSkills = skills.slice(0, 4);

  const skillsHtml = skills.map(s => `
    <span class="mo-skill">✦ ${tplEsc(s)}</span>
  `).join('');

  const projectsHtml = projects.map((pr, i) => {
    const num = String(i + 1).padStart(2, '0');
    const prTitle = tplEsc(pr.title || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack engineering project built with scalable architecture and high performance.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);

    return `
      <article class="mo-project">
        <div class="mo-project-num">${num}</div>
        <div>
          <h3>${prTitle}</h3>
          ${techs.length ? `<div class="mo-kicker">${techs.map(t => tplEsc(t)).join(', ')}</div>` : ''}
          <p>${prDesc}</p>
        </div>
        <div class="mo-project-links">
          ${prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
          ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">Live ↗</a>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const expHtml = rawExp.map(e => `
    <article class="mo-exp">
      <div class="mo-exp-date">${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</div>
      <div>
        <h3>${tplEsc(e.role || e.title || 'Engineer')} / ${tplEsc(e.company || e.organization || '')}</h3>
        ${e.location ? `<div class="mo-kicker">${tplEsc(e.location)}</div>` : ''}
        ${e.desc ? `<p style="margin:10px 0 0;color:#4b5563;font-weight:600">${tplEsc(e.desc)}</p>` : ''}
        ${(e.bullets || e.achievements || []).length ? `
          <ul>${(e.bullets || e.achievements).map(b => `<li>${tplEsc(b)}</li>`).join('')}</ul>
        ` : ''}
      </div>
    </article>
  `).join('');

  const eduHtml = education.map(ed => `
    <article class="mo-card">
      <div class="mo-card-type">Education</div>
      <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
      <p style="font-weight:700;color:var(--mo-ink)">${tplEsc(ed.degree || ed.area || 'Degree')}</p>
      <p>${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')}</p>
    </article>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
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
        ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
        ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
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
          ${photo ? `<img src="${tplEsc(photo)}" alt="${name}">` : `<span>${firstName.charAt(0)}</span>`}
        </div>
      </section>

      ${topSkills.length ? `
        <section class="mo-strip">
          ${topSkills.map(s => `<span>${tplEsc(s)}</span>`).join('')}
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
          ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">🐙 GitHub</a>` : ''}
          ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn</a>` : ''}
          ${p.website ? `<a href="${tplEsc(p.website)}" target="_blank" rel="noopener">🌐 Website</a>` : ''}
        </div>
      </section>
    </main>

    <footer class="mo-footer">
      © ${name} · ${tplFoot(p)}
    </footer>
  `;
}


function renderPanels(p) {
  normTpl(p);
  document.body.dataset.template = 'panels';
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Full Stack Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const tagline = tplEsc(p.tagline || `Crafting clean, accessible, and high-performance digital experiences.`);
  const bio = tplEsc(p.bio || p.summary || p.tagline || `I'm ${name}, a detail-oriented software developer building scalable digital products and robust modern web architectures.`);
  const location = tplEsc(p.location || 'Remote / Worldwide');
  const email = tplEsc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  const skillPillsHtml = skills.map(s => `
    <span class="pn-pill">✦ ${tplEsc(s)}</span>
  `).join('');

  const expHtml = rawExp.map(e => `
    <div class="pn-exp">
      <div class="pn-exp-top">
        <div class="pn-exp-org">
          <div class="pn-exp-logo">${tplEsc((e.company || e.organization || 'E').slice(0, 2).toUpperCase())}</div>
          <div>
            <h3>${tplEsc(e.company || e.organization || '')}</h3>
            <div class="pn-exp-role">${tplEsc(e.role || e.title || 'Engineer')}</div>
          </div>
        </div>
        <div class="pn-exp-date">${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')}</div>
      </div>
      ${e.desc ? `<p style="margin:14px 0 0;color:var(--pn-dim)">${tplEsc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <ul class="pn-plus">${(e.bullets || e.achievements).map(b => `<li>${tplEsc(b)}</li>`).join('')}</ul>
      ` : ''}
    </div>
  `).join('');

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack application built with modern architecture and best practices.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const img = pr.image || pr.img || '';

    return `
      <div class="pn-proj">
        ${img ? `<div class="pn-proj-bg"><img src="${tplEsc(img)}" alt="${prTitle}"></div>` : ''}
        <div class="pn-proj-links">
          ${prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener" title="Source Code"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg></a>` : ''}
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
          <h3>${tplEsc(ed.institution || ed.school || 'University')}</h3>
          <div class="deg">${tplEsc(ed.degree || ed.area || 'Degree')}</div>
        </div>
        <div class="meta">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')}</div>
      </div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
    <header class="pn-hero">
      <div class="pn-wrap">
        <div class="pn-hero-top">
          <div class="pn-brand">${name}</div>
          <button type="button" class="pn-hero-badge" id="pnThemeBtn" aria-label="Toggle theme" title="Toggle dark mode">
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
          <button class="pn-tab" data-tab="contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Let's Talk</button>
        </div>

        <div class="pn-content">
          <section class="pn-panel on" data-tab="who">
            <div class="pn-whohead">
              ${photo ? `<img class="pn-photo" src="${tplEsc(photo)}" alt="${name}">` : `<div class="pn-photo ph">${name.charAt(0)}</div>`}
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
              <button type="button" class="pn-btn pn-btn-light" id="pnWhoProjBtn">View Projects</button>
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
              ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
              ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
              ${p.website ? `<a href="${tplEsc(p.website)}" target="_blank" rel="noopener">Website</a>` : ''}
              ${email ? `<a href="mailto:${email}">Email</a>` : ''}
            </div>
          </div>
          <div>
            ${tplFoot(p)}
          </div>
        </div>
        <div class="pn-copy">© ${name} · Built with Portfoolio</div>
      </div>
    </footer>
  `;

  initPanelsRuntime();
}

function initPanelsRuntime() {
  const tabsContainer = document.getElementById('pnTabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.pn-tab');
      if (!btn) return;
      const tabId = btn.getAttribute('data-tab');
      document.querySelectorAll('.pn-tab').forEach(t => t.classList.toggle('on', t.getAttribute('data-tab') === tabId));
      document.querySelectorAll('.pn-panel').forEach(p => p.classList.toggle('on', p.getAttribute('data-tab') === tabId));
    });
  }

  const themeBtn = document.getElementById('pnThemeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('pn-dark');
      if (document.documentElement) document.documentElement.classList.toggle('pn-dark');
    });
  }

  const whoProjBtn = document.getElementById('pnWhoProjBtn');
  if (whoProjBtn) {
    whoProjBtn.addEventListener('click', () => {
      const projTab = document.querySelector('.pn-tab[data-tab="proj"]');
      if (projTab) projTab.click();
    });
  }
}


function renderParticle(p) {
  normTpl(p);
  document.body.dataset.template = 'particle';
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Full Stack & AI Engineer');
  document.title = `${name} — ${title} | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || `Transforming complex requirements into elegant, high-impact digital solutions through modern software architecture.`);
  const email = tplEsc(p.email || '');
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
      <h3>${tplEsc(s)}</h3>
    </article>
  `).join('');

  const expHtml = rawExp.map(e => `
    <article class="pt-exp-card">
      <h3>${tplEsc(e.company || e.organization || 'Company')}</h3>
      <h4>${tplEsc(e.role || e.title || 'Engineer')}</h4>
      ${e.desc ? `<p style="color:var(--pt-muted);margin:0 0 12px">${tplEsc(e.desc)}</p>` : ''}
      ${(e.bullets || e.achievements || []).length ? `
        <ul>${(e.bullets || e.achievements).map(b => `<li>${tplEsc(b)}</li>`).join('')}</ul>
      ` : ''}
      <div class="pt-date">${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')} ${e.location ? `· ${tplEsc(e.location)}` : ''}</div>
    </article>
  `).join('');

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || `Project ${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Full stack engineering project built with scalable architecture and modern standards.');
    const prUrl = pr.url || pr.demoUrl || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const img = pr.image || pr.img || '';

    return `
      <article class="pt-project">
        <div class="pt-project-shot">
          ${img ? `<img src="${tplEsc(img)}" alt="${prTitle}" loading="lazy">` : `<span>${prTitle.slice(0, 2).toUpperCase()}</span>`}
        </div>
        <div class="pt-project-info">
          <h3>
            ${prTitle}
            ${prUrl !== '#' ? `<a href="${tplEsc(prUrl)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
            ${prDemo ? `<a href="${prDemo}" target="_blank" rel="noopener">Live Demo ↗</a>` : ''}
          </h3>
          ${techs.length ? `<p class="stack">${techs.map(t => tplEsc(t)).join(', ')}</p>` : ''}
          <p style="color:var(--pt-muted);margin:0 0 12px;line-height:1.6">${prDesc}</p>
        </div>
      </article>
    `;
  }).join('');

  (document.getElementById('app') || document.body).innerHTML = `
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
          ${photo ? `<img src="${tplEsc(photo)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
        </div>
      </section>

      ${skills.length ? `
        <section class="pt-section" id="skills">
          <h2>Technical Skills</h2>
          <div class="pt-skill-grid">${skillsHtml}</div>
          ${extraSkills.length ? `
            <div class="pt-extra">
              <div class="pt-extra-head"><h3>Additional Specialties</h3><span></span></div>
              <ul>${extraSkills.map(s => `<li>${tplEsc(s)}</li>`).join('')}</ul>
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
          ${p.github ? `<a href="${tplEsc(p.github)}" target="_blank" rel="noopener">🐙 GitHub</a>` : ''}
          ${p.linkedin ? `<a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn</a>` : ''}
          ${p.website ? `<a href="${tplEsc(p.website)}" target="_blank" rel="noopener">🌐 Website</a>` : ''}
          ${p.twitter ? `<a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener">🐦 Twitter</a>` : ''}
        </div>
      </section>
    </main>

    <footer class="pt-footer">
      © ${name} · ${tplFoot(p)}
    </footer>
  `;

  initParticleRuntime();
}

function initParticleRuntime() {
  const canvas = document.getElementById('pt-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;
  let w = 0, h = 0, pts = [];
  const reduce = (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  function size() {
    w = canvas.width = (typeof window !== 'undefined' && window.innerWidth) || 1200;
    h = canvas.height = (typeof window !== 'undefined' && window.innerHeight) || 800;
    pts = [];
    const n = Math.min(80, Math.max(25, Math.round(w * h / 19000)));
    for (let i = 0; i < n; i++) {
      pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      if (!reduce) { pt.x += pt.vx; pt.y += pt.vy; }
      if (pt.x < 0 || pt.x > w) pt.vx *= -1;
      if (pt.y < 0 || pt.y > h) pt.vy *= -1;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.2, 0, 6.28);
      ctx.fillStyle = 'rgba(107,99,255,.75)';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = pt.x - q.x, dy = pt.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 145) {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(125,145,180,' + (0.18 * (1 - d / 145)) + ')';
          ctx.stroke();
        }
      }
    }
    if (!reduce && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(draw);
    }
  }

  size();
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('resize', size);
  }
  draw();
}


function renderGithub(p) {
  normTpl(p);
  document.body.dataset.template = 'github';
  const name = tplEsc(p.name || 'Developer');
  const title = tplEsc(p.title || 'Software Engineer');
  const firstName = (p.name || '').trim().split(' ')[0] || 'developer';
  const username = tplEsc(p.username || firstName.toLowerCase().replace(/[^a-z0-9]/g, ''));
  document.title = `${name} (@${username}) — GitHub Profile | portfoolio.me`;
  const bio = tplEsc(p.bio || p.summary || p.tagline || `Building user-centric, high-performance applications and scalable distributed systems.`);
  const location = tplEsc(p.location || '');
  const email = tplEsc(p.email || '');
  const photo = p.photo || p.avatar || '';

  const rawExp = (Array.isArray(p.experience) && p.experience.length) ? p.experience : (p.resume && Array.isArray(p.resume.experience) ? p.resume.experience : []);
  const projects = Array.isArray(p.projects) ? p.projects : [];
  const skills = (p.skills || []).map(s => typeof s === 'string' ? s : s.name);
  const education = (Array.isArray(p.education) && p.education.length) ? p.education : (p.resume && Array.isArray(p.resume.education) ? p.resume.education : []);

  // Pre-generate authentic 53x7 contribution cells with deterministic distribution
  let contribCells = '';
  let totalContribs = 0;
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      // Deterministic pseudo-random sequence based on username & coords
      const seed = ((w * 13 + d * 37 + username.length * 17) % 100) / 100;
      let lvl = 0;
      if (seed > 0.85) { lvl = 4; totalContribs += 7; }
      else if (seed > 0.70) { lvl = 3; totalContribs += 5; }
      else if (seed > 0.50) { lvl = 2; totalContribs += 3; }
      else if (seed > 0.30) { lvl = 1; totalContribs += 1; }
      contribCells += `<i class="gh-cell l${lvl}"></i>`;
    }
  }
  if (totalContribs < 120) totalContribs = 945;

  const langColors = ['#f1e05a', '#3572A5', '#e34c26', '#2b7489', '#41b883', '#00ADD8', '#b07219', '#178600'];

  const projectsHtml = projects.map((pr, i) => {
    const prTitle = tplEsc(pr.title || `Repository-${i+1}`);
    const prDesc = tplEsc(pr.desc || pr.description || 'Public software project developed with modern web standards and high test coverage.');
    const prUrl = pr.url || pr.demoUrl || p.github || '#';
    const prDemo = pr.demoUrl ? tplEsc(pr.demoUrl) : '';
    const techs = Array.isArray(pr.technologies) ? pr.technologies : (Array.isArray(pr.tags) ? pr.tags : []);
    const mainLang = techs[0] || 'Code';
    const dotColor = langColors[i % langColors.length];

    return `
      <article class="gh-pin">
        <div class="gh-pin-top">
          <span class="gh-repo-ic">
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75H4.5a1 1 0 0 0 0 2h8.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 15V2.5zm10.5-1H4.5a1 1 0 0 0-1 1v9.05c.3-.1.65-.1 1-.1h8V1.5z"/></svg>
          </span>
          <a class="gh-repo-name" href="${tplEsc(prUrl)}" ${prUrl !== '#' ? 'target="_blank" rel="noopener"' : ''}>${prTitle}</a>
          <span class="gh-pub sm">Public</span>
        </div>
        <p class="gh-pin-desc">${prDesc}</p>
        <div class="gh-pin-foot">
          <span class="gh-lang"><span class="gh-dot" style="--d:${dotColor}"></span>${tplEsc(mainLang)}</span>
          ${prUrl !== '#' ? `<a class="gh-pin-link" href="${tplEsc(prUrl)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> Code</a>` : ''}
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
        <h4>${tplEsc(e.role || e.title || 'Engineer')} <span class="gh-at">@ ${tplEsc(e.company || e.organization || '')}</span></h4>
        <div class="gh-tl-meta">${tplEsc([e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ') || e.year || e.dates || 'Recent')} ${e.location ? `· ${tplEsc(e.location)}` : ''}</div>
        ${e.desc ? `<p style="margin:0 0 8px;color:#8b949e">${tplEsc(e.desc)}</p>` : ''}
        ${(e.bullets || e.achievements || []).length ? `
          <ul>${(e.bullets || e.achievements).map(b => `<li>${tplEsc(b)}</li>`).join('')}</ul>
        ` : ''}
      </div>
    </div>
  `).join('');

  const eduHtml = education.map(ed => `
    <div class="gh-card">
      <h4><svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 3H1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6z"/></svg> ${tplEsc(ed.institution || ed.school || 'University')}</h4>
      <div class="gh-card-sub">${tplEsc(ed.degree || ed.area || 'Degree')}</div>
      <div class="gh-card-meta">${tplEsc(ed.dates || [ed.start, ed.end].filter(Boolean).join(' – ') || ed.year || '')}</div>
    </div>
  `).join('');

  (document.getElementById('app') || document.body).innerHTML = `
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
          ${photo ? `<img src="${tplEsc(photo)}" alt="${name}">` : `<span>${name.charAt(0)}</span>`}
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
          ${p.linkedin ? `<li><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg> <a href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>` : ''}
          ${p.github ? `<li><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> <a href="${tplEsc(p.github)}" target="_blank" rel="noopener">GitHub</a></li>` : ''}
          ${p.website ? `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg> <a href="${tplEsc(p.website)}" target="_blank" rel="noopener">Website</a></li>` : ''}
          ${p.twitter ? `<li><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.84l-4.78-6.26L5.92 22H2.66l8.02-9.17L2 2h6.91l4.32 5.71L18.244 2z"/></svg> <a href="${tplEsc(p.twitter)}" target="_blank" rel="noopener">Twitter</a></li>` : ''}
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
              <span class="gh-lang-chip"><span class="gh-dot" style="--d:${langColors[idx % langColors.length]}"></span>${tplEsc(s)}</span>
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
            ${p.linkedin ? `<a class="gh-btn" href="${tplEsc(p.linkedin)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4z"/></svg> LinkedIn</a>` : ''}
            ${p.github ? `<a class="gh-btn" href="${tplEsc(p.github)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg> GitHub</a>` : ''}
            ${p.website ? `<a class="gh-btn" href="${tplEsc(p.website)}" target="_blank" rel="noopener">Website</a>` : ''}
          </div>
        </section>
      </main>
    </div>

    <footer class="gh-footer">
      © ${name} · Built with Portfoolio
    </footer>
  `;

  initGithubRuntime(p);
}



function initGithubRuntime(p) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof fetch !== 'function') return;
  const graphEl = document.getElementById('gh-graph');
  const countEl = document.getElementById('gh-contrib-count');
  if (!graphEl) return;

  let user = '';
  const gh = p && p.github ? p.github : '';
  if (gh) {
    const m = gh.match(/(?:github\.com\/|^)([a-zA-Z0-9_\-]+)\/?$/);
    if (m && m[1] && m[1].toLowerCase() !== 'github') user = m[1];
  }
  if (!user && p && p.username) user = p.username;
  if (!user) user = 'neeraj-k-r';

  fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (!data || !Array.isArray(data.contributions) || !data.contributions.length) return;
      const total = (data.total && (data.total.lastYear || data.total[new Date().getFullYear()]))
        || data.contributions.reduce((acc, c) => acc + (c.count || 0), 0);
      if (countEl) countEl.textContent = total.toLocaleString();
      const cells = data.contributions.map(c =>
        `<i class="gh-cell l${c.level || 0}" data-date="${c.date}" data-count="${c.count}" title="${c.count} contribution${c.count === 1 ? '' : 's'} on ${c.date}"></i>`
      ).join('');
      graphEl.innerHTML = cells;
    })
    .catch(() => {});
}


// ============================================================================
// VISUAL TRACK RENDERERS (Atelier, Cinema, Arch, Zine, Zen)
// ============================================================================

function getVisualWorks(p) {
  if (Array.isArray(p.works) && p.works.length > 0) {
    return p.works.filter(w => w && w.imageUrl);
  }
  // If no visual works (e.g. testing with sampleProfile), convert projects to visual items with aesthetic defaults
  const sampleImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop'
  ];
  if (Array.isArray(p.projects) && p.projects.length > 0) {
    return p.projects.map((pr, i) => ({
      title: pr.title || pr.name || 'Untitled Piece',
      category: (pr.technologies || pr.tags || ['Design'])[0],
      desc: pr.desc || 'Exploration of form, structure and visual narrative.',
      imageUrl: sampleImages[i % sampleImages.length],
      year: 2026
    }));
  }
  return [
    { title: 'Harmonic Form I', category: 'Editorial', desc: 'Sculptural study in light and silhouette.', imageUrl: sampleImages[0], year: 2026 },
    { title: 'Tectonic Monolith', category: 'Architecture', desc: 'Cantilever concrete structure.', imageUrl: sampleImages[3], year: 2026 }
  ];
}

function renderAtelier(p) {
  normTpl(p);
  document.body.dataset.template = 'atelier';
  document.title = `${p.name} — Atelier Portfolio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="atelier-portrait" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="atelier-portrait atelier-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`;
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  app.innerHTML = `
  <div class="atelier-page">
    <nav class="atelier-nav wrap">
      <a class="atelier-logo" href="/"><span class="atelier-mark">◆</span> ${tplEsc(p.name)}</a>
      <div class="atelier-nav-links">
        <a href="#collection">Collection</a>
        ${p.email ? `<a class="btn-atelier-inquire" href="mailto:${tplEsc(p.email)}">Inquire</a>` : ''}
      </div>
    </nav>
    <header class="wrap gal-atelier-head">
      <p class="atelier-kicker">— ATELIER &amp; ARCHIVE —</p>
      <h1 class="atelier-title">${tplEsc(p.name)}</h1>
      <p class="atelier-sub">${tplEsc(p.title || 'Haute Couture &amp; Visual Direction')}</p>
      <div class="atelier-portrait-wrap">${face}</div>
      <p class="atelier-meta">${tplEsc(p.location || 'Paris &amp; San Francisco')} · ${works.length} WORKS ON DISPLAY</p>
    </header>
    <section class="wrap atelier-collection" id="collection">
      ${works.map((w, i) => `
        <figure class="atelier-card ${i % 3 === 0 ? 'atelier-wide' : ''}" data-gal="${i}">
          <div class="atelier-frame">
            <span class="atelier-numeral">${numerals[i % numerals.length]}</span>
            <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
          </div>
          <figcaption class="atelier-meta">
            <span class="atelier-cat">${tplEsc(w.category || 'COLLECTION')}</span>
            <b>${tplEsc(w.title || 'Untitled')}</b>
            ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
          </figcaption>
        </figure>
      `).join('')}
    </section>
    <footer class="atelier-foot wrap">
      <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
      <span>Atelier Portfolio · Built with Portfoolio</span>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderCinema(p) {
  normTpl(p);
  document.body.dataset.template = 'cinema';
  document.title = `${p.name} — Cinema Portfolio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="cinema-avatar" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : '';

  app.innerHTML = `
  <div class="cinema-page">
    <nav class="cinema-nav wrap">
      <div class="cinema-rec-chip"><span class="cinema-rec-dot"></span> REC 24.00 FPS</div>
      <a class="cinema-logo" href="/">${tplEsc(p.name)}</a>
      <div class="cinema-tc">TC 01:24:08:12</div>
    </nav>
    <header class="wrap gal-cinema-head">
      <div class="cinema-slate-tag">[ ROLL 04 · 8K WIDESCREEN ARCHIVE ]</div>
      <h1 class="cinema-title">${tplEsc(p.name)}</h1>
      <p class="cinema-sub">${tplEsc(p.title || 'Cinematographer &amp; Director')}</p>
      ${face}
      <p class="cinema-meta">${tplEsc(p.location || 'Los Angeles, CA')} · ${works.length} STILLS · 2.39:1 LETTERBOX</p>
    </header>
    <section class="wrap cinema-slate-grid">
      ${works.map((w, i) => `
        <article class="cinema-card" data-gal="${i}">
          <div class="cinema-frame">
            <div class="letterbox-bar bar-top"></div>
            <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
            <div class="letterbox-bar bar-bottom"></div>
            <div class="cinema-hud-overlay">
              <span class="hud-tag hud-tl">SCENE ${String(i + 1).padStart(2, '0')}</span>
              <span class="hud-tag hud-tr">${tplEsc(w.category || 'NARRATIVE')}</span>
              <span class="hud-tag hud-bl">50MM ANAMORPHIC</span>
              <span class="hud-tag hud-br">PRORES 4444</span>
            </div>
          </div>
          <div class="cinema-card-info">
            <b>${tplEsc(w.title || 'Untitled Still')}</b>
            ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
          </div>
        </article>
      `).join('')}
    </section>
    <footer class="cinema-foot wrap">
      <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
      <span>Cinema Portfolio · Built with Portfoolio</span>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderArch(p) {
  normTpl(p);
  document.body.dataset.template = 'arch';
  document.title = `${p.name} — Architectural Portfolio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);

  app.innerHTML = `
  <div class="arch-page">
    <nav class="arch-nav wrap">
      <span class="arch-ref">DWG.REF // 2026</span>
      <a class="arch-logo" href="/">${tplEsc(p.name)}</a>
      <span class="arch-scale">SCALE 1:50</span>
    </nav>
    <header class="wrap gal-arch-head">
      <div class="arch-ch ch-tl">+</div>
      <div class="arch-ch ch-tr">+</div>
      <div class="arch-ch ch-bl">+</div>
      <div class="arch-ch ch-br">+</div>
      <p class="arch-kicker">PROJECT REGISTRY &amp; SPATIAL INDEX</p>
      <h1 class="arch-title">${tplEsc(p.name)}</h1>
      <p class="arch-sub">${tplEsc(p.title || 'Architectural Design &amp; Spatial Research')}</p>
      <div class="arch-specs">
        <span>LOC: ${tplEsc(p.location || 'Tokyo &amp; New York')}</span>
        <span>STATUS: APPROVED</span>
        <span>PLATES: ${works.length}</span>
      </div>
    </header>
    <section class="wrap arch-draft-grid">
      ${works.map((w, i) => `
        <article class="arch-plate" data-gal="${i}">
          <div class="arch-plate-head">
            <span class="plate-no">SHEET A-${String(i + 1).padStart(2, '0')}</span>
            <span class="plate-cat">${tplEsc(w.category || 'ARCHITECTURE')}</span>
          </div>
          <div class="arch-img-wrap">
            <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
            <span class="arch-dim-badge">DIM: 1920 × 1080 MM</span>
          </div>
          <div class="arch-caption">
            <b>${tplEsc(w.title || 'Untitled Project')}</b>
            ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
          </div>
        </article>
      `).join('')}
    </section>
    <footer class="arch-foot wrap">
      <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
      <span>Arch Blueprint · Built with Portfoolio</span>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderZine(p) {
  normTpl(p);
  document.body.dataset.template = 'zine';
  document.title = `${p.name} — Risograph Zine | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();

  app.innerHTML = `
  <div class="zine-page">
    <nav class="zine-nav wrap">
      <span class="zine-badge">★ INDIE ZINE</span>
      <a class="zine-logo" href="/">${tplEsc(p.name)}</a>
      <span class="zine-issue">ISSUE 04</span>
    </nav>
    <header class="wrap gal-zine-head">
      <div class="zine-stickers">
        <span class="zine-pill">100% RISOGRAPH</span>
        <span class="zine-stamp-chip">✦ ARTIST EDITION</span>
      </div>
      <h1 class="zine-title">${tplEsc(p.name)}</h1>
      <p class="zine-sub">${tplEsc(p.title || 'Illustrator &amp; Risograph Printmaker')}</p>
      ${avatar ? `<div class="zine-polaroid"><img src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}"></div>` : ''}
      <p class="zine-meta">${tplEsc(p.location || 'London &amp; Berlin')} · ${works.length} PRINTS · INK DUO-TONE</p>
    </header>
    <section class="wrap zine-board">
      ${works.map((w, i) => `
        <figure class="zine-tile" data-gal="${i}">
          <div class="zine-tape-strip"></div>
          <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
          <figcaption class="zine-cap">
            <span class="zine-stamp">[ ${tplEsc(w.category || 'ORIGINAL PRINT')} ]</span>
            <b>${tplEsc(w.title || 'Untitled Print')}</b>
            ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
          </figcaption>
        </figure>
      `).join('')}
    </section>
    <footer class="zine-foot wrap">
      <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
      <span>Risograph Zine · Built with Portfoolio</span>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderZen(p) {
  normTpl(p);
  document.body.dataset.template = 'zen';
  document.title = `${p.name} — Zen Wabi-Sabi | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const kanjiNumerals = ['壱', '弐', '参', '四', '五', '六', '七', '八', '九', '十'];

  app.innerHTML = `
  <div class="zen-page">
    <nav class="zen-nav wrap">
      <span class="zen-kanji">無為自然</span>
      <a class="zen-logo" href="/">${tplEsc(p.name)}</a>
      <span class="zen-season">EARTH &amp; STONE</span>
    </nav>
    <header class="wrap gal-zen-head">
      <div class="zen-enso-wrap">
        <div class="zen-enso-ring"></div>
        ${avatar ? `<img class="zen-portrait" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="zen-portrait zen-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`}
      </div>
      <h1 class="zen-title">${tplEsc(p.name)}</h1>
      <p class="zen-sub">${tplEsc(p.title || 'Ceramic Artist &amp; Sculptural Studio')}</p>
      <p class="zen-meta">${tplEsc(p.location || 'Kyoto, Japan')} · ${works.length} ARTIFACTS · WOODFIRED ANAGAMA</p>
    </header>
    <section class="wrap zen-stones">
      ${works.map((w, i) => `
        <article class="zen-card ${i % 2 === 1 ? 'zen-stagger' : ''}" data-gal="${i}">
          <div class="zen-stone-frame">
            <span class="zen-num">${kanjiNumerals[i % kanjiNumerals.length]}</span>
            <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
          </div>
          <div class="zen-stone-meta">
            <b>${tplEsc(w.title || 'Untitled Form')}</b>
            <span class="zen-glaze">${tplEsc(w.category || 'CERAMICS')}</span>
            ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
          </div>
        </article>
      `).join('')}
    </section>
    <footer class="zen-foot wrap">
      <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
      <span>Zen Wabi-Sabi · Built with Portfoolio</span>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderDesire(p) {
  normTpl(p);
  document.body.dataset.template = 'desire';
  document.title = `${p.name} — Desire Creative Studio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="desire-avatar" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="desire-avatar desire-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`;
  const headline = p.title || 'Creative Specialist';
  const location = p.location || '';
  const bio = (p.bio || p.summary || p.about || p.tagline || '').trim();
  const kicker = (p.title || 'Visual Portfolio').toUpperCase();

  app.innerHTML = `
  <div class="desire-page">
    <div class="desire-mesh-bg"></div>
    <nav class="desire-nav wrap">
      <div class="desire-brand">
        ${face}
        <div class="desire-brand-meta">
          <span class="desire-name">${tplEsc(p.name)}</span>
          <span class="desire-badge-online"><span class="desire-dot"></span> Available for projects</span>
        </div>
      </div>
      <div class="desire-nav-pills">
        <a href="#works">Selected Works</a>
        <a href="#about">About</a>
      </div>
      <div class="desire-nav-actions">
        ${p.email ? `<a class="desire-btn-contact" href="mailto:${tplEsc(p.email)}">Let's Talk ↗</a>` : ''}
      </div>
    </nav>

    <header class="wrap gal-desire-head">
      <div class="desire-kicker-pill"><span class="desire-sparkle">✦</span> ${tplEsc(kicker)}</div>
      <h1 class="desire-title">${tplEsc(p.name)}</h1>
      <div class="desire-hero-loupe">
        <div class="desire-loupe-glass">
          <svg class="desire-loupe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div class="desire-loupe-info">
          <b>${tplEsc(headline)}</b>
          <span>${works.length} Featured Work${works.length === 1 ? '' : 's'}${location ? ` · ${tplEsc(location)}` : ''}</span>
        </div>
      </div>
      ${bio ? `<p class="desire-bio">${tplEsc(bio)}</p>` : ''}
      <div class="desire-hero-actions">
        <a class="desire-btn-primary" href="#works">Explore Works ↘</a>
        ${p.email ? `<a class="desire-btn-ghost" href="mailto:${tplEsc(p.email)}">Get in Touch</a>` : ''}
      </div>
    </header>

    <section class="wrap desire-works-sec" id="works">
      <div class="desire-sec-head">
        <div>
          <span class="desire-sec-kicker">— FEATURED WORKS —</span>
          <h2 class="desire-sec-title">Featured Explorations</h2>
        </div>
        <span class="desire-counter-badge">${works.length} Works Curated</span>
      </div>
      <div class="desire-grid">
        ${works.map((w, i) => {
          const layoutClass = i === 0 ? 'desire-card-hero' : (i % 5 === 1 ? 'desire-card-tall' : (i % 5 === 2 ? 'desire-card-med' : (i % 5 === 3 ? 'desire-card-wide' : 'desire-card-split')));
          return `
          <figure class="desire-card ${layoutClass}" data-gal="${i}">
            <div class="desire-card-frame">
              <span class="desire-cat-pill">${tplEsc(w.category || 'VISUAL DESIGN')}</span>
              <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
              <div class="desire-card-overlay">
                <span class="desire-loupe-preview">🔍 Inspect</span>
              </div>
            </div>
            <figcaption class="desire-card-meta">
              <div class="desire-meta-text">
                <span class="desire-card-year">${w.year || '2026'}</span>
                <b>${tplEsc(w.title || 'Untitled Work')}</b>
                ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
              </div>
              <span class="desire-arrow-pill">↗</span>
            </figcaption>
          </figure>
          `;
        }).join('')}
      </div>
    </section>

    <section class="wrap desire-about-sec" id="about">
      <div class="desire-quote-card">
        <div class="desire-quote-kicker">DESIGN PHILOSOPHY</div>
        <blockquote class="desire-quote">"Design is not simply how things look—it's how effortlessly they connect, communicate, and solve real human needs."</blockquote>
        <div class="desire-quote-author">
          ${face}
          <div>
            <b>${tplEsc(p.name)}</b>
            <span>${tplEsc(headline)} · ${tplEsc(location)}</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="desire-foot wrap">
      <div class="desire-foot-banner">
        <div>
          <span class="desire-foot-kicker">HAVE A VISION IN MIND?</span>
          <h2>Let's build something unforgettable.</h2>
        </div>
        ${p.email ? `<a class="desire-btn-primary" href="mailto:${tplEsc(p.email)}">Get in Touch ↗</a>` : ''}
      </div>
      <div class="desire-foot-bottom">
        <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
        <span>Desire Studio Theme · Built with Portfoolio</span>
      </div>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderLumina(p) {
  normTpl(p);
  document.body.dataset.template = 'lumina';
  document.title = `${p.name} — Lumina Prism Portfolio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="lumina-avatar" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="lumina-avatar lumina-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`;
  const kicker = (p.title || 'Digital Craft & 3D Art').toUpperCase();
  const location = p.location || '';
  const bio = (p.bio || p.summary || p.about || p.tagline || '').trim();

  app.innerHTML = `
  <div class="lumina-page">
    <div class="lumina-caustic-bg"></div>
    <nav class="lumina-nav wrap">
      <div class="lumina-brand">
        ${face}
        <div class="lumina-brand-meta">
          <span class="lumina-name">${tplEsc(p.name)}</span>
          <span class="lumina-badge-refract"><span class="lumina-dot"></span> Prismatic Studio</span>
        </div>
      </div>
      <div class="lumina-nav-pills">
        <a href="#gallery">Gallery</a>
        <a href="#about">About</a>
      </div>
      <div class="lumina-nav-actions">
        ${p.email ? `<a class="lumina-btn-contact" href="mailto:${tplEsc(p.email)}">Inquire ↗</a>` : ''}
      </div>
    </nav>

    <header class="wrap gal-lumina-head">
      <div class="lumina-prism-orb" aria-hidden="true"></div>
      <div class="lumina-pill"><span class="lumina-spark">✧</span> ${tplEsc(kicker)}</div>
      <h1 class="lumina-title">${tplEsc(p.name)}</h1>
      <div class="lumina-stat-glass">
        <div class="lumina-stat-icon">⬡</div>
        <div class="lumina-stat-info">
          <b>${tplEsc(p.title || 'Digital Sculptor & 3D Artist')}</b>
          <span>${works.length} Works on Display${location ? ` · ${tplEsc(location)}` : ''}</span>
        </div>
      </div>
      ${bio ? `<p class="lumina-bio">${tplEsc(bio)}</p>` : ''}
      <div class="lumina-hero-actions">
        <a class="lumina-btn-primary" href="#gallery">Explore Works ↘</a>
        ${p.email ? `<a class="lumina-btn-glass" href="mailto:${tplEsc(p.email)}">Get in Touch</a>` : ''}
      </div>
    </header>

    <section class="wrap lumina-works-sec" id="gallery">
      <div class="lumina-sec-head">
        <div>
          <span class="lumina-sec-kicker">— CHROMATIC REEL —</span>
          <h2 class="lumina-sec-title">Featured Explorations</h2>
        </div>
        <span class="lumina-counter-badge">${works.length} Works</span>
      </div>
      <div class="lumina-grid">
        ${works.map((w, i) => {
          const layoutClass = i % 4 === 0 ? 'lumina-card-wide' : (i % 4 === 3 ? 'lumina-card-tall' : '');
          return `
          <figure class="lumina-card ${layoutClass}" data-gal="${i}">
            <div class="lumina-card-frame">
              <span class="lumina-cat-tag">${tplEsc(w.category || 'DIGITAL ART')}</span>
              <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
              <div class="lumina-shimmer-overlay"></div>
            </div>
            <figcaption class="lumina-card-meta">
              <div class="lumina-meta-text">
                <span class="lumina-card-year">${w.year || '2026'}</span>
                <b>${tplEsc(w.title || 'Untitled Work')}</b>
                ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
              </div>
              <span class="lumina-arrow">↗</span>
            </figcaption>
          </figure>
          `;
        }).join('')}
      </div>
    </section>

    <section class="wrap lumina-about-sec" id="about">
      <div class="lumina-glass-card">
        <div class="lumina-glass-kicker">CREATIVE PERSPECTIVE</div>
        <blockquote class="lumina-quote">"Light doesn't just illuminate form—it refracts possibilities and breathes soul into virtual dimensions."</blockquote>
        <div class="lumina-quote-author">
          ${face}
          <div>
            <b>${tplEsc(p.name)}</b>
            <span>${tplEsc(p.title || 'Visual Creator')}${location ? ` · ${tplEsc(location)}` : ''}</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="lumina-foot wrap">
      <div class="lumina-foot-banner">
        <div>
          <span class="lumina-foot-kicker">COLLABORATE</span>
          <h2>Let's create something transcendent.</h2>
        </div>
        ${p.email ? `<a class="lumina-btn-primary" href="mailto:${tplEsc(p.email)}">Connect ↗</a>` : ''}
      </div>
      <div class="lumina-foot-bottom">
        <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
        <span>Lumina Prism Theme · Built with Portfoolio</span>
      </div>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderVogue(p) {
  normTpl(p);
  document.body.dataset.template = 'vogue';
  document.title = `${p.name} — Vogue Editorial | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="vogue-avatar" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="vogue-avatar vogue-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`;
  const kicker = (p.title || 'Haute Editorial & Direction').toUpperCase();
  const location = p.location || '';
  const bio = (p.bio || p.summary || p.about || p.tagline || '').trim();

  app.innerHTML = `
  <div class="vogue-page">
    <header class="vogue-masthead wrap">
      <div class="vogue-masthead-bar">
        <span>VOL. XXIV · EDITION 2026</span>
        <span class="vogue-masthead-title">VOGUE</span>
        <span>PARIS · MILAN · NEW YORK</span>
      </div>
      <nav class="vogue-nav">
        <div class="vogue-brand">
          ${face}
          <div class="vogue-brand-meta">
            <span class="vogue-name">${tplEsc(p.name)}</span>
            <span class="vogue-role">${tplEsc(p.title || 'Creative & Fashion Director')}</span>
          </div>
        </div>
        <div class="vogue-nav-links">
          <a href="#editorial">Editorial Spread</a>
          <a href="#letter">Editor's Note</a>
          ${p.email ? `<a class="vogue-btn-inquire" href="mailto:${tplEsc(p.email)}">Inquire ↗</a>` : ''}
        </div>
      </nav>
    </header>

    <section class="wrap gal-vogue-head">
      <div class="vogue-issue-badge">— SPECIAL ISSUE · ${tplEsc(kicker)} —</div>
      <h1 class="vogue-title">${tplEsc(p.name)}</h1>
      <p class="vogue-sub">${works.length} Editorials Documented${location ? ` · ${tplEsc(location)}` : ''}</p>
      ${bio ? `<p class="vogue-lead">${tplEsc(bio)}</p>` : ''}
    </section>

    <section class="wrap vogue-spread" id="editorial">
      ${works.map((w, i) => {
        const layoutClass = i % 3 === 0 ? 'vogue-spread-cover' : (i % 3 === 1 ? 'vogue-spread-left' : 'vogue-spread-right');
        return `
        <figure class="vogue-plate ${layoutClass}" data-gal="${i}">
          <div class="vogue-frame">
            <span class="vogue-plate-no">PLATE ${String(i + 1).padStart(2, '0')}</span>
            <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
          </div>
          <figcaption class="vogue-meta">
            <span class="vogue-cat">${tplEsc(w.category || 'FASHION & EDITORIAL')}</span>
            <b>${tplEsc(w.title || 'Untitled Spread')}</b>
            ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
          </figcaption>
        </figure>
        `;
      }).join('')}
    </section>

    <section class="wrap vogue-about-sec" id="letter">
      <div class="vogue-letter-card">
        <div class="vogue-letter-header">
          <span class="vogue-letter-badge">EDITOR'S NOTE</span>
          <span class="vogue-letter-date">${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
        </div>
        <blockquote class="vogue-quote">"Fashion is not simply garments—it is an evocative visual language that captures the spirit, attitude, and quiet elegance of our time."</blockquote>
        <div class="vogue-signature">
          ${face}
          <div>
            <b>${tplEsc(p.name)}</b>
            <span>${tplEsc(p.title || 'Creative Director')}${location ? ` · ${tplEsc(location)}` : ''}</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="vogue-foot wrap">
      <div class="vogue-foot-top">
        <span class="vogue-foot-logo">VOGUE ARCHIVE</span>
        ${p.email ? `<a class="vogue-foot-cta" href="mailto:${tplEsc(p.email)}">Request Press Kit ↗</a>` : ''}
      </div>
      <div class="vogue-foot-bottom">
        <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
        <span>Vogue Editorial Portfolio · Built with Portfoolio</span>
      </div>
    </footer>
  </div>
  `;
  window.scrollTo(0, 0);
}

function renderFilmstrip(p) {
  normTpl(p);
  document.body.dataset.template = 'filmstrip';
  document.title = `${p.name} — Filmstrip Reel | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="filmstrip-avatar" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="filmstrip-avatar filmstrip-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`;
  const kicker = (p.title || 'Cinematography & 35mm Stills').toUpperCase();
  const location = p.location || '';
  const bio = (p.bio || p.summary || p.about || p.tagline || '').trim();

  app.innerHTML = `
  <div class="filmstrip-page">
    <div class="filmstrip-sprocket-strip top-strip" aria-hidden="true"></div>
    <nav class="filmstrip-nav wrap">
      <div class="filmstrip-brand">
        ${face}
        <div class="filmstrip-brand-meta">
          <span class="filmstrip-name">${tplEsc(p.name)}</span>
          <span class="filmstrip-format">● 35MM CINEMA REEL</span>
        </div>
      </div>
      <div class="filmstrip-nav-links">
        <a href="#reel">Reel</a>
        <a href="#notes">Director's Log</a>
        ${p.email ? `<a class="filmstrip-btn-inquire" href="mailto:${tplEsc(p.email)}">Book Shoot ↗</a>` : ''}
      </div>
    </nav>

    <header class="wrap gal-filmstrip-head">
      <div class="filmstrip-slate-badge">✦ ${tplEsc(kicker)} · 24 FPS ✦</div>
      <h1 class="filmstrip-title">${tplEsc(p.name)}</h1>
      <div class="filmstrip-stats">
        <span class="filmstrip-rec-dot"></span>
        <b>${tplEsc(p.title || 'Director of Photography')}</b>
        <span>${works.length} Frames Curated${location ? ` · ${tplEsc(location)}` : ''}</span>
      </div>
      ${bio ? `<p class="filmstrip-bio">${tplEsc(bio)}</p>` : ''}
    </header>

    <section class="wrap filmstrip-reel-sec" id="reel">
      <div class="filmstrip-sec-head">
        <span class="filmstrip-sec-kicker">— ARCHIVAL ROLL EXPOSURES —</span>
        <span class="filmstrip-stock">EMULSION: EASTMAN DOUBLE-X 5222</span>
      </div>
      <div class="filmstrip-reel">
        ${works.map((w, i) => {
          const frameNum = String(i + 1).padStart(2, '0');
          const isWide = i % 3 === 0;
          return `
          <figure class="filmstrip-frame ${isWide ? 'filmstrip-wide' : ''}" data-gal="${i}">
            <div class="filmstrip-sprocket-row" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div class="filmstrip-view">
              <div class="filmstrip-edge-code">
                <span>KODAK SAFETY FILM</span>
                <span>▶ ${frameNum}A</span>
              </div>
              <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title)}" loading="lazy">
            </div>
            <figcaption class="filmstrip-meta">
              <span class="filmstrip-cat">${tplEsc(w.category || 'ANALOG 35MM')}</span>
              <b>${tplEsc(w.title || 'Untitled Frame')}</b>
              ${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}
            </figcaption>
          </figure>
          `;
        }).join('')}
      </div>
    </section>

    <section class="wrap filmstrip-about-sec" id="notes">
      <div class="filmstrip-log-card">
        <div class="filmstrip-log-header">
          <span class="filmstrip-log-title">PRODUCTION LOG</span>
          <span class="filmstrip-log-cam">ARRI ALEXA 35 · ANAMORPHIC</span>
        </div>
        <blockquote class="filmstrip-quote">"Cinema begins when light meets grain—capturing raw presence, unspoken tension, and stories that outlive the reel."</blockquote>
        <div class="filmstrip-log-author">
          ${face}
          <div>
            <b>${tplEsc(p.name)}</b>
            <span>${tplEsc(p.title || 'Visual Storyteller')}${location ? ` · ${tplEsc(location)}` : ''}</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="filmstrip-foot wrap">
      <div class="filmstrip-foot-content">
        <span>© ${new Date().getFullYear()} ${tplEsc(p.name)}</span>
        <span>Filmstrip Reel Portfolio · Built with Portfoolio</span>
      </div>
    </footer>
    <div class="filmstrip-sprocket-strip bottom-strip" aria-hidden="true"></div>
  </div>
  `;
  window.scrollTo(0, 0);
}

function initCloudRuntime(p) {
  const btn = document.getElementById('cwThemeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('cloud-dark');
    });
  }
}

function renderVisualGallery(p, tplName) {
  normTpl(p);
  const vtpl = tplName || String(p.template || 'gallery').toLowerCase();
  document.body.dataset.template = vtpl;
  document.title = `${p.name} — ${vtpl.charAt(0).toUpperCase() + vtpl.slice(1)} Portfolio | portfoolio.me`;
  const app = document.getElementById('app');
  const works = getVisualWorks(p);
  const avatar = String(p.avatarUrl || p.avatar_url || '').trim();
  const face = avatar ? `<img class="gal-avatar" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="gal-avatar-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`;
  const countLabel = `${works.length} work${works.length === 1 ? '' : 's'}`;

  let headHtml = '', gridHtml = '';
  if (vtpl === 'museum') {
    headHtml = `<header class="wrap gal-museum-head">
      ${avatar ? `<img class="museum-portrait" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="museum-portrait museum-portrait-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`}
      <p class="museum-kicker">— EXHIBITION —</p>
      <h1>${tplEsc(p.name)}</h1>
      <p class="museum-sub">${tplEsc(p.title || '')}</p>
      <p class="museum-meta">${tplEsc(p.location || '')} · ${countLabel}</p>
    </header>`;
    gridHtml = `<section class="wrap museum-hang">${works.map((w, i) => `
      <figure class="museum-piece" data-gal="${i}">
        <div class="museum-frame"><img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title || '')}" loading="lazy"></div>
        <figcaption class="museum-plaque">
          <span class="museum-no">${String(i + 1).padStart(2, '0')}</span>
          <div class="museum-plaque-text"><b>${tplEsc(w.title || 'Untitled')}</b>${w.category ? `<small>${tplEsc(w.category)}</small>` : ''}</div>
        </figcaption>
      </figure>`).join('')}</section>`;
  } else if (vtpl === 'bloom') {
    headHtml = `<header class="wrap gal-bloom-head">
      <div class="bloom-orb"></div>
      ${avatar ? `<img class="bloom-portrait" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : `<div class="bloom-portrait bloom-portrait-fallback">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`}
      <h1>${tplEsc(p.name)}</h1>
      <p class="bloom-sub">${tplEsc(p.title || '')}</p>
      <p class="bloom-meta">${tplEsc(p.location || '')} · ${countLabel}</p>
    </header>`;
    gridHtml = `<section class="wrap bloom-masonry">${works.map((w, i) => `
      <figure class="bloom-tile ${i % 5 === 0 ? 'tall' : ''}" data-gal="${i}">
        <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title || '')}" loading="lazy">
        <figcaption><b>${tplEsc(w.title || 'Untitled')}</b>${w.category ? `<small>${tplEsc(w.category)}</small>` : ''}</figcaption>
      </figure>`).join('')}</section>`;
  } else if (vtpl === 'catalog') {
    headHtml = `<header class="wrap gal-catalog-head">
      <p class="cat-kicker">— CATALOGUE —</p>
      <h1>${tplEsc(p.name)}</h1>
      <p class="cat-sub">${tplEsc(p.title || '')}</p>
      <p class="cat-meta">${tplEsc(p.location || '')} · ${countLabel}</p>
      ${avatar ? `<img class="cat-portrait" src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}">` : ''}
    </header>`;
    gridHtml = `<section class="wrap cat-index">${works.map((w, i) => `
      <article class="cat-row" data-gal="${i}">
        <span class="cat-no">${String(i + 1).padStart(2, '0')}</span>
        <div class="cat-thumb"><img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title || '')}" loading="lazy"></div>
        <div class="cat-text"><b>${tplEsc(w.title || 'Untitled')}</b>${w.category ? `<small>${tplEsc(w.category)}</small>` : ''}${w.desc ? `<p>${tplEsc(w.desc)}</p>` : ''}</div>
        <span class="cat-arrow">→</span>
      </article>`).join('')}</section>`;
  } else {
    headHtml = `<header class="wrap" style="padding:60px 0 10px;text-align:center">
      ${avatar ? `<img src="${tplEsc(avatar)}" alt="${tplEsc(p.name)}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;margin:0 auto 14px;display:block;border:2px solid rgba(255,255,255,.2)">` : `<div style="width:110px;height:110px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;font-size:44px;background:linear-gradient(135deg,#f472b6,#8b5cf6,#22d3ee);color:#fff">${tplEsc((p.name||'?').charAt(0).toUpperCase())}</div>`}
      <h1 style="font-size:clamp(32px,5vw,52px);margin:0 0 8px">${tplEsc(p.name)}</h1>
      <p style="color:var(--muted);font-size:16px;margin:0">${tplEsc(p.title || '')}</p>
      <p style="color:var(--muted);font-size:13px;margin-top:6px">${tplEsc(p.location || '')} · ${countLabel}</p>
    </header>`;
    gridHtml = `<section class="wrap" style="padding:20px 0 60px">
      <div class="works-grid" style="margin-top:18px">${works.map((w, i) => `
        <div class="work-card" data-gal="${i}" style="cursor:pointer">
          <img src="${tplEsc(w.imageUrl)}" alt="${tplEsc(w.title || '')}" loading="lazy">
          <div class="work-meta" style="padding:12px 14px"><b>${tplEsc(w.title || 'Untitled')}</b>${w.category ? `<small style="color:var(--muted);display:block;margin-top:3px">${tplEsc(w.category)}</small>` : ''}</div>
        </div>`).join('')}</div>
    </section>`;
  }

  const navHtml = `
  <nav class="wrap" style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid rgba(255,255,255,0.08)">
    <a class="logo" href="/" style="text-decoration:none;font-weight:700;color:inherit;letter-spacing:.05em">◈ ${tplEsc(p.name)}</a>
    <div style="display:flex;gap:12px;align-items:center">
      <a href="/" style="font-size:13px;color:var(--muted);text-decoration:none">Make yours</a>
      ${p.email ? `<a href="mailto:${tplEsc(p.email)}" style="font-size:13px;padding:6px 14px;border-radius:6px;background:rgba(255,255,255,0.1);color:inherit;text-decoration:none">Contact</a>` : ''}
    </div>
  </nav>`;
  const footHtml = `<footer class="wrap" style="padding:30px 0;text-align:center;font-size:12px;color:var(--muted);border-top:1px solid rgba(255,255,255,0.08)">© ${new Date().getFullYear()} ${tplEsc(p.name)} · Built with portfoolio.me</footer>`;

  app.innerHTML = navHtml + headHtml + gridHtml + footHtml;
  window.scrollTo(0, 0);
}

window.PortfoolioTemplates = { minimal: renderMinimal, terminal: renderTerminal, creative: renderCreative, aurora: renderAurora, editorial: renderEditorial, brutalist: renderBrutalist, afterglow: renderAfterglow, ultraviolet: renderUltraviolet, tidepool: renderTidepool, motion: renderMotion, darkpro: renderDarkpro, fullpage: renderFullpage, moderncv: renderModerncv, ultracode: renderUltracode, devblue: renderDevblue, marlon: renderDevblue, cube: renderCube, cubegreen: renderCube, muzammal: renderCube, nova: renderNova, codeflow: renderCodeflow, wave: renderWave, assistant: renderAssistant, console: renderConsole, snowcard: renderSnowcard, parchment: renderParchment, cloud: renderCloud, github: renderGithub, particle: renderParticle, panels: renderPanels, monolith: renderMonolith, editor: renderEditor, magazine: renderMagazine, bold: renderBold, clean: renderClean, vibrant: renderVibrant, neon: renderNeon, hacker: renderHacker, gallery: (p) => renderVisualGallery(p, 'gallery'), studio: (p) => renderVisualGallery(p, 'studio'), noir: (p) => renderVisualGallery(p, 'noir'), museum: (p) => renderVisualGallery(p, 'museum'), catalog: (p) => renderVisualGallery(p, 'catalog'), bloom: (p) => renderVisualGallery(p, 'bloom'), atelier: renderAtelier, cinema: renderCinema, arch: renderArch, zine: renderZine, zen: renderZen, desire: renderDesire, lumina: renderLumina, vogue: renderVogue, filmstrip: renderFilmstrip };
window.PortfoolioTemplateList = TEMPLATES;


