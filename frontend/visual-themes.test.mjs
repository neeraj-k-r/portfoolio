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

test('Visual Themes: PortfoolioTemplates has all 26 visual themes', () => {
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

  const visualThemes = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom', 'motion', 'atelier', 'cinema', 'arch', 'zine', 'zen', 'desire', 'lumina', 'vogue', 'filmstrip', 'biennale', 'pavilion', 'documenta', 'triennale', 'sketchbook', 'salon', 'illustra', 'techno', 'analog', 'mythos', 'suki', 'lo'];
  for (const t of visualThemes) {
    assert.strictEqual(typeof domMock.window.PortfoolioTemplates[t], 'function', `PortfoolioTemplates[${t}] must be a function`);
  }
});

test('Visual Themes: all 10 new themes render custom navigation, header and footer', () => {
  const newThemes = ['atelier', 'cinema', 'arch', 'zine', 'zen', 'desire', 'lumina', 'vogue', 'filmstrip'];
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
  const visualThemes = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom', 'motion', 'atelier', 'cinema', 'arch', 'zine', 'zen', 'desire', 'lumina', 'vogue', 'filmstrip', 'biennale', 'pavilion', 'documenta', 'triennale', 'sketchbook', 'salon', 'illustra', 'techno', 'analog'];
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
  assert.ok(APP_JS.includes('.atelier-card, .cinema-card, .arch-plate, .zine-tile, .zen-card, .desire-card, .lumina-card, .vogue-plate, .filmstrip-frame'), 'app.js IO must observe new theme cards');
  assert.ok(WORKER_JS.includes('.atelier-card, .cinema-card, .arch-plate, .zine-tile, .zen-card, .desire-card, .lumina-card, .vogue-plate, .filmstrip-frame'), 'worker.js IO must observe new theme cards');
});

test('All themes filter label is updated to 31', () => {
  assert.ok(INDEX_HTML.includes('All Themes (31)'), 'index.html filter button must say All Themes (31)');
  assert.ok(INDEX_HTML.includes('31 handcrafted themes'), 'index.html kicker must say 31 handcrafted themes');
});

test('Visual Themes: routing preserves visual themes and provides project fallbacks', () => {
  const visualThemes = ['gallery', 'studio', 'noir', 'museum', 'catalog', 'bloom', 'motion', 'atelier', 'cinema', 'arch', 'zine', 'zen', 'desire', 'lumina', 'vogue', 'filmstrip', 'biennale', 'pavilion', 'documenta', 'triennale', 'sketchbook', 'salon', 'illustra', 'techno', 'analog'];
  
  // Test worker page() delegation to pageGallery
  const sandbox = {
    console,
    Response: class { constructor(b, i) { this.body = b; this.init = i; } },
    URL, Math, Date, Array, Object, String, parseInt, isNaN, encodeURIComponent, decodeURIComponent
  };
  const ctx = vm.createContext(sandbox);
  const codeBeforeExport = WORKER_JS.slice(0, WORKER_JS.indexOf('export default'));
  vm.runInContext(codeBeforeExport, ctx);

  for (const t of visualThemes) {
    const p = {
      username: 'artisan',
      name: 'Artisan Dev',
      title: 'Digital Creator',
      template: t,
      track: 'tech', // Note: even if legacy profile says tech
      projects: [{ title: 'Featured Build', desc: 'Crafted web experience', url: 'https://example.com' }],
      works: []
    };
    const url = new URL(`https://artisan.portfoolio.me/`);
    const html = sandbox.page(p, url);
    assert.ok(html.includes(`data-template="${t}"`), `Worker page() must render data-template="${t}"`);
    assert.ok(!html.includes('data-template="midnight"'), `Worker page() must not reset ${t} to midnight`);
    assert.ok(html.includes('Featured Build'), `Worker pageGallery must fall back to projects when works is empty`);
  }
});

