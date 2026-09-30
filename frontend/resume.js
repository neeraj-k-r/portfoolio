/* portfoolio.me — resume builder (auto-built from profile info)
   Data: name/title/tagline/contact + skills + experience[] + education[] + projects[]
   Theme: profile.resume.theme — 'ats' (default, recruiter/ATS clean) | 'modern' | 'midnight' | 'terminal'
   Old profiles without experience/education/resume still render (empty states everywhere). */
window.PortfoolioResume = (() => {
  const THEMES = [
    { id: 'ats', name: 'ATS Clean', desc: 'Black on white, parser-safe', emoji: '📄', best: 'Job applications' },
    { id: 'modern', name: 'Modern', desc: 'Light card, soft + clean', emoji: '✨', best: 'General use' },
    { id: 'midnight', name: 'Midnight', desc: 'Dark neon, on-brand', emoji: '🌌', best: 'Match portfolio' },
    { id: 'terminal', name: 'Terminal', desc: 'Mono green, dev cred', emoji: '💻', best: 'Backend • OSS' },
  ];
  const VALID = new Set(THEMES.map((t) => t.id));

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function get(p) {
    const r = (p && p.resume && typeof p.resume === 'object') ? p.resume : {};
    return {
      summary: String(r.summary || '').trim(),
      theme: VALID.has(String(r.theme || '').toLowerCase()) ? String(r.theme).toLowerCase() : 'ats',
    };
  }
  function expOf(p) { return Array.isArray(p.experience) ? p.experience.filter(Boolean) : []; }
  function eduOf(p) { return Array.isArray(p.education) ? p.education.filter(Boolean) : []; }
  function dateLine(e) {
    const s = String(e.start || '').trim(), en = e.current ? 'Present' : String(e.end || '').trim();
    return [s, en].filter(Boolean).join(' – ') || '';
  }
  function contactItems(p) {
    const out = [];
    if (p.email) out.push(`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
    if (p.phone) out.push(`<span>${esc(p.phone)}</span>`);
    if (p.location) out.push(`<span>${esc(p.location)}</span>`);
    if (p.github) out.push(`<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (p.linkedin) out.push(`<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    return out;
  }
  function techsOf(pr) {
    const out = [], seen = new Set();
    ((pr && pr.technologies) || (pr && pr.tags) || []).forEach((t) => {
      const k = String(t || '').trim().toLowerCase();
      if (k && k !== 'fork' && !seen.has(k)) { seen.add(k); out.push(String(t).trim()); }
    });
    return out;
  }
  function resumeURL(username) { return `/?u=${encodeURIComponent(username)}&resume=1`; }

  function bullets(desc) {
    const lines = String(desc || '').split('\n').map((s) => s.trim()).filter(Boolean);
    if (!lines.length) return '';
    if (lines.length === 1) return `<p class="rs-p">${esc(lines[0])}</p>`;
    return `<ul class="rs-ul">${lines.map((l) => `<li>${esc(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>`;
  }

  // Full resume body (shared by embedded section preview, standalone page, worker mirror)
  function docBody(p) {
    const r = get(p);
    const summary = r.summary || p.tagline || '';
    const exps = expOf(p), edus = eduOf(p);
    const skills = (p.skills || []).filter(Boolean);
    const projs = (p.projects || []).slice(0, 6);
    const sec = (t) => `<h2 class="rs-sec-h">${t}</h2>`;
    return `
    <div class="rs-head">
      <h1 class="rs-name">${esc(p.name || p.username || 'Your Name')}</h1>
      <p class="rs-title">${esc(p.title || '')}</p>
      <p class="rs-contact">${contactItems(p).join(' &nbsp;•&nbsp; ')}</p>
    </div>
    ${summary ? `${sec('Summary')}<p class="rs-p">${esc(summary)}</p>` : ''}
    ${skills.length ? `${sec('Skills')}<p class="rs-p">${skills.map(esc).join(' • ')}</p>` : ''}
    ${sec('Experience')}
    ${exps.length ? exps.map((e) => `
      <div class="rs-item">
        <div class="rs-item-top"><b>${esc(e.role || 'Role')} — ${esc(e.company || '')}</b><span class="rs-dates">${esc(dateLine(e))}</span></div>
        ${bullets(e.desc)}
      </div>`).join('') : '<p class="rs-p rs-dim">Add roles from your dashboard → Resume tab.</p>'}
    ${sec('Education')}
    ${edus.length ? edus.map((e) => `
      <div class="rs-item">
        <div class="rs-item-top"><b>${esc(e.school || '')}</b><span class="rs-dates">${esc([e.start, e.end].filter(Boolean).join(' – '))}</span></div>
        <p class="rs-p">${esc([e.degree, e.field].filter(Boolean).join(', '))}</p>
      </div>`).join('') : '<p class="rs-p rs-dim">Add education from your dashboard → Resume tab.</p>'}
    ${projs.length ? `${sec('Projects')}${projs.map((pr) => {
      const t = techsOf(pr);
      return `<div class="rs-item"><div class="rs-item-top"><b>${esc(pr.title)}</b>${pr.url && pr.url !== '#' ? `<a href="${esc(pr.url)}" target="_blank" rel="noopener">Code →</a>` : ''}</div>
        <p class="rs-p">${esc(pr.desc || '')}${t.length ? ` <i>(${t.map(esc).join(', ')})</i>` : ''}</p></div>`;
    }).join('')}` : ''}`;
  }

  // Compact section for portfolio pages (all themes) — links to the full page
  function sectionHTML(p) {
    const r = get(p);
    const url = resumeURL(p.username);
    const exps = expOf(p), edus = eduOf(p);
    const latest = exps[0];
    return `
    <section class="wrap rs-embed" style="padding-top:10px">
      <span class="eyebrow">● Resume</span>
      <h2 class="title">Hire-ready <span class="grad">resume</span></h2>
      <div class="card rs-embed-card rs-${r.theme}">
        <div style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
          <div>
            <h3 style="font-size:19px">📄 ${esc(p.name)} — ${esc(p.title)}</h3>
            <p style="color:var(--muted);font-size:13.5px;margin-top:4px">
              ${exps.length ? `${exps.length} role${exps.length > 1 ? 's' : ''}${latest && latest.company ? ` · latest: ${esc(latest.role || '')} @ ${esc(latest.company)}` : ''} · ` : ''}${(p.skills || []).length} skills · ${(p.projects || []).length} projects · theme: ${esc(r.theme.toUpperCase())}${edus.length ? ` · ${edus.length} education` : ''}
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <a class="btn btn-primary btn-sm" href="${url}">View resume →</a>
            <a class="btn btn-ghost btn-sm" href="${url}" onclick="window.open('${url}','_blank');return false">Print / PDF</a>
          </div>
        </div>
      </div>
    </section>`;
  }

  // Standalone full-page doc (used for ?u=x&resume=1 and dashboard preview srcdoc)
  function fullDoc(p, opts) {
    const o = opts || {};
    const r = get(p);
    const back = `/?u=${encodeURIComponent(p.username)}`;
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Resume — ${esc(p.name)} | portfoolio.me</title>
${o.bare ? '' : '<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="resume.css">'}
</head><body class="rs-page rs-${r.theme}">
${o.bare ? '' : `<div class="no-print" style="max-width:860px;margin:0 auto;padding:18px 16px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
<a href="${back}" style="font-weight:800">← ${esc(p.name)}</a>
<span style="margin-left:auto;display:flex;gap:8px">
<a href="${back}" style="font-weight:700">Portfolio</a>
<button onclick="window.print()" style="font-weight:800;cursor:pointer">⬇ Print / Save PDF</button>
</span></div>`}
<main class="rs-doc rs-${r.theme}">${docBody(p)}
<p class="rs-foot">Resume auto-built from <b>portfoolio.me</b> profile · ${esc(p.username)}.portfoolio.me</p>
</main>
${o.bare ? '' : `<div class="no-print" style="text-align:center;padding:0 0 40px"><button onclick="window.print()" style="font-weight:800;cursor:pointer;padding:10px 18px">⬇ Print / Save as PDF</button></div>`}
</body></html>`;
  }

  return { THEMES, get, expOf, eduOf, resumeURL, docBody, sectionHTML, fullDoc, esc };
})();
