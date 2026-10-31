import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const TEMPLATES_JS = fs.readFileSync(path.resolve('frontend/templates.js'), 'utf8');
const STYLE_CSS = fs.readFileSync(path.resolve('frontend/style.css'), 'utf8');
const TEMPLATES_CSS = fs.readFileSync(path.resolve('frontend/templates.css'), 'utf8');
const WORKER_JS = fs.readFileSync(path.resolve('backend/worker.js'), 'utf8');
const SUPABASE_CONFIG = fs.readFileSync(path.resolve('backend/supabase-config.js'), 'utf8');
const INDEX_HTML = fs.readFileSync(path.resolve('frontend/index.html'), 'utf8');
const APP_JS = fs.readFileSync(path.resolve('frontend/app.js'), 'utf8');

test('Visual Themes: PortfoolioTemplates has all 13 visual themes', () => {
  const domMock = {
    document: {
      getElementById: () => ({ innerHTML: '' }),
      body: { dataset: {}, classList: { toggle: () => {}, add: () => {}, remove: () => {} } },
      title: ''
    },
    window: { scrollTo: () => {} },
    location: { origin: 'https://portfoolio.me' },
    TEMPLATES: []
  };
  domMock.window.document = domMock.document;
  const ctx = vm.createContext(domMock);
  vm.runInContext(TEMPLATES_JS, ctx);

  const visualThemes = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom', 'motion', 'atelier', 'cinema', 'arch', 'zine', 'zen', 'desire'];
  for (const t of visualThemes) {
    assert.strictEqual(typeof domMock.window.PortfoolioTemplates[t], 'function', `PortfoolioTemplates[${t}] must be a function`);
  }
});

test('Visual Themes: all 6 new themes render custom navigation, header and footer', () => {
  const newThemes = ['atelier', 'cinema', 'arch', 'zine', 'zen', 'desire'];
  for (const t of newThemes) {
    let capturedHtml = '';
    const domMock = {
      document: {
        getElementById: () => ({
          set innerHTML(val) { capturedHtml = val; },
          get innerHTML() { return capturedHtml; }
        }),
        body: { dataset: {}, classList: { toggle: () => {}, add: () => {}, remove: () => {} } },
        title: ''
      },
      window: { scrollTo: () => {} },
      location: { origin: 'https://portfoolio.me' },
      TEMPLATES: []
    };
    domMock.window.document = domMock.document;
    const ctx = vm.createContext(domMock);
    vm.runInContext(TEMPLATES_JS, ctx);

    const fn = domMock.window.PortfoolioTemplates[t];
    assert.ok(fn, `Template ${t} exists`);
    fn({
      name: 'Test Artist',
      title: 'Visual Specialist',
      email: 'artist@test.com',
      works: [
        { title: 'Artwork 1', imageUrl: 'https://example.com/1.jpg', category: 'Fine Art' }
      ]
    });

    assert.ok(capturedHtml.includes(`${t}-nav`), `${t} must include custom navbar .${t}-nav`);
    assert.ok(capturedHtml.includes(`${t}-foot`), `${t} must include custom footer .${t}-foot`);
    assert.ok(capturedHtml.includes('Test Artist'), `${t} must include profile name`);
  }
});

test('CSS: styling fixes for newly added non-technical visual themes', () => {
  for (const css of [STYLE_CSS, TEMPLATES_CSS]) {
    assert.ok(css.includes('.atelier-card.atelier-wide'), 'CSS must define .atelier-card.atelier-wide span rule');
    assert.ok(css.includes('.gal-atelier-head .atelier-meta'), 'CSS must isolate .gal-atelier-head .atelier-meta from card meta');
    assert.ok(css.includes('.zen-card.zen-stagger:hover'), 'CSS must smooth zen staggered hover jump');
    assert.ok(css.includes('text-decoration: none;'), 'CSS must remove logo text underlines');
    assert.ok(css.includes('@media (max-width: 640px)'), 'CSS must have mobile media queries');
  }
});

test('Track healing & detection across backend and studio', () => {
  const visualThemes = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom', 'motion', 'atelier', 'cinema', 'arch', 'zine', 'zen', 'desire'];
  for (const t of visualThemes) {
    // Check supabase-config.js
    assert.ok(SUPABASE_CONFIG.includes(t), `supabase-config.js must include ${t}`);
    // Check worker.js
    assert.ok(WORKER_JS.includes(t), `worker.js must include ${t}`);
    // Check paintTrackTabs in index.html
    assert.ok(INDEX_HTML.includes(t), `index.html must include ${t}`);
    // Check app.js
    assert.ok(APP_JS.includes(t), `app.js must include ${t}`);
  }
});

test('Google Fonts includes Fraunces 400 weight', () => {
  assert.ok(INDEX_HTML.includes('Fraunces:opsz,wght@9..144,400'), 'index.html must include Fraunces 400');
  assert.ok(APP_JS.includes('Fraunces:opsz,wght@9..144,400'), 'app.js iframe must include Fraunces 400');
  assert.ok(WORKER_JS.includes('Fraunces:opsz,wght@9..144,400'), 'worker.js head must include Fraunces 400');
});

test('IntersectionObserver observes all new visual theme elements', () => {
  assert.ok(APP_JS.includes('.atelier-card, .cinema-card, .arch-plate, .zine-tile, .zen-card, .desire-card'), 'app.js IO must observe new theme cards');
  assert.ok(WORKER_JS.includes('.atelier-card, .cinema-card, .arch-plate, .zine-tile, .zen-card, .desire-card'), 'worker.js IO must observe new theme cards');
});

test('All themes filter label is updated to 28', () => {
  assert.ok(INDEX_HTML.includes('All Themes (28)'), 'index.html filter button must say All Themes (28)');
  assert.ok(INDEX_HTML.includes('28 handcrafted themes'), 'index.html kicker must say 28 handcrafted themes');
});

test('Desire theme renders creator case studies and dynamic focus skills', () => {
  let capturedHtml = '';
  const domMock = {
    document: {
      getElementById: () => ({
        set innerHTML(val) { capturedHtml = val; },
        get innerHTML() { return capturedHtml; }
      }),
      body: { dataset: {}, classList: { toggle: () => {}, add: () => {}, remove: () => {} } },
      title: ''
    },
    window: { scrollTo: () => {} },
    location: { origin: 'https://portfoolio.me' },
    TEMPLATES: []
  };
  domMock.window.document = domMock.document;
  const ctx = vm.createContext(domMock);
  vm.runInContext(TEMPLATES_JS, ctx);

  const desireFn = domMock.window.PortfoolioTemplates.desire;
  assert.ok(desireFn, 'desire template must exist');
  desireFn({
    name: 'Neeraj K R',
    title: 'Design Technologist',
    location: 'Bangalore, India',
    skills: ['Figma Mastery', 'Creative Coding', 'Design Ops'],
    projects: [
      { title: 'Interactive Aura', technologies: ['Canvas API', 'WebGL'] }
    ]
  });

  assert.ok(capturedHtml.includes('Specialized Focus Areas'), 'desire must render Specialized Focus Areas');
  assert.ok(capturedHtml.includes('Interactive Aura'), 'desire must render real project case study');
  assert.ok(capturedHtml.includes('Figma Mastery'), 'desire must render dynamic creator skills');
  assert.ok(!capturedHtml.includes('From $10,000'), 'desire must not have hardcoded agency pricing');
});

