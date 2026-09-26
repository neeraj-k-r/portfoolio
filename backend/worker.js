// portfoolio.me wildcard worker — *.portfoolio.me → approved Supabase profiles (free, no Netlify Pro)
// Deploy: npx wrangler deploy (see wrangler.toml). Route: *.portfoolio.me/*
// Data: Supabase REST (public read of approved rows only — RLS enforced) + seed JSON fallback.
const SUPABASE_URL = 'https://oorcivmymcokbjiawkig.supabase.co';
const SUPABASE_KEY = 'sb_publishable_u3HhZlncnGcg_UBT4G3N-Q_3uE5Qh63'; // publishable by design; RLS is the lock
const ORIGIN = 'https://portfoolio.me';
const RESERVED = new Set(['www', 'app', 'api', 'admin', 'mail', 'blog', 'portfoolio', 'netlify']);

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

async function getProfile(sub) {
  // 1) Supabase: approved rows are publicly readable
  try {
    const url = `${SUPABASE_URL}/rest/v1/profiles?username=eq.${encodeURIComponent(sub)}&status=eq.approved&select=username,name,title,tagline,email,phone,location,github,linkedin,template,skills,projects`;
    const r = await fetch(url, { headers: { apikey: SUPABASE_KEY, Accept: 'application/json' } });
    if (r.ok) {
      const rows = await r.json();
      if (rows.length) return rows[0];
    }
  } catch {}
  // 2) seed showcase files on the origin site
  try {
    const r = await fetch(`${ORIGIN}/profiles/${encodeURIComponent(sub)}.json`);
    if (r.ok) return await r.json();
  } catch {}
  return null;
}

