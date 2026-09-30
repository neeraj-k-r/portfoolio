/* LinkedIn paste-import tests. Run: node frontend/linkedin-import.test.mjs (exit 0 = pass).
 * NOTE: this repo has no test runner; these are dependency-free node:assert checks. */
import assert from 'node:assert/strict';
import pkg from './linkedin-import.js';
const { parseLinkedInText, parseRange } = pkg;

// date ranges
assert.deepEqual(parseRange('Jun 2024 - Present'), { start: 'Jun 2024', end: '', current: true });
assert.deepEqual(parseRange('Jan 2020 – Dec 2021'), { start: 'Jan 2020', end: 'Dec 2021', current: false });
assert.equal(parseRange('Full-time'), null);

// guided format: labels + entries
const guided = parseLinkedInText(`Headline: Full-Stack Developer
Location: Kerala, India
Skills: React, Node.js, React
Frontend Intern @ Acme | Jun 2024 - Present
- shipped dashboard
- cut load time

CUSAT | B.Tech, Computer Science | 2022 - 2026`);
assert.equal(guided.title, 'Full-Stack Developer');
assert.equal(guided.location, 'Kerala, India');
assert.deepEqual(guided.skills, ['React', 'Node.js']);
assert.equal(guided.experience.length, 1);
assert.deepEqual(
  ((e) => [e.role, e.company, e.start, e.current, e.desc])(guided.experience[0]),
  ['Frontend Intern', 'Acme', 'Jun 2024', true, 'shipped dashboard\ncut load time'],
);
assert.equal(guided.education.length, 1);
assert.deepEqual(
  ((e) => [e.school, e.degree, e.field, e.start, e.end])(guided.education[0]),
  ['CUSAT', 'B.Tech', 'Computer Science', '2022', '2026'],
);

// LinkedIn-ish paste with section headings, no blank lines between entries
const pasted = parseLinkedInText(`Aspiring Software Engineer
Open to work
Experience
Frontend Intern
Acme · Full-time
Jun 2024 - Present · 1 yr
Kerala
Built dashboards with React
Backend Intern
Beta LLC
Jan 2023 - May 2024
Wrote APIs
Education
CUSAT
B.Tech, Computer Science
2022 - 2026`);
assert.equal(pasted.title, 'Aspiring Software Engineer');
assert.equal(pasted.experience.length, 2);
assert.equal(pasted.experience[0].role, 'Frontend Intern');
assert.equal(pasted.experience[0].company, 'Acme · Full-time');
assert.equal(pasted.experience[0].current, true);
assert.equal(pasted.experience[1].company, 'Beta LLC');
assert.equal(pasted.experience[1].end, 'May 2024');
assert.equal(pasted.education.length, 1);
assert.equal(pasted.education[0].school, 'CUSAT');

// empty + garbage never throw, never invent entries
assert.deepEqual(parseLinkedInText(''), { title: '', tagline: '', location: '', skills: [], summary: '', experience: [], education: [] });
assert.deepEqual(parseLinkedInText('hello world').experience, []);

console.log('linkedin-import: all assertions passed');
