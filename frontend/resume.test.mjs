/* Resume & ATS Score Analyzer tests. Run: node frontend/resume.test.mjs
 * Exit 0 = pass. Dependency-free node:assert checks. */
import assert from 'node:assert/strict';
import R from './resume.js';

const {
  computeATSScore,
  atsScoreClass,
  atsGradeClass,
  computeSkillsGap,
  skillsGapClass,
  skillsGapGrade,
  resumeURL,
  docBody,
  fullDoc,
  get,
} = R;

// 1. Basic properties and defaults
assert.equal(typeof computeATSScore, 'function');
assert.equal(typeof computeSkillsGap, 'function');

// 2. Empty profile
const emptyProfile = { username: 'testuser' };
const emptyScore = computeATSScore(emptyProfile);
assert.ok(emptyScore.score >= 20, 'Formatting alone provides baseline score');
assert.equal(emptyScore.sectionScore, 0);
assert.ok(emptyScore.feedback.suggestions.length > 0);
assert.ok(emptyScore.grade === 'F' || emptyScore.grade === 'D');
assert.equal(atsScoreClass(emptyScore.score), emptyScore.score >= 50 ? 'ats-poor' : 'ats-failing');

// 3. Fully fleshed profile
const fullProfile = {
  username: 'neeraj-k-r',
  name: 'Neeraj K R',
  title: 'Full-Stack Developer',
  tagline: 'Building high-performance web systems and AI tools.',
  email: 'neeraj@example.com',
  phone: '+91 9876543210',
  location: 'Kochi, India',
  github: 'https://github.com/neerajkr',
  linkedin: 'https://linkedin.com/in/neerajkr',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL', 'Git', 'Leadership'],
  projects: [
    { title: 'Project A', technologies: ['React', 'Node.js', 'PostgreSQL'], url: 'https://github.com/a' },
    { title: 'Project B', technologies: ['Python', 'Docker', 'AWS'], url: 'https://github.com/b' },
  ],
  experience: [
    { role: 'Software Engineer', company: 'Acme Corp', start: '2024', end: 'Present', current: true, desc: 'Built resilient microservices' },
  ],
  education: [
    { school: 'CUSAT', degree: 'B.Tech', field: 'Computer Science', start: '2020', end: '2024' },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2024' },
  ],
  resume: {
    theme: 'ats',
    summary: 'Full-stack software engineer with 3+ years of experience designing scalable applications.',
  },
};

const fullScore = computeATSScore(fullProfile);
assert.ok(fullScore.score >= 80, `Expected score >= 80, got ${fullScore.score}`);
assert.equal(fullScore.sectionScore, 34, 'All sections present = 34 pts');
assert.equal(fullScore.formattingScore, 20, 'Single column, readable fonts = 20 pts');
assert.ok(fullScore.keywordScore >= 30, 'Keywords detected from skills and projects');
assert.ok(['A', 'A+'].includes(fullScore.grade), `Expected A or A+, got ${fullScore.grade}`);
assert.equal(atsGradeClass(fullScore.grade), 'ats-excellent');

// 4. Skills Gap Analysis
const gap = computeSkillsGap(fullProfile);
assert.ok(gap.roleResults.length > 0, 'Returns role results');
assert.ok(gap.bestRole.score > 50, 'Best role has reasonable match');
assert.ok(gap.bestRole.role, 'Best role has title');
assert.equal(typeof skillsGapClass(gap.bestRole.score), 'string');
assert.equal(typeof skillsGapGrade(gap.bestRole.score), 'string');
assert.equal(typeof gap.skillsGapClass, 'function', 'gap.skillsGapClass is exposed as function');
assert.equal(typeof gap.skillsGapGrade, 'function', 'gap.skillsGapGrade is exposed as function');
assert.equal(typeof gap.gradeClass, 'string', 'gap.gradeClass is precalculated');
assert.equal(typeof gap.gradeText, 'string', 'gap.gradeText is precalculated');
assert.equal(typeof fullScore.scoreClass, 'string', 'fullScore.scoreClass is precalculated');
assert.equal(typeof fullScore.gradeClass, 'string', 'fullScore.gradeClass is precalculated');

// 5. Resume URL generation
assert.equal(resumeURL(''), '#');
assert.equal(resumeURL('neeraj-k-r'), '/?u=neeraj-k-r&resume=1');

// 6. Resume HTML generation
const bodyHtml = docBody(fullProfile);
assert.ok(bodyHtml.includes('Neeraj K R'));
assert.ok(bodyHtml.includes('Professional Summary'));
assert.ok(bodyHtml.includes('Experience'));
assert.ok(bodyHtml.includes('Education'));
assert.ok(bodyHtml.includes('Technical Skills'));

const pageDoc = fullDoc(fullProfile);
assert.ok(pageDoc.includes('<!DOCTYPE html>'));
assert.ok(pageDoc.includes('rs-page rs-ats'));

console.log('resume & ATS score tests: PASS (all assertions passed)');
