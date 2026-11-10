import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const catalog = require('./theme-catalog.js');

describe('Theme Showcase Dribbble Grid Tests', () => {
  it('theme-catalog exports all 40 themes with rich metadata', () => {
    assert(catalog, 'PortfoolioThemeCatalog must be defined');
    const all = catalog.getAllThemes();
    assert(all.length >= 40, `Expected at least 40 themes, found ${all.length}`);
    for (const t of all) {
      assert(t.id, 'Theme must have an id');
      assert(t.title, 'Theme must have a title');
      assert(t.track === 'tech' || t.track === 'visual', 'Track must be tech or visual');
      assert(t.author && t.author.name, 'Theme must have author attribution');
      assert(typeof t.likes === 'number', 'Theme must have likes count');
      assert(Array.isArray(t.tags), 'Theme must have tags array');
    }
  });

  it('Dribbble showcase filter bar, category pills, and search input exist in index.html', () => {
    const html = fs.readFileSync('frontend/index.html', 'utf8');
    assert(html.includes('class="theme-showcase-header"'), 'index.html must have .theme-showcase-header');
    assert(html.includes('id="themeSearchInput"'), 'index.html must have #themeSearchInput');
    assert(html.includes('id="themeFilterPills"'), 'index.html must have #themeFilterPills');
    assert(html.includes('data-filter="all"'), 'index.html must have All filter pill');
    assert(html.includes('data-filter="tech"'), 'index.html must have Tech filter pill');
    assert(html.includes('data-filter="visual"'), 'index.html must have Visual filter pill');
  });

  it('Dribbble theme cards have author avatars, PRO badges, and like buttons in CSS and JS', () => {
    const css = fs.readFileSync('frontend/style.css', 'utf8');
    assert(css.includes('.dribbble-theme-card'), 'style.css must define .dribbble-theme-card');
    assert(css.includes('.dribbble-badge-pro'), 'style.css must define .dribbble-badge-pro');
    assert(css.includes('.theme-card-like-btn'), 'style.css must define .theme-card-like-btn');
    assert(css.includes('.dribbble-card-viewport'), 'style.css must define .dribbble-card-viewport');
    assert(css.includes('.dribbble-card-footer'), 'style.css must define .dribbble-card-footer');
    assert(css.includes('.dribbble-theme-card .tpl-meta'), 'style.css must hide .tpl-meta in .dribbble-theme-card');
  });

  it('cards render live theme iframe previews with dynamic scaling and midnight support', () => {
    const html = fs.readFileSync('frontend/index.html', 'utf8');
    const tpl = fs.readFileSync('frontend/templates.js', 'utf8');
    assert(html.includes('dribbble-shot-live-iframe'), 'index.html must include .dribbble-shot-live-iframe');
    assert(html.includes('dribbble-shot-scale-frame'), 'index.html must include .dribbble-shot-scale-frame');
    assert(tpl.includes('midnight: renderMidnight'), 'templates.js must export midnight in PortfoolioTemplates');
  });

  it('theme-catalog query and search helpers work accurately', () => {
    const techOnly = catalog.getThemesByTrack('tech');
    assert(techOnly.length >= 20, 'Expected >= 20 tech themes');
    assert(techOnly.every(t => t.track === 'tech'));

    const searchResults = catalog.searchThemes('terminal');
    assert(searchResults.some(t => t.id === 'terminal'));

    const darkResults = catalog.searchThemes('', 'dark');
    assert(darkResults.length >= 15, 'Expected dark themes');
  });
});
