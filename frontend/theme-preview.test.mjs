import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';

const newThemes = ['nova', 'codeflow', 'wave', 'assistant', 'console', 'snowcard', 'parchment', 'cloud', 'github', 'particle', 'panels', 'monolith', 'editor', 'magazine', 'bold', 'clean', 'vibrant', 'neon'];

describe('Theme Preview Features & Mockups', () => {
  const styleCss = fs.readFileSync('frontend/style.css', 'utf8');
  const templatesCss = fs.readFileSync('frontend/templates.css', 'utf8');
  const appJs = fs.readFileSync('frontend/app.js', 'utf8');
  const indexHtml = fs.readFileSync('frontend/index.html', 'utf8');

  it('all 18 new themes have .lx-tp mini browser mockup CSS in style.css and templates.css', () => {
    for (const t of newThemes) {
      assert(styleCss.includes(`.lx-tp-${t}`), `style.css must have .lx-tp-${t}`);
      assert(templatesCss.includes(`.lx-tp-${t}`), `templates.css must have .lx-tp-${t}`);
    }
  });

  it('all 18 new themes have modalPresets in app.js and window.openThemePreviewModal is exposed', () => {
    for (const t of newThemes) {
      assert(appJs.includes(`${t}:`), `app.js modalPresets must define preset for ${t}`);
    }
    assert(appJs.includes('window.openThemePreviewModal = openModal;'), 'window.openThemePreviewModal must be exposed');
  });

  it('all 18 new themes have .lx-modal-body styling in style.css', () => {
    for (const t of newThemes) {
      assert(styleCss.includes(`.lx-modal-body[data-theme="${t}"]`), `style.css must have .lx-modal-body for ${t}`);
    }
  });

  it('all 18 new themes have lx-theme-card showcase buttons in index.html', () => {
    for (const t of newThemes) {
      assert(indexHtml.includes(`data-theme="${t}"`), `index.html showcase must include ${t}`);
    }
  });

  it('all 18 new themes have footer-theme-btn in #themeModal in index.html', () => {
    for (const t of newThemes) {
      assert(indexHtml.includes(`class="footer-theme-btn" data-theme="${t}"`), `index.html themeModal must include button for ${t}`);
    }
  });

  it('Studio theme tab has #edPreviewThemeBtn and click handler in index.html', () => {
    assert(indexHtml.includes('id="edPreviewThemeBtn"'), 'Studio must have #edPreviewThemeBtn');
    assert(indexHtml.includes("$('edPreviewThemeBtn').onclick"), 'index.html must wire #edPreviewThemeBtn click handler');
  });

  it('paintThemeThumbs attaches preview eye button', () => {
    assert(indexHtml.includes('tpl-preview-eye'), 'paintThemeThumbs must inject .tpl-preview-eye button');
    assert(styleCss.includes('.tpl-preview-eye'), 'style.css must style .tpl-preview-eye');
  });
});
