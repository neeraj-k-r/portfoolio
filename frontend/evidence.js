/* portfoolio.me — Proof of Work evidence engine (pure, no DOM, no network).
 * Data model (§11): NO new tables. Skills = profile.skills[]; projects carry
 * optional technologies[], repo{} (presence = retrieved from GitHub), demoUrl.
 * Skill ↔ Project is derived, never stored twice (§12: manage info once).
 * Honesty rules: counts only from available data; "GitHub Verified" means
 * "repository retrieved from GitHub", never a skill endorsement.
 * Usable in browser (window.PortfoolioEvidence) and node (module.exports).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PortfoolioEvidence = api;
})(typeof self !== 'undefined' ? self : this, function () {
  function norm(s) { return String(s || '').trim().toLowerCase(); }
  function displayName(s) { return String(s || '').trim(); }

  function projectTechs(pr) {
    const out = [], seen = new Set();
    (pr.technologies || []).concat(pr.tags || []).forEach((t) => {
      const k = norm(t);
      if (k && k !== 'fork' && !seen.has(k)) { seen.add(k); out.push(displayName(t)); }
    });
    return out;
  }

  function lastUsedOf(projects) {
    let best = null;
    projects.forEach((pr) => {
      const d = pr.repo && pr.repo.updatedAt ? new Date(pr.repo.updatedAt) : null;
      if (d && !isNaN(d) && (!best || d > best)) best = d;
    });
    return best ? best.toISOString().slice(0, 7) : null; // YYYY-MM
  }

  // buildEvidence(profile) -> { skills: [{name, projects:[{title,url}], repoCount, liveCount, lastUsed}], totals }
  function buildEvidence(profile) {
    const p = profile || {};
    const projects = Array.isArray(p.projects) ? p.projects : [];
    const declared = (Array.isArray(p.skills) ? p.skills : []).map(displayName).filter(Boolean);
    const map = new Map(); // key -> {name, projects[], repoCount, liveCount, dates[]}
    function ensure(name) {
      const k = norm(name);
      if (!k) return null;
      if (!map.has(k)) map.set(k, { name: displayName(name), projects: [], repoCount: 0, liveCount: 0 });
      return map.get(k);
    }
    declared.forEach((s) => ensure(s));
    projects.forEach((pr) => {
      const techs = projectTechs(pr);
      const entry = { title: pr.title || 'Untitled', url: pr.url || '#' };
      techs.forEach((t) => {
        const e = ensure(t);
        if (e && !e.projects.some((x) => x.title === entry.title && x.url === entry.url)) {
          e.projects.push(entry);
          if (pr.repo) e.repoCount += 1;
          if (pr.demoUrl) e.liveCount += 1;
        }
      });
    });
    const skills = Array.from(map.values()).map((e) => ({
      name: e.name, projects: e.projects, repoCount: e.repoCount, liveCount: e.liveCount,
      lastUsed: lastUsedOf(projects.filter((pr) => projectTechs(pr).some((t) => norm(t) === norm(e.name)))),
    }));
    skills.sort((a, b) => b.projects.length - a.projects.length || a.name.localeCompare(b.name));
    return {
      skills,
      totals: {
        skillsTotal: skills.length,
        skillsWithEvidence: skills.filter((s) => s.projects.length > 0).length,
        projectsTotal: projects.length,
        projectsWithGithub: projects.filter((pr) => !!pr.repo).length,
        projectsWithDemo: projects.filter((pr) => !!pr.demoUrl).length,
      },
    };
  }

  // Actionable, non-judgmental suggestions (§9)
  function suggestions(profile, ev) {
    ev = ev || buildEvidence(profile);
    const out = [];
    const noTech = (profile.projects || []).filter((pr) => projectTechs(pr).length === 0).length;
    const noGh = ev.totals.projectsTotal - ev.totals.projectsWithGithub;
    const noDemo = ev.totals.projectsTotal - ev.totals.projectsWithDemo;
    const bare = ev.skills.filter((s) => s.projects.length === 0).length;
    if (noTech > 0) out.push(`Add technologies to ${noTech} project${noTech > 1 ? 's' : ''}.`);
    if (noGh > 0) out.push(`Connect ${noGh} more project${noGh > 1 ? 's' : ''} to GitHub.`);
    if (noDemo > 0) out.push(`Add a live demo to ${noDemo} project${noDemo > 1 ? 's' : ''}.`);
    if (bare > 0) out.push(`${bare} skill${bare > 1 ? 's have' : ' has'} no project evidence yet — tag a project to link it.`);
    return out;
  }

  return { norm, projectTechs, buildEvidence, suggestions, lastUsedOf };
});