test('Desire theme renders clean hero with creator name and bio, and removes focus areas', () => {
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
    title: 'Aspiring Developer',
    location: 'Kerala, India',
    bio: 'Crafting clean web architectures and creative software solutions.',
    works: [
      { title: 'Interactive Aura', imageUrl: 'https://example.com/1.jpg', category: 'Creative Tech' }
    ]
  });

  assert.ok(capturedHtml.includes('<h1 class="desire-title">Neeraj K R</h1>'), 'desire must render creator name as title');
  assert.ok(capturedHtml.includes('Aspiring Developer'), 'desire must render creator title in loupe');
  assert.ok(capturedHtml.includes('Featured Work'), 'desire must render Featured Work(s) instead of Case Studies');
  assert.ok(!capturedHtml.includes('Case Studies'), 'desire must not contain Case Studies');
  assert.ok(capturedHtml.includes('Kerala, India'), 'desire must render creator location');
  assert.ok(capturedHtml.includes('Crafting clean web architectures'), 'desire must render creator bio');
  assert.ok(!capturedHtml.includes('Specialized Focus Areas'), 'desire must have removed Specialized Focus Areas section');
  assert.ok(!capturedHtml.includes('From $10,000'), 'desire must not have hardcoded agency pricing');
  assert.ok(!capturedHtml.includes('Creating digital experiences with'), 'desire must not have fake agency slogan');
  assert.ok(!capturedHtml.includes('desire-tags-row'), 'desire must not render dummy tags row');
});

test('Techno theme renders creative technology hero, categories, and dynamic archive', () => {
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

  const technoFn = domMock.window.PortfoolioTemplates.techno;
  assert.ok(technoFn, 'techno template must exist');
  technoFn({
    name: 'Ada Lovelace',
    title: 'Creative Technologist',
    bio: 'Pioneering algorithmic art and computational design.',
    works: [
      { title: 'Generative Engine', imageUrl: 'https://example.com/gen.jpg', category: 'Generative Art' }
    ]
  });

  assert.ok(capturedHtml.includes('techno-nav'), 'techno must render custom navbar');
  assert.ok(capturedHtml.includes('ADA LOVELACE'), 'techno must render uppercase artist name');
  assert.ok(capturedHtml.includes('techno-hero-title') && capturedHtml.includes('CREATIVE') && capturedHtml.includes('TECHNOLOGY'), 'techno must render display hero title');
  assert.ok(capturedHtml.includes('Currently Exploring'), 'techno must render exploration ticker');
  assert.ok(capturedHtml.includes('Open for Collaborations'), 'techno must render collaboration badge');
  assert.ok(capturedHtml.includes('Generative Engine'), 'techno must render user artwork in archive');
});

test('Analog theme renders dark vintage desk collage, sidebar nav, and work cards', () => {
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

  const analogFn = domMock.window.PortfoolioTemplates.analog;
  assert.ok(analogFn, 'analog template must exist');
  analogFn({
    name: 'Nithin Krishna',
    title: 'Creative Technologist',
    bio: 'Blending design, art, and technology to build meaningful digital experiences.',
    works: [
      { title: 'Interactive Aura', imageUrl: 'https://example.com/1.jpg', category: 'Creative Tech' }
    ]
  });

  assert.ok(capturedHtml.includes('analog-sidebar'), 'analog must render sidebar');
  assert.ok(capturedHtml.includes('analog-monogram'), 'analog must render monogram');
  assert.ok(capturedHtml.includes('Design') && capturedHtml.includes('Innovation'), 'analog must render hero title');
  assert.ok(capturedHtml.includes('Available for Collaboration'), 'analog must render collaboration pill');
  assert.ok(capturedHtml.includes('analog-collage-stage'), 'analog must render visual collage stage');
  assert.ok(capturedHtml.includes('Interactive Aura'), 'analog must render user work');
  assert.ok(capturedHtml.includes('Also Exploring'), 'analog must render Also Exploring skills bar');
});

