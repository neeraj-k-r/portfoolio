# portfoolio.me — username.portfoolio.me portfolios

Give your name + details, get a wow portfolio on **yourname.portfoolio.me**.

Live: https://portfoolio.me (Netlify + Namecheap) • Demo: https://portfoolio.me/?u=neerajkr

## Repo layout
- `frontend/` — everything visitors see: landing, auth, dashboards, templates, seed profiles. (`index.html`, `admin.html`, `app.js`, `templates.js`, `style.css`, `templates.css`, `profiles/`)
- `backend/` — server + data layer: Cloudflare Worker, wrangler config, Supabase config/helpers/schema.
- `netlify.toml` (root) — publishes repo root and rewrites all page URLs into `frontend/`; `/backend/*` files serve directly.

## Run locally
`python -m http.server` from repo root, then open `http://localhost:8000/frontend/`.

## How it works (v1)
- `index.html` = landing + builder form + directory
- `app.js` router resolves user via **subdomain** (`neerajkr.portfoolio.me`), `?u=neerajkr`, `/u/neerajkr`, or `#/u/neerajkr`
- Profiles live in `profiles/<username>.json` + browser `localStorage` (Supabase-ready for v2 permanent store)
- `worker.js` = Cloudflare Worker for true free wildcard `*.portfoolio.me`
- `netlify.toml` = `/u/*` rewrite + CORS for profiles

## Deploy (Netlify Git)
Import `neeraj-k-r/portfoolio`, branch `main`, build command empty, publish `.`. Then add custom domain `portfoolio.me`.

## True subdomains — free path (Cloudflare, one time)
1. Cloudflare → Add site `portfoolio.me` (free) → copy its 2 nameservers.
2. Namecheap → Domain → Nameservers → Custom DNS → paste Cloudflare's nameservers.
3. Cloudflare → DNS: `A @ → 75.2.60.5` (DNS-only/grey), `CNAME www → <site>.netlify.app` (DNS-only), `CNAME * → portfoolio.me` (Proxied/orange — required for the worker route).
4. Deploy worker: `cd backend` then `npx wrangler login && npx wrangler deploy` (uses `backend/wrangler.toml`, route `*.portfoolio.me/*`). Worker reads approved profiles from Supabase + falls back to seed JSON; unknown names redirect to `portfoolio.me/?claim=name`.
5. SSL: Cloudflare SSL/TLS mode **Full** (not Strict — Netlify's cert covers apex+www; subdomains are served by the worker with Cloudflare's edge cert).

## True subdomains (one-time owner step)
Namecheap Advanced DNS: `A @ → 75.2.60.5`, `CNAME www → <site>.netlify.app`, `CNAME * → <site>.netlify.app` (needs Netlify Pro alias). Free path: Cloudflare + `worker.js`.

## Email login (Supabase, free — 5 min owner setup)
1. Create project at supabase.com → copy **Project URL** + **anon key**
2. Paste them into `backend/supabase-config.js` (2 constants at top), commit + push
3. Supabase → SQL Editor → run `backend/supabase-schema.sql`
4. Auth → Providers → Email ON (turn Confirm email OFF for instant login — admin approval already moderates signups). Users sign up / log in with email + password; profiles in Postgres; public portfolios readable everywhere.

## Flow (landing → login → role dashboard)
- Landing describes the site + login/signup only (no public claim form).
- After login: admins land on the **admin dashboard** (approval queue + `/admin` console); everyone else lands on the **user dashboard** (claim form if new → editor + share once they have a site).
- Claim form lives inside the user dash and requires login; admin approval publishes the subdomain.

## Admin approval setup
1. Supabase → SQL Editor → run `backend/supabase-schema.sql` (re-run safe — it upgrades `is_admin()` too).
2. Supabase → Authentication → Add user → `portfoolio.me@gmail.com` + your admin password (tick auto-confirm). The password lives ONLY in Supabase — never in code.
3. Auth → Providers → Email → **Confirm email OFF** — no confirmation emails anywhere; the superadmin approves users from the site's admin panel instead.
Flow: visitor signs up with email + password → submits site request (saved `pending`, invisible publicly) → superadmin logs into dashboard admin panel → approves → `username.portfoolio.me` goes live. (`admins` table insert no longer required — the superadmin email is hardcoded in `is_admin()` + `backend/supabase-config.js`.)

## Proof of Work (skill evidence, not just claims)
- Data model: NO new tables. Skills stay `profiles.skills[]`; each project optionally carries `technologies[]`, `repo{fullName,language,stars,updatedAt,topics}` (presence = retrieved from GitHub), `demoUrl`. Skill↔Project is **derived** by `frontend/evidence.js` (shared pure functions) — manage info once.
- Labels: "GitHub Verified" strictly means "repository retrieved from GitHub", never a skill endorsement (tooltip on the badge says so).
- Public: skills render as evidence cards (counts + links) unless profile sets `skillsDisplay:'simple'`; skill pages at `?u=x&skill=y` and `username.portfoolio.me/skills/y`; project cards link tech → skill pages and show repo/demo badges only when the data exists.
- Dashboard: Proof of Work tab (counts + actionable suggestions) in the user studio.
- Tests: `node frontend/evidence.test.mjs` (repo has no test runner; dependency-free asserts). Existing portfolios without any new fields keep working (empty states everywhere, GitHub optional).

## Templates (pick 1 in builder, stored as `template`)
- 🌌 `midnight` — dark + neon wow (default) → `?u=neerajkr`
- 📄 `minimal` — light, recruiter/ATS clean → `?u=priya`, `?u=demo`
- 💻 `terminal` — hacker mono green → `?u=arjun`
- 🎨 `creative` — gradient playful → `?u=zoe`
- Files: `templates.css` (themes) + `templates.js` (renderers) hooked in `app.js`.
