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

  await t.test('CSP connect-src allows cdn.jsdelivr.net and cdnjs.cloudflare.com for source maps and assets', () => {
    assert.match(netlifyToml, /connect-src[^;]*https:\/\/cdn\.jsdelivr\.net/);
    assert.match(netlifyToml, /connect-src[^;]*https:\/\/cdnjs\.cloudflare\.com/);
    assert.match(workerJs, /connect-src[^;]*https:\/\/cdn\.jsdelivr\.net/);
    assert.match(workerJs, /connect-src[^;]*https:\/\/cdnjs\.cloudflare\.com/);
  });
});
