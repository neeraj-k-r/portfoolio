/* Proof-of-Work tests. Run: node frontend/evidence.test.mjs (exit 0 = pass).
 * NOTE: this repo has no test runner; these are dependency-free node:assert checks. */
import assert from 'node:assert/strict';
import pkg from './evidence.js';
const { buildEvidence, suggestions, projectTechs } = pkg;

const P = {
  username: 't', skills: ['React', 'Node.js', 'Python'],
  projects: [
    { title: 'Campus Bridge', url: '#1', technologies: ['React', 'Node.js', 'PostgreSQL'], tags: ['JavaScript'],
      demoUrl: 'https://demo/1', repo: { fullName: 'u/cb', updatedAt: '2026-09-10T00:00:00Z' } },
    { title: 'Events App', url: '#2', technologies: ['react'], tags: ['React'],
      repo: { fullName: 'u/ev', updatedAt: '2026-08-01T00:00:00Z' } },
    { title: 'Old Script', url: '#3', tags: ['Fork'] },
  ],
};

// merge + dedupe + Fork excluded
assert.deepEqual(projectTechs(P.projects[1]), ['react']);
assert.deepEqual(projectTechs(P.projects[2]), []);

// per-skill derivation
const ev = buildEvidence(P);
const react = ev.skills.find((s) => s.name === 'React');
assert.equal(react.projects.length, 2);
assert.equal(react.repoCount, 2);
assert.equal(react.liveCount, 1);
assert.equal(react.lastUsed, '2026-09');
const node = ev.skills.find((s) => s.name === 'Node.js');
assert.equal(node.projects.length, 1);
assert.equal(node.liveCount, 1);
// tag-only tech becomes evidence too (PostgreSQL via technologies, JavaScript via tags)
assert.ok(ev.skills.some((s) => s.name === 'PostgreSQL' && s.projects.length === 1));
assert.ok(ev.skills.some((s) => s.name === 'JavaScript' && s.projects.length === 1));
// declared-but-unused skill stays visible with zero evidence
const py = ev.skills.find((s) => s.name === 'Python');
assert.equal(py.projects.length, 0);

// totals
assert.deepEqual(ev.totals, { skillsTotal: 5, skillsWithEvidence: 4, projectsTotal: 3, projectsWithGithub: 2, projectsWithDemo: 1 });

// suggestions are actionable and non-empty here
const sug = suggestions(P, ev);
assert.ok(sug.some((s) => s.includes('1 project') && s.includes('technologies')));
assert.ok(sug.some((s) => s.includes('GitHub')));

// deleting a project drops its evidence
const P2 = { ...P, projects: P.projects.slice(0, 2) };
assert.equal(buildEvidence(P2).skills.find((s) => s.name === 'React').projects.length, 2);
const P3 = { ...P, projects: [] };
assert.equal(buildEvidence(P3).totals.projectsTotal, 0);
assert.deepEqual(suggestions(P3), ['3 skills have no project evidence yet — tag a project to link it.']);

// empty profile: safe empty states, no crashes
const E = buildEvidence({ username: 'x' });
assert.deepEqual(E.totals, { skillsTotal: 0, skillsWithEvidence: 0, projectsTotal: 0, projectsWithGithub: 0, projectsWithDemo: 0 });

console.log('evidence tests: PASS (10 checks)');
