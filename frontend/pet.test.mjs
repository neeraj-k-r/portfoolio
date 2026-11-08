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
  assert.ok(petJs.includes('PORTFOOLIO_PET_GREETING'), 'pet.js must support custom greeting');
  assert.ok(petJs.includes('say: say'), 'pet.js must expose say function');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('pet.css'), 'index.html must load pet.css');
  assert.ok(indexHtml.includes('src="pet.js"'), 'index.html must include pet.js script tag');

  const workerJs = fs.readFileSync(path.join(rootDir, 'backend', 'worker.js'), 'utf8');
  assert.ok(workerJs.includes("url.pathname === '/pet.js'"), 'worker.js must proxy /pet.js');
  assert.ok(workerJs.includes("url.pathname === '/pet.css'"), 'worker.js must proxy /pet.css');
  assert.ok(workerJs.includes("url.pathname.startsWith('/assets/')"), 'worker.js must proxy /assets/');
});

test('Studio options for users to add companion pet to live sites', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'index.html'), 'utf8');

  // Sidebar navigation and studio tabs
  assert.ok(indexHtml.includes("switchUserTab('pet')"), 'Studio navigation must have a tab for Companion Pet');
  assert.ok(indexHtml.includes('id="tabPet"'), 'Studio must contain #tabPet card pane');
  assert.ok(indexHtml.includes('id="edShowPet"'), 'Studio must have #edShowPet checkbox for live site activation');
  assert.ok(indexHtml.includes('id="edShowPetTheme"'), 'Theme & Skills tab must have quick companion toggle #edShowPetTheme');
  assert.ok(indexHtml.includes('id="edPetGreeting"'), 'Studio must have #edPetGreeting input for custom greetings');
  assert.ok(indexHtml.includes('id="edSavePetBtn"'), 'Studio must have #edSavePetBtn');
  assert.ok(indexHtml.includes('updatePetPreviewStatus'), 'Studio must have updatePetPreviewStatus helper');

  // Schema & database synchronization
  const schemaSql = fs.readFileSync(path.join(rootDir, 'backend', 'supabase-schema.sql'), 'utf8');
  assert.ok(schemaSql.includes('show_pet boolean'), 'supabase-schema.sql must define show_pet column');
  assert.ok(schemaSql.includes('pet_greeting text'), 'supabase-schema.sql must define pet_greeting column');

  const supabaseConfig = fs.readFileSync(path.join(rootDir, 'backend', 'supabase-config.js'), 'utf8');
  assert.ok(supabaseConfig.includes('show_pet'), 'supabase-config.js must sync show_pet');
  assert.ok(supabaseConfig.includes('pet_greeting'), 'supabase-config.js must sync pet_greeting');

  // App router synchronization
  const appJs = fs.readFileSync(path.join(rootDir, 'frontend', 'app.js'), 'utf8');
  assert.ok(appJs.includes('syncCompanionPet'), 'app.js must have syncCompanionPet helper');
  assert.ok(appJs.includes('showPet'), 'app.js must normalize showPet');

  // Cloudflare worker live injection
  const workerJs = fs.readFileSync(path.join(rootDir, 'backend', 'worker.js'), 'utf8');
  assert.ok(workerJs.includes('injectPet'), 'worker.js must have injectPet function');
  assert.ok(workerJs.includes('prof.show_pet'), 'worker.js must check show_pet before injecting companion');
  assert.ok(workerJs.includes('PORTFOOLIO_PET_GREETING'), 'worker.js must inject greeting script');

  // Singleton guard to prevent duplicate pets
  const petJs = fs.readFileSync(path.join(rootDir, 'frontend', 'pet.js'), 'utf8');
  assert.ok(petJs.includes('__ClawdexPetLoaded'), 'pet.js must have singleton guard to prevent duplicate pets');
  assert.ok(!indexHtml.includes('</script>') || indexHtml.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi).every(b => {
    try {
      new Function(b.replace(/<\/?script[^>]*>/gi, ''));
      return true;
    } catch { return false; }
  }), 'index.html inline scripts must compile without premature </script> tags');
});