test('Mythos theme renders classical sculpture hero, celestial moon, categories, and dynamic archive', () => {
  let capturedHtml = '';
  const domMock = {
    document: {
      getElementById: () => ({
        set innerHTML(val) { capturedHtml = val; },
        get innerHTML() { return capturedHtml; }
      }),
      body: { dataset: {}, classList: { toggle: () => {}, add: () => {}, remove: () => {} } },
      title: '',
      addEventListener: () => {}
    },
    window: { scrollTo: () => {} },
    location: { origin: 'https://portfoolio.me' },
    TEMPLATES: []
  };
  domMock.window.document = domMock.document;
  const ctx = vm.createContext(domMock);
  vm.runInContext(TEMPLATES_JS, ctx);

  const mythosFn = domMock.window.PortfoolioTemplates.mythos;
  assert.ok(mythosFn, 'mythos template must exist');
  mythosFn({
    name: 'Nithin Krishna',
    title: 'Creative Engineer',
    bio: 'A showcase of my creative work, digital builds, visual explorations, and curious experiments.',
    skills: ['React', 'TypeScript', 'Firebase', 'Tailwind', 'Figma', 'Blender'],
    works: [
      { title: 'Interactive Sculptures', imageUrl: 'https://example.com/art.jpg', category: 'Creative Tech' }
    ]
  });

  assert.ok(capturedHtml.includes('mythos-monogram'), 'mythos must render monogram');
  assert.ok(capturedHtml.includes('Ideas, Design') && capturedHtml.includes('Experiments'), 'mythos must render hero title');
  assert.ok(capturedHtml.includes('mythos-celestial-moon'), 'mythos must render celestial moon');
  assert.ok(capturedHtml.includes('mythos-sculpture-wrapper'), 'mythos must render marble sculpture');
  assert.ok(capturedHtml.includes('mythos-lily-botanical'), 'mythos must render white lily');
  assert.ok(capturedHtml.includes('mythos-petunia-branch'), 'mythos must render petunia branch');
  assert.ok(capturedHtml.includes('mythos-cloud-card'), 'mythos must render dusk cloud card');
  assert.ok(capturedHtml.includes('mythos-cards-grid'), 'mythos must render 4-card interactive grid');
  assert.ok(capturedHtml.includes('Tech &amp; Tools'), 'mythos must render tech and tools bar');
  assert.ok(capturedHtml.includes('Interactive Sculptures'), 'mythos must render user work');
  assert.ok(capturedHtml.includes('Always exploring new possibilities'), 'mythos must render sparkle footer');

  // Verify dynamic cards mapping with user projects (not hardcoded)
  mythosFn({
    name: 'NKR User',
    projects: [
      { title: 'Minimalist Village Market Route', category: 'Creative Tech', imageUrl: 'https://example.com/p1.jpg' },
      { title: 'naalukavaladisc', category: 'Creative Tech', imageUrl: 'https://example.com/p2.jpg' },
      { title: 'GROCERY IMAGE', category: 'Creative Tech', imageUrl: 'https://example.com/p3.jpg' },
      { title: 'BANGLE2', category: 'Creative Tech', imageUrl: 'https://example.com/p4.jpg' }
    ]
  });
  assert.ok(capturedHtml.includes('Minimalist Village Market Route'), 'card 1 must dynamically render first project');
  assert.ok(capturedHtml.includes('naalukavaladisc'), 'card 2 must dynamically render second project');
  assert.ok(capturedHtml.includes('GROCERY IMAGE'), 'card 3 must dynamically render third project');
  assert.ok(capturedHtml.includes('BANGLE2'), 'card 4 must dynamically render fourth project');
  assert.ok(!capturedHtml.includes('Playground'), 'hardcoded Playground card must be removed');
});