function head(p, tpl) {
  return `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — ${esc(p.title)} | portfoolio.me</title>
<meta name="description" content="${esc(p.tagline || p.title || '')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="${ORIGIN}/style.css"><link rel="stylesheet" href="${ORIGIN}/templates.css"></head>`;
}
function nav(p) {
  return `<nav><a class="logo" href="${ORIGIN}/"><span style="font-size:22px">◈</span><span>PORTFOOLIO<small>${esc(p.username)}.portfoolio.me</small></span></a>
  <div style="display:flex;gap:10px"><a class="btn btn-ghost btn-sm" href="${ORIGIN}/">Make yours</a>
  ${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}">Hire ${esc((p.name || '').split(' ')[0])}</a>` : ''}</div></nav>`;
}
function foot(p) {
  return `<footer><div class="wrap foot"><div>© ${new Date().getFullYear()} <b style="color:#fff">${esc(p.name)}</b> via <b style="color:#fff">portfoolio.me</b></div>
  <div class="socials">${p.github ? `<a href="${esc(p.github)}"><i class="fa-brands fa-github"></i></a>` : ''}${p.linkedin ? `<a href="${esc(p.linkedin)}"><i class="fa-brands fa-linkedin"></i></a>` : ''}${p.email ? `<a href="mailto:${esc(p.email)}"><i class="fa-solid fa-envelope"></i></a>` : ''}</div></div></footer>`;
}
function projectsFor(p, tpl) {
  // mirror frontend/templates.js per-template project styles so subdomain == trial
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
function page(p) {
  const tpl = (p.template || 'midnight').toLowerCase();
  const skills = (p.skills || []).map((s) => `<span class="badge">${esc(s)}</span>`).join('');
  const bodyAttr = tpl === 'midnight' ? '' : ` data-template="${tpl}"`;
  const hero = tpl === 'aurora'
    ? `<header class="hero wrap"><div style="text-align:center;padding:50px 0 10px">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block">` : ''}
       <p class="mono" style="letter-spacing:3px;font-size:12px;opacity:.8">PORTFOLIO</p>
       <h1 style="font-size:clamp(44px,7vw,84px)">${esc(p.name)}</h1>
       <p class="sub" style="margin:12px auto;max-width:560px">${esc(p.title)} — ${esc(p.tagline || '')}</p>
       <div class="hero-cta" style="justify-content:center;display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Get in touch</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GitHub</a>` : ''}</div></div></header>`
    : tpl === 'editorial'
    ? `<section class="wrap" style="padding:140px 0 20px;max-width:760px">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;margin-bottom:12px">` : ''}
       <p class="mono" style="font-size:13px">The portfolio of</p>
       <h1 style="font-size:clamp(44px,7vw,76px)">${esc(p.name)}</h1>
       <h2 style="font-size:22px;font-style:italic">${esc(p.title)}</h2>
       <p style="font-size:18px;margin-top:10px">${esc(p.tagline || '')}</p></section>`
    : tpl === 'brutalist'
    ? `<section class="wrap" style="padding:140px 0 20px">
       <span class="badge">● OPEN FOR WORK</span>
       ${p.avatarUrl ? `<div style="margin-top:12px"><img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:110px;height:110px;border-radius:18px;object-fit:cover;border:3px solid #000"></div>` : ''}
       <h1 style="font-size:clamp(46px,8vw,96px);text-transform:uppercase">${esc(p.name)}</h1>
       <h2 style="font-size:clamp(20px,3vw,30px);background:#000;color:#fef08a;display:inline-block;padding:6px 14px;margin-top:10px">${esc(p.title)}</h2>
       <p class="sub" style="margin-top:12px;font-weight:600">${esc(p.tagline || '')}</p>
       <div style="margin-top:12px">${(p.skills || []).map((s) => `<a href="/skills/${encodeURIComponent(String(s).toLowerCase())}" style="text-decoration:none"><span class="badge">★ ${esc(s)}</span></a>`).join(' ')}</div>
       <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">HIRE ME</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GITHUB</a>` : ''}</div></section>`
    : tpl === 'minimal'
    ? `<section class="wrap" style="padding:140px 0 30px"><div class="card">
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:96px;height:96px;border-radius:16px;object-fit:cover;margin-bottom:10px">` : ''}
       <h1 style="font-size:clamp(36px,5vw,56px)">${esc(p.name)}</h1>
       <h2 style="font-size:20px">${esc(p.title)}</h2><p style="margin:10px 0">${esc(p.tagline || '')}</p>
       <div class="badges" style="justify-content:flex-start">${skills}</div>
       <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">${p.email ? `<a class="btn btn-primary btn-sm" href="mailto:${esc(p.email)}">Email me</a>` : ''}${p.github ? `<a class="btn btn-ghost btn-sm" href="${esc(p.github)}">GitHub</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost btn-sm" href="${esc(p.linkedin)}">LinkedIn</a>` : ''}</div></div></section>`
    : tpl === 'terminal'
    ? `<section class="wrap" style="padding:140px 0 30px"><div class="card"><p class="mono">$ whoami</p>
       ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:96px;height:96px;border-radius:12px;object-fit:cover;margin:10px 0">` : ''}
       <h1>${esc(p.name)} <span>@${esc(p.username)}</span></h1><p class="mono">${esc(p.title)}</p><p>${esc(p.tagline || '')}</p></div>
       <div class="card" style="margin-top:14px"><p class="mono">$ ls --skills</p><div style="margin-top:8px">${skills}</div></div></section>`
    : `<header class="hero wrap"><div class="hero-grid"><div>
       ${p.available === false ? '' : '<div class="pill"><span class="dot"></span> Open to work</div>'}
       <h1>Hi, I'm <span class="grad">${esc(p.name)}</span><br>${esc(p.title)}</h1>
       <p class="sub">${esc(p.tagline || '')}</p>
       <div class="hero-cta">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Email me</a>` : ''}${p.github ? `<a class="btn btn-ghost" href="${esc(p.github)}">GitHub</a>` : ''}${p.linkedin ? `<a class="btn btn-ghost" href="${esc(p.linkedin)}">LinkedIn</a>` : ''}</div>
       <div class="hero-meta">${p.location ? `<span>${esc(p.location)}</span>` : ''} ${p.email ? `<span>${esc(p.email)}</span>` : ''} ${p.phone ? `<span>${esc(p.phone)}</span>` : ''}</div></div>
       <div class="visual"><div class="avatar-card"><div class="avatar-inner">
         ${p.avatarUrl ? `<img src="${esc(p.avatarUrl)}" alt="${esc(p.name)}" style="width:132px;height:132px;border-radius:50%;object-fit:cover">` : `<div style="width:120px;height:120px;border-radius:50%;margin:0 auto;display:grid;place-items:center;font-size:52px;color:#fff;background:linear-gradient(135deg,#6c6cf5,#22d3ee)">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</div>`}
         <h3>${esc(p.name)}</h3><p class="mono">@${esc(p.username)} • portfoolio.me</p><div class="badges">${skills}</div>
       </div></div></div></div></header>`;
  const gridCls = (tpl === 'minimal' || tpl === 'terminal' || tpl === 'brutalist') ? 'dir-grid' : 'proj-grid';
  return `<!DOCTYPE html><html lang="en">${head(p, tpl)}<body${bodyAttr}><div class="bg-fx"></div>${nav(p)}${hero}
  ${skillsSection(p)}
  <section class="wrap" style="padding-top:10px"><span class="eyebrow">● Projects</span>
  <h2 class="title">Work that <span class="grad">speaks</span></h2>
  <div class="${gridCls}" style="margin-top:22px">${projectsFor(p, tpl) || '<p>No projects yet.</p>'}</div></section>
  <section class="wrap"><div class="card" style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
  <div><h3>Like this portfolio?</h3><p>Claim yours free at <b>portfoolio.me</b>.</p></div>
  <a class="btn btn-primary" href="${ORIGIN}/">Create mine</a></div></section>${foot(p)}</body></html>`;
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
  const bodyAttr = tpl === 'midnight' ? '' : ` data-template="${tpl}"`;
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
    const p = await getProfile(sub);
    if (!p) return Response.redirect(`${ORIGIN}/?claim=${encodeURIComponent(sub)}`, 302);
    const m = url.pathname.match(/^\/skills\/([^/]+)\/?$/);
    const html = m ? pageSkill(p, decodeURIComponent(m[1])) : page(p);
    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'public, max-age=300' },
    });
  },
};
