import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';

// Mock browser globals for theme-catalog import
global.window = global;
import '../frontend/theme-catalog.js';

describe('Theme Showcase & Live Stage Tests', () => {
  const catalog = global.PortfoolioThemeCatalog;

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
  
  it('#themeLiveStage markup exists in index.html with all chrome controls', () => {
    const html = fs.readFileSync('frontend/index.html', 'utf8');
    assert(html.includes('id="themeLiveStage"'), 'index.html must have #themeLiveStage');
    assert(html.includes('id="themeLiveIframe"'), 'index.html must have #themeLiveIframe');
    assert(html.includes('id="stageDeviceSwitcher"'), 'index.html must have device switcher');
    assert(html.includes('data-device="desktop"'), 'index.html must have desktop button');
    assert(html.includes('data-device="tablet"'), 'index.html must have tablet button');
    assert(html.includes('data-device="mobile"'), 'index.html must have mobile button');
    assert(html.includes('id="stageRefreshBtn"'), 'index.html must have refresh button');
    assert(html.includes('id="stageExternalBtn"'), 'index.html must have external preview button');
    assert(html.includes('id="stageFullscreenBtn"'), 'index.html must have fullscreen button');
  });

});

  it('theme-catalog query and search helpers work accurately', () => {
    const techOnly = catalog.getThemesByTrack('tech');
    assert(techOnly.length >= 20, 'Expected >= 20 tech themes');
    assert(techOnly.every(t => t.track === 'tech'));

    const searchResults = catalog.searchThemes('terminal');
    assert(searchResults.some(t => t.id === 'terminal'));
  });
});