test('Suki theme renders cyber video hero, grid, services, and dynamic projects', () => {
  let capturedHtml = '';
  const domMock = {
    window: { PortfoolioTemplates: {} },
    document: {
      body: { dataset: {}, classList: { remove() {} } },
      title: '',
      getElementById: (id) => ({
        set innerHTML(val) { capturedHtml = val; }
      })
    }
  };
  domMock.window.document = domMock.document;
  const ctx = vm.createContext(domMock);
  vm.runInContext(TEMPLATES_JS, ctx);

  const sukiFn = domMock.window.PortfoolioTemplates.suki;
  assert.ok(sukiFn, 'suki template must exist in PortfoolioTemplates');
  sukiFn({
    name: 'Suki Cinema',
    title: 'Video Editor & Motion Designer',
    bio: 'Cinematic edits, commercials and motion graphics built to make people stop scrolling.',
    skills: ['Video Editing', 'Motion Design', 'Automotive', 'Commercial'],
    works: [
      { title: 'Automotive Showcase', category: 'automotive', imageUrl: 'https://example.com/car.jpg' },
      { title: 'Brand Commercial', category: 'commercial', imageUrl: 'https://example.com/brand.jpg' }
    ]
  });

  assert.ok(capturedHtml.includes('suki-brand'), 'suki must render brand logo');
  assert.ok(capturedHtml.includes('suki-hero-title'), 'suki must render hero title');
  assert.ok(capturedHtml.includes('suki-cyber-grid'), 'suki must render cyber grid');
  assert.ok(capturedHtml.includes('suki-project-grid'), 'suki must render project grid');
  assert.ok(capturedHtml.includes('Automotive Showcase'), 'suki must dynamically render user project');
  assert.ok(capturedHtml.includes('Built for'), 'suki must render services section');
  assert.ok(capturedHtml.includes('suki-marquee'), 'suki must render marquee ticker');
  assert.ok(capturedHtml.includes('Have a project?'), 'suki must render contact section');
  assert.ok(!capturedHtml.includes('DOTAE'), 'suki must not contain hardcoded DOTAE');

  // Verify single-word username doesn't generate DOTAE fallback
  sukiFn({
    name: 'nkr3037',
    title: 'Creative Technologist'
  });
  assert.ok(capturedHtml.includes('NKR3037'), 'suki must render single word name');
  assert.ok(!capturedHtml.includes('DOTAE'), 'suki single-word name must never render DOTAE');
});

test('Lo theme renders brand, narrative hero, zero-gap art grid, and studio story', () => {
  let capturedHtml = '';
  const domMock = {
    window: { PortfoolioTemplates: {} },
    document: {
      body: { dataset: {}, classList: { remove() {} } },
      title: '',
      getElementById: (id) => ({
        set innerHTML(val) { capturedHtml = val; }
      })
    }
  };
  domMock.window.document = domMock.document;
  const ctx = vm.createContext(domMock);
  vm.runInContext(TEMPLATES_JS, ctx);

  const loFn = domMock.window.PortfoolioTemplates.lo;
  assert.ok(loFn, 'lo template must exist in PortfoolioTemplates');
  loFn({
    name: 'Artist Called Lo',
    title: 'Multidisciplinary Artist & Maker',
    bio: 'Creating tactile, colorful worlds that spark joy, provoke curiosity, and refuse to be boring.',
    skills: ['Fine Art', 'Illustration', 'Brand Identity', 'Packaging'],
    works: [
      { title: 'Cosmic Botanical', category: 'art', imageUrl: 'https://example.com/botanical.jpg' },
      { title: 'Neon Nostalgia', category: 'design', imageUrl: 'https://example.com/neon.jpg' }
    ]
  });

  assert.ok(capturedHtml.includes('lo-brand'), 'lo must render brand logo');
  assert.ok(capturedHtml.includes('lo-hero-title'), 'lo must render hero headline');
  assert.ok(capturedHtml.includes('lo-trust-ribbon'), 'lo must render trust ribbon');
  assert.ok(capturedHtml.includes('lo-art-grid'), 'lo must render art grid');
  assert.ok(capturedHtml.includes('Cosmic Botanical'), 'lo must dynamically render user artwork');
  assert.ok(capturedHtml.includes('03 / STUDIO PRACTICE'), 'lo must render studio services section');
  assert.ok(capturedHtml.includes('04 / PRINT EDITIONS'), 'lo must render shop editions section');
  assert.ok(capturedHtml.includes('Have a wild vision?'), 'lo must render contact section');
});
