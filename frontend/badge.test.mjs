import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('GitHub Profile README Badge Generator in Share & Links tab', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'index.html'), 'utf8');

  // DOM Elements in tabShare
  assert.ok(indexHtml.includes('id="badgeStylePicker"'), 'Must have badge style picker in tabShare');
  assert.ok(indexHtml.includes('id="shareBadgePreviewImg"'), 'Must have live preview badge image');
  assert.ok(indexHtml.includes('id="shareBadgePreviewLink"'), 'Must have live preview badge link');
  assert.ok(indexHtml.includes('id="shareBadgeMarkdown"'), 'Must have Markdown input field');
  assert.ok(indexHtml.includes('id="shareCopyBadgeMd"'), 'Must have copy markdown button');
  assert.ok(indexHtml.includes('id="shareCopyBadgeHtml"'), 'Must have copy HTML button');
  assert.ok(indexHtml.includes('id="shareCopyBadgeUrl"'), 'Must have copy URL button');

  // Badge styles supported
  assert.ok(indexHtml.includes('data-badge="purple"'), 'Must support purple for-the-badge');
  assert.ok(indexHtml.includes('data-badge="cyan"'), 'Must support cyan style');
  assert.ok(indexHtml.includes('data-badge="flat"'), 'Must support flat style');
  assert.ok(indexHtml.includes('data-badge="goku"'), 'Must support goku style');

  // Logic & Script
  assert.ok(indexHtml.includes('setupBadgeGenerator'), 'Must define setupBadgeGenerator');
  assert.ok(indexHtml.includes('img.shields.io/badge/Portfoolio-Live-7c3aed'), 'Must default to requested 7c3aed purple badge');
  assert.ok(indexHtml.includes('style=for-the-badge'), 'Must use for-the-badge style');
  assert.ok(indexHtml.includes('logo=googlechrome'), 'Must include googlechrome logo');

  // Worker route
  const workerJs = fs.readFileSync(path.join(rootDir, 'backend', 'worker.js'), 'utf8');
  assert.ok(workerJs.includes("url.pathname === '/badge.svg'"), 'worker.js must support /badge.svg endpoint');
});

