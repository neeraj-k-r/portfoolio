/* portfoolio.me — resume builder (auto-built from profile info)
   Data: name/title/tagline/contact + skills + experience[] + education[] + projects[] + certifications[]
   Theme: profile.resume.theme — 'ats' (default, recruiter/ATS clean) | 'modern' | 'midnight' | 'terminal'
   Old profiles without experience/education/resume still render (empty states everywhere). */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PortfoolioResume = api;
})(typeof self !== 'undefined' ? self : this, () => {
  const THEMES = [
    { id: 'ats', name: 'ATS Clean', desc: 'Black on white, parser-safe, standard headings', emoji: '📄', best: 'Job applications' },
    { id: 'modern', name: 'Modern', desc: 'Light card, soft + clean', emoji: '✨', best: 'General use' },
    { id: 'midnight', name: 'Midnight', desc: 'Dark neon, on-brand', emoji: '🌌', best: 'Match portfolio' },
    { id: 'terminal', name: 'Terminal', desc: 'Mono green, dev cred', emoji: '💻', best: 'Backend • OSS' },
    // Additional professional resume themes
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
  function resumeURL(username) {
    if (!username) return '#';
    try {
      if (typeof location !== 'undefined' && location.hostname && location.hostname.endsWith('portfoolio.me')) {
        return `https://${encodeURIComponent(username)}.portfoolio.me/resume`;
      }
    } catch {}
    return `/?u=${encodeURIComponent(username)}&resume=1`;
  }

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
      scoreClass: atsScoreClass(score),
      gradeClass: atsGradeClass(grade),
      atsScoreClass,
      atsGradeClass,
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
      icon: '💻',
      core: ['javascript', 'python', 'java', 'c++', 'git', 'sql'],
      desired: ['react', 'node.js', 'docker', 'kubernetes', 'aws', 'rest api'],
      niceToHave: ['typescript', 'machine learning', 'graphql', 'microservices'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'frontend engineer': {
      title: 'Frontend Engineer',
      icon: '⚡',
      core: ['html', 'css', 'javascript', 'react', 'typescript'],
      desired: ['next.js', 'redux', 'tailwind', 'vue.js', 'vite', 'rest api'],
      niceToHave: ['graphql', 'progressive web apps', 'accessibility (a11y)', 'testing'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'backend engineer': {
      title: 'Backend Engineer',
      icon: '🛠️',
      core: ['python', 'node.js', 'sql', 'postgresql', 'rest api', 'git'],
      desired: ['docker', 'redis', 'microservices', 'aws', 'mongodb', 'graphql'],
      niceToHave: ['kubernetes', 'ci/cd', 'system design', 'go', 'kafka'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'full stack engineer': {
      title: 'Full Stack Engineer',
      icon: '🌐',
      core: ['javascript', 'typescript', 'react', 'node.js', 'sql', 'git'],
      desired: ['next.js', 'docker', 'aws', 'rest api', 'postgresql', 'tailwind'],
      niceToHave: ['graphql', 'microservices', 'ci/cd', 'redis', 'python'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'senior software engineer': {
      title: 'Senior Software Engineer',
      icon: '👔',
      core: ['system design', 'architecture', 'git', 'sql', 'microservices', 'leadership'],
      desired: ['kubernetes', 'docker', 'aws', 'ci/cd', 'performance optimization'],
      niceToHave: ['distributed systems', 'kafka', 'terraform', 'mentorship'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'devops engineer': {
      title: 'DevOps & Cloud Engineer',
      icon: '☁️',
      core: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'git'],
      desired: ['terraform', 'ansible', 'monitoring', 'bash', 'prometheus'],
      niceToHave: ['grafana', 'helm', 'python', 'security', 'gcp'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'ai ml engineer': {
      title: 'AI / ML Engineer',
      icon: '🤖',
      core: ['python', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'math'],
      desired: ['llms', 'nlp', 'scikit-learn', 'data analysis', 'numpy', 'pandas'],
      niceToHave: ['huggingface', 'vector dbs', 'docker', 'mlops', 'langchain'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'data scientist': {
      title: 'Data Scientist & Analyst',
      icon: '📊',
      core: ['python', 'statistics', 'machine learning', 'data analysis', 'sql'],
      desired: ['pandas', 'numpy', 'scikit-learn', 'data visualization', 'tableau'],
      niceToHave: ['tensorflow', 'r', 'power bi', 'aws', 'bigquery'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'mobile developer': {
      title: 'Mobile App Developer',
      icon: '📱',
      core: ['react native', 'flutter', 'javascript', 'mobile development', 'git'],
      desired: ['typescript', 'swift', 'kotlin', 'rest api', 'ios', 'android'],
      niceToHave: ['graphql', 'firebase', 'app store deployment', 'state management'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'cloud architect': {
      title: 'Cloud Solutions Architect',
      icon: '🏛️',
      core: ['aws', 'cloud architecture', 'system design', 'security', 'networking'],
      desired: ['kubernetes', 'docker', 'terraform', 'microservices', 'azure'],
      niceToHave: ['gcp', 'disaster recovery', 'cost optimization', 'ci/cd'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    },
    'ui ux designer': {
      title: 'UI/UX & Product Designer',
      icon: '🎨',
      core: ['figma', 'ui design', 'ux research', 'wireframing', 'prototyping'],
      desired: ['design systems', 'user testing', 'interaction design', 'html', 'css'],
      niceToHave: ['information architecture', 'adobe xd', 'typography', 'accessibility (a11y)'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'product manager': {
      title: 'Technical Product Manager',
      icon: '🎯',
      core: ['product strategy', 'roadmapping', 'analytics', 'stakeholder management', 'agile'],
      desired: ['jira', 'sql', 'A/B testing', 'user research', 'user stories'],
      niceToHave: ['python', 'data analysis', 'market research', 'scrum'],
      weightCore: 4, weightDesired: 3, weightNice: 1
    },
    'cybersecurity analyst': {
      title: 'Cybersecurity Analyst',
      icon: '🔒',
      core: ['network security', 'cybersecurity', 'vulnerability assessment', 'linux', 'siem'],
      desired: ['incident response', 'penetration testing', 'firewalls', 'owasp', 'python'],
      niceToHave: ['cryptography', 'wireshark', 'compliance', 'cloud security'],
      weightCore: 5, weightDesired: 4, weightNice: 2
    }
  };

  function checkSkillMatch(skillName, userSkillsSet, userSkillsList) {
    const s = String(skillName).trim().toLowerCase();
    if (userSkillsSet.has(s)) return true;
    for (let i = 0; i < userSkillsList.length; i++) {
      const u = userSkillsList[i];
      if (u === s) return true;
      if (s.length >= 3 && (u.includes(s) || s.includes(u))) return true;
      if ((s === 'k8s' && u === 'kubernetes') || (s === 'kubernetes' && u === 'k8s')) return true;
      if ((s === 'js' && u === 'javascript') || (s === 'javascript' && (u === 'js' || u === 'vanilla js'))) return true;
      if ((s === 'ts' && u === 'typescript') || (s === 'typescript' && u === 'ts')) return true;
      if (s === 'node.js' && (u === 'node' || u === 'nodejs')) return true;
      if (s === 'react' && (u === 'reactjs' || u === 'react.js')) return true;
      if (s === 'vue.js' && (u === 'vue' || u === 'vuejs')) return true;
      if (s === 'next.js' && (u === 'nextjs' || u === 'next')) return true;
      if (s === 'rest api' && (u === 'rest' || u === 'apis' || u === 'api' || u === 'restful')) return true;
      if (s === 'ci/cd' && (u === 'cicd' || u === 'continuous integration')) return true;
      if (s === 'machine learning' && (u === 'ml' || u === 'ai/ml')) return true;
      if (s === 'deep learning' && (u === 'dl' || u === 'neural networks')) return true;
    }
    return false;
  }

  function computeSkillsGap(p, targetRoleKey = null) {
    const r = get(p);
    const skills = (p.skills || []).filter(Boolean);
    const { hard, soft } = splitSkills(skills);
    const projs = (p.projects || []).slice(0, 6);

    // Build user skill set and list (lowercased)
    const userSkillsSet = new Set();
    const userSkillsList = [];
    const addSkill = (s) => {
      if (!s) return;
      const str = String(s).trim().toLowerCase();
      if (!str) return;
      userSkillsSet.add(str);
      if (!userSkillsList.includes(str)) userSkillsList.push(str);
    };

    skills.forEach(addSkill);
    hard.forEach(addSkill);
    soft.forEach(addSkill);

    // Also add project technologies
    projs.forEach(pr => {
      const t = techsOf(pr);
      t.forEach(addSkill);
    });

    const activeRoleKey = (targetRoleKey || (p.resume && p.resume.targetRole) || 'auto').trim().toLowerCase();

    // Evaluate against each role
    const roleResults = [];
    const allMissing = [];

    Object.entries(roleSkillRequirements).forEach(([roleKey, role]) => {
      let score = 0;
      const matchedCore = [], missingCore = [];
      const matchedDesired = [], missingDesired = [];
      const matchedNice = [], missingNice = [];
      const roleMissing = [];

      // Check core skills
      role.core.forEach(coreSkill => {
        if (checkSkillMatch(coreSkill, userSkillsSet, userSkillsList)) {
          matchedCore.push(coreSkill);
          score += role.weightCore;
        } else {
          missingCore.push(coreSkill);
          const item = { role: role.title, category: 'core', skill: coreSkill, weight: role.weightCore };
          roleMissing.push(item);
          allMissing.push(item);
        }
      });

      // Check desired skills
      role.desired.forEach(desiredSkill => {
        if (checkSkillMatch(desiredSkill, userSkillsSet, userSkillsList)) {
          matchedDesired.push(desiredSkill);
          score += role.weightDesired;
        } else {
          missingDesired.push(desiredSkill);
          const item = { role: role.title, category: 'desired', skill: desiredSkill, weight: role.weightDesired };
          roleMissing.push(item);
          allMissing.push(item);
        }
      });

      // Check nice-to-have skills
      role.niceToHave.forEach(niceSkill => {
        if (checkSkillMatch(niceSkill, userSkillsSet, userSkillsList)) {
          matchedNice.push(niceSkill);
          score += role.weightNice;
        } else {
          missingNice.push(niceSkill);
          const item = { role: role.title, category: 'nice', skill: niceSkill, weight: role.weightNice };
          roleMissing.push(item);
          allMissing.push(item);
        }
      });

      // Cap score at 100 and compute percentage
      const maxPossible = role.core.length * role.weightCore + role.desired.length * role.weightDesired + role.niceToHave.length * role.weightNice;
      const normalizedScore = Math.min(100, score);
      const pct = Math.round((normalizedScore / Math.max(1, maxPossible)) * 100);

      // Suggestions for this role
      const suggestions = [];
      if (missingCore.length > 0) {
        suggestions.push(`Priority: Add ${missingCore.length} core skill${missingCore.length > 1 ? 's' : ''} (${missingCore.slice(0, 3).join(', ')})`);
      }
      if (missingDesired.length > 0) {
        suggestions.push(`Recommended: Add ${missingDesired.length} desired skill${missingDesired.length > 1 ? 's' : ''} (${missingDesired.slice(0, 3).join(', ')})`);
      }
      if (missingNice.length > 0) {
        suggestions.push(`Bonus: Add nice-to-have skill${missingNice.length > 1 ? 's' : ''} (${missingNice.slice(0, 2).join(', ')})`);
      }
      if (suggestions.length === 0) {
        suggestions.push('You meet 100% of the benchmark requirements for this role!');
      }

      roleResults.push({
        key: roleKey,
        role: role.title,
        icon: role.icon || '💼',
        core: { found: matchedCore.length, total: role.core.length, missing: missingCore.length, matchedList: matchedCore, missingList: missingCore },
        desired: { found: matchedDesired.length, total: role.desired.length, missing: missingDesired.length, matchedList: matchedDesired, missingList: missingDesired },
        niceToHave: { found: matchedNice.length, total: role.niceToHave.length, missing: missingNice.length, matchedList: matchedNice, missingList: missingNice },
        allRoleMissing: roleMissing.sort((a, b) => b.weight - a.weight),
        score: pct,
        rawScore: normalizedScore,
        maxScore: 100,
        grade: pct >= 85 ? 'A+' : pct >= 75 ? 'A' : pct >= 65 ? 'B' : pct >= 50 ? 'C' : 'D',
        gradeClass: skillsGapClass(pct),
        pct,
        suggestions
      });
    });

    // Sort missing skills by potential impact (highest weight first)
    allMissing.sort((a, b) => b.weight - a.weight);

    // Find the best matching role (highest score)
    const bestRole = roleResults.reduce((best, current) => (current.score > best.score ? current : best), roleResults[0] || { role: '', score: -1, pct: 0 });

    // Determine selected role based on targetRoleKey
    let selectedRole = null;
    if (activeRoleKey && activeRoleKey !== 'auto') {
      selectedRole = roleResults.find(r => r.key === activeRoleKey || r.role.toLowerCase() === activeRoleKey || r.key.replace(/\s+/g, '') === activeRoleKey.replace(/\s+/g, ''));
    }
    if (!selectedRole) {
      selectedRole = bestRole;
    }

    const targetMissing = selectedRole.allRoleMissing || [];
    const targetMatched = [...(selectedRole.core.matchedList || []), ...(selectedRole.desired.matchedList || [])];

    // Generate overall recommendations for the selected role
    const overallRecommendations = [...selectedRole.suggestions];

    return {
      roleResults,
      allMissing,
      overallRecommendations,
      bestRole,
      selectedRole,
      targetRoleKey: (selectedRole && activeRoleKey !== 'auto') ? selectedRole.key : 'auto',
      targetMissing,
      targetMatched,
      availableRoles: roleResults.map(r => ({
        key: r.key,
        title: r.role,
        icon: r.icon,
        score: r.score,
        grade: r.grade,
        gradeClass: r.gradeClass
      })),
      gradeClass: skillsGapClass(selectedRole.score),
      gradeText: skillsGapGrade(selectedRole.score),
      skillsGapClass,
      skillsGapGrade,
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

  return { THEMES, get, expOf, eduOf, certOf, resumeURL, docBody, sectionHTML, fullDoc, esc, computeATSScore, atsScoreClass, atsGradeClass, computeSkillsGap, skillsGapClass, skillsGapGrade, roleSkillRequirements };
});