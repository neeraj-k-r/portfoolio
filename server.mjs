import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '8000', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf'
};

function resolveFilePath(reqUrl) {
  const urlObj = new URL(reqUrl, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // Clean trailing slashes except for root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Netlify rewrite rules emulation
  if (pathname === '' || pathname === '/') {
    return path.join(__dirname, 'frontend', 'index.html');
  }
  if (pathname === '/admin' || pathname === '/admin.html') {
    return path.join(__dirname, 'frontend', 'admin.html');
  }
  if (pathname === '/explore') {
    return path.join(__dirname, 'frontend', 'index.html');
  }
  if (pathname.startsWith('/u/')) {
    return path.join(__dirname, 'frontend', 'index.html');
  }
  if (pathname.startsWith('/profiles/')) {
    return path.join(__dirname, 'frontend', pathname);
  }

  // Check direct file from project root (e.g. /frontend/..., /backend/...)
  const directPath = path.join(__dirname, pathname.startsWith('/') ? pathname.slice(1) : pathname);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }

  // If path is a directory (e.g. /frontend), serve index.html inside it
  if (fs.existsSync(directPath) && fs.statSync(directPath).isDirectory()) {
    const subIndex = path.join(directPath, 'index.html');
    if (fs.existsSync(subIndex)) return subIndex;
  }

  // Check inside frontend directory
  const frontendPath = path.join(__dirname, 'frontend', pathname.startsWith('/') ? pathname.slice(1) : pathname);
  if (fs.existsSync(frontendPath) && fs.statSync(frontendPath).isFile()) {
    return frontendPath;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFilePath(req.url);

  if (!filePath || !fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${req.url}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`500 Server Error: ${err.message}`);
  });
  stream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  portfoolio dev server is running!`);
  console.log(`========================================`);
  console.log(`  > Local:   http://localhost:${PORT}/`);
  console.log(`  > App:     http://localhost:${PORT}/frontend/`);
  console.log(`  > Admin:   http://localhost:${PORT}/admin`);
  console.log(`  > Demo:    http://localhost:${PORT}/?u=neerajkr`);
  console.log(`========================================\n`);
});
