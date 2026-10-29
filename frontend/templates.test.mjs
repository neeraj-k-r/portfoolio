import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Mock minimal DOM environment for templates.js
const mockDom = {
  document: {
    body: { dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } } },
    title: '',
    getElementById(id) {
      if (!this._elements) this._elements = {};
      if (!this._elements[id]) {
        this._elements[id] = {
          id,
          innerHTML: '',
          textContent: '',
          style: {},
          classList: { add() {}, remove() {}, toggle() {} },
          addEventListener() {},
          appendChild() {},
          getContext() {
            return {
              clearRect() {}, beginPath() {}, arc() {}, fill() {}, moveTo() {}, lineTo() {}, stroke() {}
            };
          }
        };
      }
      return this._elements[id];
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    createElement(tag) {
      return {
        tagName: tag,
        className: '',
        innerHTML: '',
        textContent: '',
        style: {},
        classList: { add() {}, remove() {}, toggle() {} },
        appendChild() {},
        addEventListener() {}
      };
    }
  },
  window: {
    scrollTo() {},
    addEventListener() {},
    location: { href: '', search: '' },
    matchMedia() { return { matches: false }; },
    requestAnimationFrame(cb) { return setTimeout(cb, 16); }
  },
  requestAnimationFrame(cb) { return setTimeout(cb, 16); },
  setTimeout,
  clearTimeout,
  console
};
mockDom.window.document = mockDom.document;

const code = fs.readFileSync(new URL('./templates.js', import.meta.url), 'utf8');
const context = vm.createContext(mockDom);
vm.runInContext(code, context);

const { PortfoolioTemplates, PortfoolioTemplateList } = context.window;

assert.ok(Array.isArray(PortfoolioTemplateList), 'PortfoolioTemplateList must be an array');
assert.ok(typeof PortfoolioTemplates === 'object', 'PortfoolioTemplates must be an object');

const newTemplateIds = ['nova', 'codeflow', 'wave', 'assistant', 'console', 'snowcard', 'parchment', 'cloud', 'github', 'particle', 'panels', 'monolith', 'editor', 'magazine', 'bold', 'clean', 'vibrant', 'neon', 'hacker', 'atelier', 'cinema', 'arch', 'zine', 'zen'];

for (const id of newTemplateIds) {
  const meta = PortfoolioTemplateList.find(t => t.id === id);
  assert.ok(meta, `Template metadata for "${id}" must exist in PortfoolioTemplateList`);
  assert.ok(typeof PortfoolioTemplates[id] === 'function', `PortfoolioTemplates["${id}"] must be a function`);
}

// Test rendering sample profile with each template
const sampleProfile = {
  name: 'Alex Dev',
  username: 'alexdev',
  title: 'Full Stack Engineer',
  tagline: 'Building the next generation of web software.',
  bio: 'Experienced developer specializing in scalable distributed web systems.',
  location: 'San Francisco, CA',
  email: 'alex@example.com',
  github: 'https://github.com/alexdev',
  linkedin: 'https://linkedin.com/in/alexdev',
  skills: ['TypeScript', 'Node.js', 'React', 'Python', 'Cloudflare Workers', 'PostgreSQL'],
  projects: [
    {
      title: 'Distributed Cache',
      desc: 'High throughput in-memory cache system.',
      url: 'https://github.com/alexdev/cache',
      demoUrl: 'https://cache.example.com',
      technologies: ['Go', 'Redis', 'Docker']
    }
  ],
  experience: [
    {
      role: 'Senior Developer',
      company: 'Tech Corp',
      year: '2023 - Present',
      desc: 'Leading engineering on distributed web platform.',
      bullets: ['Improved throughput by 40%', 'Designed event-driven pipeline']
    }
  ]
};

for (const id of newTemplateIds) {
  // Reset app container
  const appEl = context.document.getElementById('app');
  appEl.innerHTML = '';
  
  // Render
  PortfoolioTemplates[id](sampleProfile);
  
  // Validate dataset.template
  assert.equal(context.document.body.dataset.template, id, `document.body.dataset.template should be "${id}"`);
  
  // Validate that app element received content
  assert.ok(appEl.innerHTML.length > 50, `Template "${id}" should render HTML into #app`);
  assert.ok(appEl.innerHTML.includes('Alex Dev'), `Template "${id}" HTML should include candidate name`);
  
  // Ensure no TailorCV branding exists
  assert.ok(!/tailorcv/i.test(appEl.innerHTML), `Template "${id}" HTML must NOT include TailorCV branding`);
  
  console.log(`✓ Template "${id}" rendered cleanly and passed all assertions`);
}

console.log('\nAll 19 reverse engineered templates passed unit tests successfully!');
process.exit(0);
