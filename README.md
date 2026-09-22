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

## Email login (Supabase, free — 5 min owner setup)
1. Create project at supabase.com → copy **Project URL** + **anon key**
2. Paste them into `supabase-config.js` (2 constants at top), commit + push
3. Supabase → SQL Editor → run `supabase-schema.sql`
4. Auth → Providers → Email ON. Users log in via dashboard with email OTP code — works on any device, profiles stored in Postgres, public portfolios readable everywhere.

## Admin approval flow (subdomain given only after approval)
1. Supabase → Authentication → Add user → create `portfoolio.me@gmail.com` with your admin password (tick auto-confirm). The password lives ONLY in Supabase — never in code.
2. SQL Editor → run `supabase-schema.sql` (re-run safe), then run the `insert into admins ...` line at the bottom of that file.
3. Flow: visitor logs in with email OTP → submits site request (saved `pending`, invisible publicly) → admin logs into dashboard → approves → `username.portfoolio.me` goes live. Rejected/deleted requests free the name.

## Templates (pick 1 in builder, stored as `template`)
- 🌌 `midnight` — dark + neon wow (default) → `?u=neerajkr`
- 📄 `minimal` — light, recruiter/ATS clean → `?u=priya`, `?u=demo`
- 💻 `terminal` — hacker mono green → `?u=arjun`
- 🎨 `creative` — gradient playful → `?u=zoe`
- Files: `templates.css` (themes) + `templates.js` (renderers) hooked in `app.js`.
