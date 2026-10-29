import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Auth state synchronization and configuration tests', async (t) => {
  const indexHtml = fs.readFileSync('frontend/index.html', 'utf8');
  const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
  const workerJs = fs.readFileSync('backend/worker.js', 'utf8');
  const uiCss = fs.readFileSync('frontend/ui.css', 'utf8');

  await t.test('All #auth nav and CTA links call setAuthMode', () => {
    // Both desktop and mobile login links should call setAuthMode('login')
    assert.match(indexHtml, /<a href="#auth" onclick="setAuthMode\('login'\)" class="nav-link">Log in<\/a>/);
    assert.match(indexHtml, /<a href="#auth" onclick="setAuthMode\('login'\)" class="lx-login">Log in<\/a>/);
    assert.match(indexHtml, /<a href="#auth" onclick="setAuthMode\('signup'\)" class="lx-btn">Claim yours/);
  });

  await t.test('Auth tabs have inline onclick and proper accessibility attributes', () => {
    assert.match(indexHtml, /id="tabSignup"[^>]*onclick="setAuthMode\('signup'\)"/);
    assert.match(indexHtml, /id="tabLogin"[^>]*onclick="setAuthMode\('login'\)"/);
    assert.match(indexHtml, /id="authGoIcon"/);
  });

  await t.test('setAuthMode strictly synchronizes tabs, icon, and button label', () => {
    assert.match(indexHtml, /currentAuthMode = \(mode === 'login'\) \? 'login' : 'signup';/);
    assert.match(indexHtml, /label\.textContent = currentAuthMode === 'signup' \? 'Create account' : 'Log in';/);
    assert.match(indexHtml, /icon\.className = currentAuthMode === 'signup' \? 'fa-solid fa-user-plus' : 'fa-solid fa-right-to-bracket';/);
  });

  await t.test('authGoBtn finally block never desynchronizes button label via origLabel', () => {
    // origLabel must not be present in index.html auth submission
    assert.doesNotMatch(indexHtml, /const origLabel/);
    assert.match(indexHtml, /finally\s*\{[\s\S]*?label\.textContent = currentAuthMode === 'signup' \? 'Create account' : 'Log in';/);
  });

  await t.test('Invalid credentials error provides inline switch to Sign Up', () => {
    assert.match(indexHtml, /<button type="button" onclick="setAuthMode\(\\'signup\\'\)" class="auth-inline-switch-btn">Click here to Sign Up<\/button>/);
  });

  await t.test('ui.css has auth-inline-switch-btn styles', () => {
    assert.match(uiCss, /\.lx-auth-card \.auth-inline-switch-btn/);
  });

  await t.test('Starter profile is auto-created in database on signup', () => {
    assert.match(indexHtml, /starterProfile\s*=\s*\{/);
    assert.match(indexHtml, /await cloudSaveProfile\(starterProfile\)/);
  });

  await t.test('Forgot password button and password reset helpers are present', () => {
    const supabaseConfigJs = fs.readFileSync('backend/supabase-config.js', 'utf8');
    assert.match(indexHtml, /id="authForgotBtn"/);
    assert.match(indexHtml, /checkPasswordRecovery/);
    assert.match(supabaseConfigJs, /async function cloudResetPassword/);
    assert.match(supabaseConfigJs, /async function cloudUpdatePassword/);
  });

  await t.test('Boot check restores session for any logged in Supabase user', () => {
    const supabaseConfigJs = fs.readFileSync('backend/supabase-config.js', 'utf8');
    assert.match(supabaseConfigJs, /const \{ data: \{ user \} \} = await sb\.auth\.getUser\(\);/);
    assert.match(supabaseConfigJs, /showAppRole\('user', user\.email, p\);/);
  });

  await t.test('Database schema includes handle_new_user trigger', () => {
    const schemaSql = fs.readFileSync('backend/supabase-schema.sql', 'utf8');
    assert.match(schemaSql, /create or replace function public\.handle_new_user\(\)/);
    assert.match(schemaSql, /create trigger on_auth_user_created/);
  });

  await t.test('index.html inline script compiles cleanly without syntax errors', () => {
    const scriptMatch = indexHtml.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
    assert.ok(scriptMatch, 'Main script tag found');
    assert.doesNotThrow(() => {
      new Function(scriptMatch[1]);
    }, 'Main script tag must have valid syntax');
  });
});

