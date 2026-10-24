/* portfoolio.me — resume builder (auto-built from profile info)
   Data: name/title/tagline/contact + skills + experience[] + education[] + projects[] + certifications[]
   Theme: profile.resume.theme — 'ats' (default, recruiter/ATS clean) | 'modern' | 'midnight' | 'terminal'
   Old profiles without experience/education/resume still render (empty states everywhere). */
window.PortfoolioResume = (() => {
  const THEMES = [
    { id: 'ats', name: 'ATS Clean', desc: 'Black on white, parser-safe, standard headings', emoji: '📄', best: 'Job applications' },
    { id: 'modern', name: 'Modern', desc: 'Light card, soft + clean', emoji: '✨', best: 'General use' },
    { id: 'midnight', name: 'Midnight', desc: 'Dark neon, on-brand', emoji: '🌌', best: 'Match portfolio' },
    { id: 'terminal', name: 'Terminal', desc: 'Mono green, dev cred', emoji: '💻', best: 'Backend • OSS' },
    // New themes inspired by TailorCV
    { id: 'executive', name: 'Executive Edge', desc: 'Bold serif headers, premium feel', emoji: '🎩', best: 'Senior leaders, Directors, VPs' },
    { id: 'creative', name: 'Creative Balance', desc: 'Gradient accents, playful yet professional', emoji: '🎨', best: 'Designers, Creative roles' },
    { id: 'datasci', name: 'Data Analyst Pro', desc: 'Structured, metrics-focused layout', emoji: '📊', best: 'Data, Analytics, BI roles' },
    { id: 'product', name: 'Product Manager Fit', desc: 'Outcome-oriented, stakeholder-ready', emoji: '📦', best: 'Product, Strategy, PM roles' },
    { id: 'compact', name: 'Compact One-Page', desc: 'Dense, single-page optimized', emoji: '📃', best: '0–5 yrs experience, strict 1-page' },
    { id: 'academic', name: 'LaTeX Academic', desc: 'Serif, publication-style, research-ready', emoji: '🎓', best: 'Academia, Research, PhD' },
  ];
  const VALID = new Set(THEMES.map((t) => t.id));

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => {
      if (c === '&') return '&';
      if (c === '<') return '<';
      if (c === '>') return '>';
      if (c === '"') return '"';
      return '\'';
    });
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
  function certOf(p) { return Array.isArray(p.certifications) ? p.certifications.filter(Boolean) : []; }
  function splitSkills(skills) {
    const hard = [], soft = [];
    const softList = new Set(['communication','leadership','teamwork','problem solving','critical thinking','adaptability','time management','creativity','collaboration','attention to detail','organization','interpersonal']);
    skills.forEach((s) => {
      const k = String(s || '').trim().toLowerCase();
      if (softList.has(k)) soft.push(s);
      else hard.push(s);
    });
    return { hard, soft };
  }
  function dateLine(e) {
    const s = String(e.start || '').trim(), en = e.current ? 'Present' : String(e.end || '').trim();
    return [s, en].filter(Boolean).join(' – ') || '';
  }
  function contactItems(p) {
    const out = [];
    if (p.email) out.push(`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
    if (p.phone) out.push(`<span>${esc(p.phone)}</span>`);
    if (p.location) out.push(`<span>${esc(p.location)}</span>`);
    if (p.linkedin) out.push(`<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (p.github) out.push(`<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
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
    const isATS = r.theme === 'ats';
    const summary = r.summary || p.tagline || '';
    const exps = expOf(p), edus = eduOf(p), certs = certOf(p);
    const skills = (p.skills || []).filter(Boolean);
    const { hard, soft } = splitSkills(skills);
    const projs = (p.projects || []).slice(0, 6);
    const sec = (t) => `<h2 class="rs-sec-h">${t}</h2>`;
    const contact = contactItems(p).join(' | ');
    return `
    <div class="rs-head">
      <h1 class="rs-name">${esc(p.name || p.username || 'Your Name')}</h1>
      <p class="rs-title">${esc(p.title || '')}</p>
      <p class="rs-contact">${contact}</p>
    </div>
    ${summary ? `${sec('Professional Summary')}<p class="rs-p">${esc(summary)}</p>` : ''}
    ${skills.length ? `
      ${sec('Skills')}
      ${hard.length ? `<p class="rs-p"><strong>Technical Skills:</strong> ${hard.map(esc).join(', ')}</p>` : ''}
      ${soft.length ? `<p class="rs-p"><strong>Soft Skills:</strong> ${soft.map(esc).join(', ')}</p>` : ''}
    ` : ''}
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
    ${certs.length ? `
      ${sec('Certifications')}
      ${certs.map((c) => `<p class="rs-p">${esc(c.name || c)}</p>`).join('')}
    ` : ''}
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
<link rel="icon" type="image/svg+xml" href="/frontend/favicon.svg">
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

  // ============================================================
  // ATS SCORE ANALYZER — evaluates resume against ATS criteria
  // ============================================================
  const atsKeywordWeights = {
    // High-weight core skills (appear in most job descriptions)
    'javascript': 8, 'typescript': 8, 'python': 8, 'java': 8, 'c++': 7, 'c#': 7, 'go': 7, 'ruby': 7,
    'react': 9, 'node.js': 8, 'next.js': 7, 'angular': 7, 'vue.js': 6, 'html': 8, 'css': 8,
    'sql': 8, 'aws': 8, 'docker': 7, 'kubernetes': 9, 'git': 8, 'github': 7,

    // Middle-weight specialized skills
    'machine learning': 6, 'ai': 6, 'data structures': 7, 'algorithms': 7,
    'microservices': 6, 'ci/cd': 6, 'rest api': 6, 'graphql': 6,
    'tensorflow': 5, 'pytorch': 5, 'redis': 5, 'postgresql': 5, 'mongodb': 5,

    // Foundational
    'linux': 5, 'ubuntu': 4, 'windows': 4, 'macos': 4,
    'agile': 6, 'scrum': 5, 'project management': 5,
  };

  function computeATSScore(p) {
    const r = get(p);
    const theme = r.theme;
    const summary = r.summary || (p.tagline || '').trim();
    const exps = expOf(p);
    const edus = eduOf(p);
    const certs = certOf(p);
    const skills = (p.skills || []).filter(Boolean);
    const { hard, soft } = splitSkills(skills);
    const projs = (p.projects || []).slice(0, 6);

    let score = 0;
    const maxScore = 100;
    const feedback = {
      sections: [],
      formatting: [],
      keywords: [],
      suggestions: []
    };

    // 1. Section presence (30 points max)
    let sectionScore = 0;
    const hasContact = !!(p.email || p.phone || p.location);
    const hasSummary = !!summary;
    const hasExperience = exps.length > 0;
    const hasEducation = edus.length > 0;
    const hasSkills = skills.length > 0;

    // Contact section
    if (hasContact) { sectionScore += 6; feedback.sections.push({ name: 'Contact Info', present: true, score: 6 }); }
    else { feedback.sections.push({ name: 'Contact Info', present: false, score: 0, suggestion: 'Add email, phone, or location' }); }

    // Professional Summary
    if (hasSummary) { sectionScore += 8; feedback.sections.push({ name: 'Professional Summary', present: true, score: 8 }); }
    else { feedback.sections.push({ name: 'Professional Summary', present: false, score: 0, suggestion: 'Add 2-3 line summary of your experience and goals' }); }

    // Experience
    if (hasExperience) { sectionScore += 10; feedback.sections.push({ name: 'Experience', present: true, score: 10 }); }
    else { feedback.sections.push({ name: 'Experience', present: false, score: 0, suggestion: 'Add work experience roles with company, dates, and achievements' }); }

    // Education
    if (hasEducation) { sectionScore += 4; feedback.sections.push({ name: 'Education', present: true, score: 4 }); }
    else { feedback.sections.push({ name: 'Education', present: false, score: 0, suggestion: 'Add education background (school, degree, field)' }); }

    // Skills
    if (hasSkills) { sectionScore += 6; feedback.sections.push({ name: 'Skills Section', present: true, score: 6 }); }
    else { feedback.sections.push({ name: 'Skills Section', present: false, score: 0, suggestion: 'Add technical and soft skills' }); }

    score += sectionScore;
    feedback.sections.forEach(s => { if (!s.present) feedback.suggestions.push(`Add ${s.suggestion}`); });

    // 2. Formatting checks (20 points max)
    let formattingScore = 0;

    // Single-column layout (ATS-friendly)
    formattingScore += 5;
    feedback.formatting.push({ name: 'Single-column layout', present: true, score: 5, note: 'ATS-friendly: print output normalizes to single column' });

    // Standard section headings
    formattingScore += 5;
    feedback.formatting.push({ name: 'Standard section headings', present: true, score: 5, note: 'h2 headings used for all major sections' });

    // No tables/graphics for layout
    formattingScore += 5;
    feedback.formatting.push({ name: 'No tables/graphics for layout', present: true, score: 5, note: 'Resume built as pure text/HTML, no layout tables' });

    // Readable system fonts
    formattingScore += 5;
    feedback.formatting.push({ name: 'Readable system fonts', present: true, score: 5, note: 'Print CSS uses system fonts, ATS-parsable' });

    score += formattingScore;

    // 3. Keyword match (35 points max)
    let keywordScore = 0;
    let foundKeywords = [];
    let missingKeywords = [];

    // Build a set of user's skills (lowercased)
    const userSkillsSet = new Set();
    skills.forEach(s => userSkillsSet.add(String(s).trim().toLowerCase()));
    hard.forEach(s => userSkillsSet.add(String(s).trim().toLowerCase()));
    soft.forEach(s => userSkillsSet.add(String(s).trim().toLowerCase()));

    // Also check project technologies
    const projTechs = new Set();
    projs.forEach(pr => {
      const t = techsOf(pr);
      t.forEach(tt => projTechs.add(String(tt).trim().toLowerCase()));
    });
    projTechs.forEach(t => userSkillsSet.add(t));

    // Check each weighted keyword
    Object.entries(atsKeywordWeights).forEach(([keyword, weight]) => {
      const lower = keyword.toLowerCase();
      if (userSkillsSet.has(lower)) {
        keywordScore += weight;
        foundKeywords.push({ name: keyword, weight });
      } else {
        missingKeywords.push({ name: keyword, weight });
      }
    });

    // Normalize keyword score to max 35
    keywordScore = Math.min(35, keywordScore);
    score += keywordScore;

    // Record keyword feedback
    if (foundKeywords.length > 0) {
      feedback.keywords.push({ type: 'found', count: foundKeywords.length, message: `Found ${foundKeywords.length} relevant tech skills` });
      const topFound = foundKeywords.sort((a, b) => b.weight - a.weight).slice(0, 5);
      topFound.forEach(kw => {
        feedback.keywords.push({ name: kw.name, status: 'present', score: kw.weight });
      });
    }

    if (missingKeywords.length > 0) {
      const weightedMissing = missingKeywords.reduce((sum, kw) => sum + kw.weight, 0);
      feedback.suggestions.push(`Consider adding these high-impact skills: ${missingKeywords.slice(0, 5).map(kw => kw.name).join(', ')} (potential +${Math.min(15, Math.ceil(weightedMissing / 2))} points if added)`);
    }

    // Normalize total score to 100
    score = Math.min(100, score);

    // Grade letter
    let grade;
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 50) grade = 'D';
    else grade = 'F';

    return {
      score,
      maxScore,
      grade,
      sectionScore,
      formattingScore,
      keywordScore,
      foundKeywords,
      missingKeywords,
      feedback,
      hasContact, hasSummary, hasExperience, hasEducation, hasSkills,
      skillCount: skills.length,
      hardSkillCount: hard.length,
      softSkillCount: soft.length,
      projectCount: projs.length
    };
  }

  function atsScoreClass(score) {
    if (score >= 90) return 'ats-excellent';
    if (score >= 80) return 'ats-good';
    if (score >= 70) return 'ats-fair';
    if (score >= 60) return 'ats-poor';
    return 'ats-failing';
  }

  function atsGradeClass(grade) {
    if (grade === 'A+' || grade === 'A') return 'ats-excellent';
    if (grade === 'B') return 'ats-good';
    if (grade === 'C') return 'ats-fair';
    if (grade === 'D') return 'ats-poor';
    return 'ats-failing';
  }

  // ============================================================
  // SKILLS GAP ANALYSIS — compares user skills against common role requirements
  // ============================================================
  const roleSkillRequirements = {
    'software engineer': {
      title: 'Software Engineer',
      core: ['javascript', 'python', 'java', 'c++', 'git', 'sql'],
      desired: ['react', 'node.js', 'docker', 'kubernetes', 'aws', 'rest api'],
      niceToHave: ['typescript', 'machine learning', 'graphql', 'microservices'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'senior software engineer': {
      title: 'Senior Software Engineer',
      core: ['javascript', 'system design', 'architecture', 'git', 'sql'],
      desired: ['kubernetes', 'docker', 'aws/gcp/azure', 'terraform', 'ci/cd'],
      niceToHave: ['machine learning', 'graphql', 'async messaging', 'performance optimization'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'frontend engineer': {
      title: 'Frontend Engineer',
      core: ['html', 'css', 'javascript', 'react', 'typescript'],
      desired: ['redux', 'state management', 'testing', 'webpack', 'vite'],
      niceToHave: ['graphql', 'progressive web apps', 'accessibility (a11y)'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'full stack engineer': {
      title: 'Full Stack Engineer',
      core: ['javascript', 'node.js', 'python', 'sql', 'git'],
      desired: ['react', 'express', 'rest api', 'docker', 'aws'],
      niceToHave: ['graphql', 'microservices', 'typescript', 'ci/cd'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'devops engineer': {
      title: 'DevOps Engineer',
      core: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux'],
      desired: ['terraform', 'ansible', 'monitoring', 'microservices'],
      niceToHave: ['helm', 'prometheus', 'grafana', 'infrastructure as code'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'data scientist': {
      title: 'Data Scientist',
      core: ['python', 'statistics', 'machine learning', 'data analysis'],
      desired: ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'],
      niceToHave: ['sql', 'aws', 'gcp', 'docker', 'data visualization'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'product manager': {
      title: 'Product Manager',
      core: ['product strategy', 'roadmapping', 'analytics', 'stakeholder management'],
      desired: ['jira', 'sql', 'A/B testing', 'user research', 'figma'],
      niceToHave: ['sql', 'python', 'data analysis', 'market research'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    }
  };

  function computeSkillsGap(p) {
    const r = get(p);
    const skills = (p.skills || []).filter(Boolean);
    const { hard, soft } = splitSkills(skills);
    const projs = (p.projects || []).slice(0, 6);

    // Build user skill set (lowercased)
    const userSkillsSet = new Set();
    skills.forEach(s => userSkillsSet.add(String(s).trim().toLowerCase()));
    hard.forEach(s => userSkillsSet.add(String(s).trim().toLowerCase()));
    soft.forEach(s => userSkillsSet.add(String(s).trim().toLowerCase()));

    // Also add project technologies
    projs.forEach(pr => {
      const t = techsOf(pr);
      t.forEach(tt => userSkillsSet.add(String(tt).trim().toLowerCase()));
    });

    // Evaluate against each role
    const roleResults = [];
    const allMissing = [];

    Object.entries(roleSkillRequirements).forEach(([roleKey, role]) => {
      let score = 0;
      let foundCore = 0, foundDesired = 0, foundNice = 0;
      let missingCore = 0, missingDesired = 0, missingNice = 0;

      // Check core skills
      role.core.forEach(coreSkill => {
        const lower = coreSkill.toLowerCase();
        if (userSkillsSet.has(lower)) {
          foundCore++;
          score += role.weightCore;
        } else {
          missingCore++;
          allMissing.push({ role: role.title, category: 'core', skill: coreSkill, weight: role.weightCore });
        }
      });

      // Check desired skills
      role.desired.forEach(desiredSkill => {
        const lower = desiredSkill.toLowerCase();
        if (userSkillsSet.has(lower)) {
          foundDesired++;
          score += role.weightDesired;
        } else {
          missingDesired++;
          allMissing.push({ role: role.title, category: 'desired', skill: desiredSkill, weight: role.weightDesired });
        }
      });

      // Check nice-to-have skills
      role.niceToHave.forEach(niceSkill => {
        const lower = niceSkill.toLowerCase();
        if (userSkillsSet.has(lower)) {
          foundNice++;
          score += role.weightNice;
        } else {
          missingNice++;
          allMissing.push({ role: role.title, category: 'nice', skill: niceSkill, weight: role.weightNice });
        }
      });

      // Cap score at 100 and compute percentage
      const maxPossible = role.core.length * role.weightCore + role.desired.length * role.weightDesired + role.niceToHave.length * role.weightNice;
      const normalizedScore = Math.min(100, score);
      const pct = Math.round((normalizedScore / Math.max(1, maxPossible)) * 100);

      roleResults.push({
        role: role.title,
        core: { found: foundCore, total: role.core.length, missing: missingCore },
        desired: { found: foundDesired, total: role.desired.length, missing: missingDesired },
        nice: { found: foundNice, total: role.niceToHave.length, missing: missingNice },
        score: normalizedScore,
        maxScore: 100,
        grade: normalizedScore >= 80 ? 'A' : normalizedScore >= 70 ? 'B' : normalizedScore >= 60 ? 'C' : 'D',
        pct,
        suggestions: []
      });

      // Generate suggestions for this role
      const suggestions = [];
      if (missingCore > 0) {
        suggestions.push(`Priority: Add ${missingCore} core skill${missingCore > 1 ? 's' : ''} (${role.core.slice(0, missingCore).join(', ')})`);
      }
      if (missingDesired > 0) {
        suggestions.push(`Recommended: Add ${missingDesired} desired skill${missingDesired > 1 ? 's' : ''} (${role.desired.slice(0, missingDesired).join(', ')})`);
      }
      if (missingNice > 0) {
        suggestions.push(`Consider: Add ${missingNice} nice-to-have skill${missingNice > 1 ? 's' : ''} (${role.niceToHave.slice(0, missingNice).join(', ')})`);
      }
      if (suggestions.length === 0) {
        suggestions.push('You meet most requirements for this role!');
      }
      roleResults[roleResults.length - 1].suggestions = suggestions;
    });

    // Sort missing skills by potential impact (highest weight first)
    allMissing.sort((a, b) => b.weight - a.weight);

    // Generate overall recommendations
    const overallRecommendations = [];
    const coreMissingCount = allMissing.filter(m => m.category === 'core').length;
    const desiredMissingCount = allMissing.filter(m => m.category === 'desired').length;

    if (coreMissingCount > 0) {
      overallRecommendations.push(`Add ${coreMissingCount} core skill${coreMissingCount > 1 ? 's' : ''} for maximum impact`);
    }
    if (desiredMissingCount > 0) {
      overallRecommendations.push(`Consider adding ${desiredMissingCount} desired skill${desiredMissingCount > 1 ? 's' : ''} for role flexibility`);
    }

    // Find the best matching role (highest score)
    const bestRole = roleResults.reduce((best, current) => (current.score > best.score ? current : best), { role: '', score: -1 });

    return {
      roleResults,
      allMissing,
      overallRecommendations,
      bestRole,
      skillCount: skills.length,
      hardSkillCount: hard.length,
      softSkillCount: soft.length,
      projectCount: projs.length
    };
  }

  function skillsGapClass(score) {
    if (score >= 80) return 'skills-gap-excellent';
    if (score >= 70) return 'skills-gap-good';
    if (score >= 60) return 'skills-gap-fair';
    if (score >= 50) return 'skills-gap-poor';
    return 'skills-gap-failing';
  }

  function skillsGapGrade(score) {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  return { THEMES, get, expOf, eduOf, certOf, resumeURL, docBody, sectionHTML, fullDoc, esc, computeATSScore, atsScoreClass, atsGradeClass, computeSkillsGap, skillsGapClass, skillsGapGrade };
})();