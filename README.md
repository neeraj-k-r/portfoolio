# portfoolio.me — username.portfoolio.me portfolios

Give your name + details, get a wow portfolio on **yourname.portfoolio.me**.

Live: https://portfoolio.me (Netlify + Namecheap) • Demo: https://portfoolio.me/?u=neerajkr

## How it works (v1)
- `index.html` = landing + builder form + directory
- `app.js` router resolves user via **subdomain** (`neerajkr.portfoolio.me`), `?u=neerajkr`, `/u/neerajkr`, or `#/u/neerajkr`
- Profiles live in `profiles/<username>.json` + browser `localStorage` (Supabase-ready for v2 permanent store)
- `worker.js` = Cloudflare Worker for true free wildcard `*.portfoolio.me`
- `netlify.toml` = `/u/*` rewrite + CORS for profiles

## Run locally
Open `index.html`, or `python -m http.server` then visit `http://localhost:8000/?u=demo`.

## Deploy (Netlify Git)
Import `neeraj-k-r/portfoolio`, branch `main`, build command empty, publish `.`. Then add custom domain `portfoolio.me`.

## True subdomains (one-time owner step)
Namecheap Advanced DNS: `A @ → 75.2.60.5`, `CNAME www → <site>.netlify.app`, `CNAME * → <site>.netlify.app` (needs Netlify Pro alias). Free path: Cloudflare + `worker.js`.

## Templates (pick 1 in builder, stored as `template`)
- 🌌 `midnight` — dark + neon wow (default) → `?u=neerajkr`
- 📄 `minimal` — light, recruiter/ATS clean → `?u=priya`, `?u=demo`
- 💻 `terminal` — hacker mono green → `?u=arjun`
- 🎨 `creative` — gradient playful → `?u=zoe`
- Files: `templates.css` (themes) + `templates.js` (renderers) hooked in `app.js`.
