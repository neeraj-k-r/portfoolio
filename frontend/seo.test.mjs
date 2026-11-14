import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('SEO: robots.txt and sitemap.xml files exist with valid directives', () => {
  const rootRobots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
  const feRobots = fs.readFileSync(path.join(rootDir, 'frontend', 'robots.txt'), 'utf8');
  assert.ok(rootRobots.includes('User-agent: *'), 'root robots.txt has User-agent: *');
  assert.ok(rootRobots.includes('Allow: /'), 'root robots.txt allows /');
  assert.ok(rootRobots.includes('Sitemap: https://portfoolio.me/sitemap.xml'), 'root robots.txt links sitemap.xml');
  assert.equal(rootRobots, feRobots, 'frontend/robots.txt matches root robots.txt');

  const rootSitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  const feSitemap = fs.readFileSync(path.join(rootDir, 'frontend', 'sitemap.xml'), 'utf8');
  assert.ok(rootSitemap.includes('<loc>https://portfoolio.me/</loc>'), 'sitemap includes root URL');
  assert.ok(rootSitemap.includes('<loc>https://portfoolio.me/explore</loc>'), 'sitemap includes explore URL');
  assert.ok(rootSitemap.includes('<priority>1.0</priority>'), 'root URL has highest priority');
  assert.equal(rootSitemap, feSitemap, 'frontend/sitemap.xml matches root sitemap.xml');
});

test('SEO: Open Graph social preview image exists', () => {
  assert.ok(fs.existsSync(path.join(rootDir, 'frontend', 'og-image.png')), 'frontend/og-image.png exists');
  assert.ok(fs.existsSync(path.join(rootDir, 'og-image.png')), 'root og-image.png exists');
  assert.ok(fs.existsSync(path.join(rootDir, 'frontend', 'og-image.svg')), 'frontend/og-image.svg exists');
  const pngBuf = fs.readFileSync(path.join(rootDir, 'frontend', 'og-image.png'));
  assert.ok(pngBuf.length > 500, 'og-image.png is a non-empty image');
  assert.equal(pngBuf.readUInt32BE(16), 1200, 'og-image.png width is 1200');
  assert.equal(pngBuf.readUInt32BE(20), 630, 'og-image.png height is 630');
});

test('SEO: index.html has complete meta tags, social cards, canonical link and Schema.org structured data', () => {
  const html = fs.readFileSync(path.join(rootDir, 'frontend', 'index.html'), 'utf8');
  assert.ok(html.includes('<title>portfoolio.me'), 'index.html has informative title');
  assert.ok(html.includes('<meta name="description"'), 'index.html has meta description');
  assert.ok(html.includes('<meta name="keywords"'), 'index.html has meta keywords');
  assert.ok(html.includes('<meta name="author"'), 'index.html has author meta tag');
  assert.ok(html.includes('<meta name="robots" content="index, follow'), 'index.html has robots index, follow');
  assert.ok(html.includes('<link rel="canonical" href="https://portfoolio.me/"'), 'index.html has canonical link');

  // Open Graph
  assert.ok(html.includes('<meta property="og:type" content="website"'), 'og:type website');
  assert.ok(html.includes('<meta property="og:title"'), 'og:title is present');
  assert.ok(html.includes('<meta property="og:description"'), 'og:description is present');
  assert.ok(html.includes('<meta property="og:image" content="https://portfoolio.me/og-image.png"'), 'og:image points to og-image.png');

  // Twitter
  assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image"'), 'twitter:card is summary_large_image');
  assert.ok(html.includes('<meta name="twitter:title"'), 'twitter:title is present');
  assert.ok(html.includes('<meta name="twitter:image" content="https://portfoolio.me/og-image.png"'), 'twitter:image is present');

  // JSON-LD Schema.org
  assert.ok(html.includes('application/ld+json'), 'JSON-LD script tag is present');
  assert.ok(html.includes('"@type": "WebSite"'), 'JSON-LD has WebSite schema');
  assert.ok(html.includes('"@type": "WebApplication"'), 'JSON-LD has WebApplication schema');
});

test('SEO: worker.js handles robots.txt, dynamic sitemap.xml, and renders rich social metadata for user portfolios', () => {
  const workerSrc = fs.readFileSync(path.join(rootDir, 'backend', 'worker.js'), 'utf8');

  // robots.txt route
  assert.ok(workerSrc.includes("url.pathname === '/robots.txt'"), 'worker handles /robots.txt');
  assert.ok(workerSrc.includes('Sitemap: https://portfoolio.me/sitemap.xml'), 'worker robots.txt includes sitemap url');

  // sitemap.xml route
  assert.ok(workerSrc.includes("url.pathname === '/sitemap.xml'"), 'worker handles /sitemap.xml');
  assert.ok(workerSrc.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'worker sitemap has urlset');

  // Subdomain SEO in head(p)
  assert.ok(workerSrc.includes('userCanonical'), 'worker head generates userCanonical');
  assert.ok(workerSrc.includes('<meta property="og:type" content="profile">'), 'worker head generates og:type profile');
  assert.ok(workerSrc.includes('<meta name="twitter:card" content="summary_large_image">'), 'worker head generates twitter:card');
  assert.ok(workerSrc.includes('application/ld+json'), 'worker head generates JSON-LD schema');
  assert.ok(workerSrc.includes('"@type": "ProfilePage"'), 'worker head JSON-LD has ProfilePage');
  assert.ok(workerSrc.includes('"@type": "Person"'), 'worker head JSON-LD has Person');

  // Resume SEO in pageResume(p)
  assert.ok(workerSrc.includes('resumeCanonical'), 'pageResume generates canonical URL');
  assert.ok(workerSrc.includes('resumeTitle'), 'pageResume generates resumeTitle');
});
