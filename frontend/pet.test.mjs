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
  assert.ok(petJs.includes('/assets/pet-goku.webp'), 'pet.js must reference local /assets/pet-goku.webp');
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
  assert.ok(workerJs.includes('show_pet,pet_greeting') || workerJs.includes('show_pet') && workerJs.includes('pet_greeting'), 'worker.js getProfile must query show_pet and pet_greeting columns from Supabase');

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

test('Pokémon Section & Petdex Companions catalog integration', async () => {
  const petsModule = await import('./pets-data.js');
  const PETS = petsModule.PET_REGISTRY || petsModule.default;

  // Verify Pokémon Section
  assert.ok(PETS.giratina, 'Giratina must exist in registry');
  assert.ok(PETS.gardevoir, 'Gardevoir must exist in registry');
  assert.ok(PETS.kabi, 'Snorlax (kabi) must exist in registry');
  assert.ok(PETS.capvolt, 'Captain Pikachu (capvolt) must exist in registry');

  assert.equal(PETS.giratina.category, 'pokemon');
  assert.equal(PETS.gardevoir.category, 'pokemon');
  assert.equal(PETS.kabi.category, 'pokemon');
  assert.equal(PETS.capvolt.category, 'pokemon');

  // Verify Anime / Classic Companions
  assert.ok(PETS.goku, 'Goku must exist in registry');
  assert.ok(PETS.boba, 'Boba must exist in registry');
  assert.ok(PETS['goose-default'], 'Untitled Goose must exist in registry');
  assert.ok(PETS['kaka-2'], 'Kaka Star must exist in registry');

  assert.equal(PETS.goku.category, 'anime');
  assert.equal(PETS.boba.category, 'anime');
  assert.equal(PETS['goose-default'].category, 'anime');
  assert.equal(PETS['kaka-2'].category, 'anime');

  // Verify One Piece Theme & Straw Hat Crew Section
  const onePiecePets = ['luffy-gear-5-chibi', 'robin', 'smoke-kick'];
  for (const opId of onePiecePets) {
    assert.ok(PETS[opId], `One piece pet ${opId} must exist in PET_REGISTRY`);
    assert.equal(PETS[opId].category, 'onepiece', `${opId} must be in onepiece category`);
    assert.ok(PETS[opId].badge, `${opId} must have badge`);
    assert.ok(PETS[opId].sheet.includes(opId), `${opId} sheet must point to /assets/pets/${opId}/spritesheet.webp`);
  }

  // Verify Anime Heroes Collection (https://petdex.dev/collections/anime-heroes)
  const animeHeroes = ['luffy', 'zoro', 'naruto', 'itachi', 'gojo', 'sukuna', 'goku-blue', 'nezuko', 'kyojuro-rengoku', 'gon', 'killua', 'sabo'];
  for (const hId of animeHeroes) {
    assert.ok(PETS[hId], `Anime hero ${hId} must exist in PET_REGISTRY`);
    assert.equal(PETS[hId].category, 'anime-heroes', `${hId} must be in anime-heroes category`);
    assert.ok(PETS[hId].badge, `${hId} must have badge`);
    assert.ok(PETS[hId].sheet.includes(hId), `${hId} sheet must point to /assets/pets/${hId}/spritesheet.webp`);
  }

  // Verify assets exist on disk for all pets
  for (const [id, pet] of Object.entries(PETS)) {
    const assetRelPath = pet.sheet.replace(/^\//, '');
    const fullAssetPath = path.join(rootDir, 'frontend', assetRelPath.replace(/^assets\//, 'assets/'));
    assert.ok(fs.existsSync(fullAssetPath), `Spritesheet for ${id} must exist at ${fullAssetPath}`);
    assert.ok(Array.isArray(pet.messages) && pet.messages.length > 0, `${id} must have soundbite messages`);
    assert.ok(pet.defaultGreeting, `${id} must have a default greeting`);
  }

  // Verify Studio UI elements
  const indexHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('id="pokemonPetsGrid"'), 'index.html must have #pokemonPetsGrid container');
  assert.ok(indexHtml.includes('id="onePiecePetsGrid"'), 'index.html must have #onePiecePetsGrid container');
  assert.ok(indexHtml.includes('id="animePetsGrid"'), 'index.html must have #animePetsGrid container');
  assert.ok(indexHtml.includes('id="animeHeroesGrid"'), 'index.html must have #animeHeroesGrid container');
  assert.ok(indexHtml.includes('petdex.dev/collections/anime-heroes'), 'index.html must link to anime-heroes collection');
  assert.ok(indexHtml.includes('id="edPetType"'), 'index.html must have #edPetType input');
  assert.ok(indexHtml.includes('paintPetStudioGrids'), 'index.html must define paintPetStudioGrids');
  assert.ok(indexHtml.includes('selectStudioPet'), 'index.html must define selectStudioPet');

  // Verify Worker support
  const workerJs = fs.readFileSync(path.join(rootDir, 'backend', 'worker.js'), 'utf8');
  assert.ok(workerJs.includes('pet_type'), 'worker.js must select pet_type from database');
  assert.ok(workerJs.includes('PORTFOOLIO_PET_TYPE'), 'worker.js must inject PORTFOOLIO_PET_TYPE');
  assert.ok(workerJs.includes('/pets-data.js'), 'worker.js must serve and inject /pets-data.js');
});
