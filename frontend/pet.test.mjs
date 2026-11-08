import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Desktop companion pet configuration & assets', () => {
  const spritePath = path.join(rootDir, 'frontend', 'assets', 'pet-goku.webp');
  assert.ok(fs.existsSync(spritePath), 'frontend/assets/pet-goku.webp must exist');
  const spriteStats = fs.statSync(spritePath);
  assert.ok(spriteStats.size > 500000, `pet-goku.webp should be a valid sprite sheet (found ${spriteStats.size} bytes)`);

  const petJs = fs.readFileSync(path.join(rootDir, 'frontend', 'pet.js'), 'utf8');
  assert.ok(petJs.includes("sheet: '/assets/pet-goku.webp'"), 'pet.js must reference local /assets/pet-goku.webp');
  assert.ok(petJs.includes("referrerPolicy = 'no-referrer'"), 'pet.js must use no-referrer policy to prevent hotlink blocks');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('pet.css'), 'index.html must load pet.css');
  assert.ok(indexHtml.includes('src="pet.js"'), 'index.html must include pet.js script tag');

  const workerJs = fs.readFileSync(path.join(rootDir, 'backend', 'worker.js'), 'utf8');
  assert.ok(workerJs.includes("url.pathname === '/pet.js'"), 'worker.js must proxy /pet.js');
  assert.ok(workerJs.includes("url.pathname === '/pet.css'"), 'worker.js must proxy /pet.css');
  assert.ok(workerJs.includes("url.pathname.startsWith('/assets/')"), 'worker.js must proxy /assets/');
});
