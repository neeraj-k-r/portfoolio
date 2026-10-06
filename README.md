# portfoolio.me — username.portfoolio.me portfolios

Give your name + details, get a wow portfolio on **yourname.portfoolio.me**.

Live: https://portfoolio.me (Netlify + Namecheap) • Demo: https://portfoolio.me/?u=neerajkr

## Repo layout
- `frontend/` — everything visitors see: landing, auth, dashboards, templates, seed profiles. (`index.html`, `admin.html`, `app.js`, `templates.js`, `style.css`, `templates.css`, `resume.js`, `resume.css`, `profiles/`)
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

## Flow (landing → login → dashboard, instant publishing)
- Landing describes the site + login/signup only (no public claim form).
- After login: admins land on the **admin dashboard** (user directory + `/admin` console); everyone else lands on the **user dashboard** (claim form if new → editor + share once they have a site).
- Claim form lives inside the user dash and requires login; **sites go live instantly** — the admin panel remains for moderation (reject/delete spam).
- To re-enable gated publishing, set new-row status back to `pending` in `cloudSaveProfile` + `builderForm` and restore the pending-only RLS checks (see git history).

## Admin setup + moderation (no approval gate)
1. Supabase → SQL Editor → run `backend/supabase-schema.sql` (re-run safe — open-publishing RLS included).
2. Supabase → Authentication → Add user → `portfoolio.me@gmail.com` + your admin password (tick auto-confirm). The password lives ONLY in Supabase — never in code.
3. Auth → Providers → Email → **Confirm email OFF**.
Sites publish instantly; use the admin console to reject/delete spam. Existing `pending` rows were backfilled to `approved` by the schema.

## Proof of Work (skill evidence, not just claims)
- Data model: NO new tables. Skills stay `profiles.skills[]`; each project optionally carries `technologies[]`, `repo{fullName,language,stars,updatedAt,topics}` (presence = retrieved from GitHub), `demoUrl`. Skill↔Project is **derived** by `frontend/evidence.js` (shared pure functions) — manage info once.
- Labels: "GitHub Verified" strictly means "repository retrieved from GitHub", never a skill endorsement (tooltip on the badge says so).
- Public: skills render as evidence cards (counts + links) unless profile sets `skillsDisplay:'simple'`; skill pages at `?u=x&skill=y` and `username.portfoolio.me/skills/y`; project cards link tech → skill pages and show repo/demo badges only when the data exists.
- Dashboard: Proof of Work tab (counts + actionable suggestions) in the user studio.
- Tests: `node frontend/evidence.test.mjs` (repo has no test runner; dependency-free asserts). Existing portfolios without any new fields keep working (empty states everywhere, GitHub optional).

## Identity (email permanent, socials stored + shown)
- Email is locked to the signup account: `cloudSaveProfile` always writes `auth.users.email`, editor shows it read-only.
- Phone, LinkedIn, Instagram (`instagram` column, `@handle` auto-normalized to URL) save from wizard + editor and render on midnight, all 10 theme renderers, and worker subdomains.
- **Instagram visibility toggle**: users choose whether to show Instagram on their portfolio (checkbox in Profile Info + Claim form, default ON). Respected by all 10 themes, worker subdomains, and footer socials.

## Prebuilt upload hosting (bring your own site)
- User Dashboard → **Upload Site** tab: drop a `.zip` (with `index.html` at root, or inside one folder like `dist/`) or a single `.html` file. Limits: ZIP ≤ 20MB, ≤ 200 files, each ≤ 8MB, no executables.
- Flow: files are staged locally → previewed in an iframe (relative CSS/JS/images rewired to blob URLs) → **Publish to my subdomain** uploads each file to the public Supabase Storage bucket `portfolio-sites` at `sites/<username>/<path>` and flips `profiles.site_type` to `'upload'`.
- Serving: `username.portfoolio.me/*` (Cloudflare worker) proxies that prefix file-by-file with correct MIME types + SPA fallback to `index.html`; `?u=username` path mode renders the storage `index.html` in a full-bleed iframe with a small portfoolio bar.
- Revert anytime with **Use builder theme instead** (builder data is kept; `site_type` back to `'builder'`). Owner one-time setup: re-run `backend/supabase-schema.sql` (creates the bucket + `site_type`/`site_path` columns + storage policies), then `npx wrangler deploy`.

## Resume section (auto-built from profile info, 4 themes)
- Data model: NO new tables. `profiles.experience[]` (`{role, company, start, end, current, desc}` — one achievement per line), `profiles.education[]` (`{school, degree, field, start, end}`), `profiles.certifications[]` (`{name, issuer, year, url}`), `profiles.resume{}` (`{summary, theme}`). Name, contact, skills & projects are reused — manage info once.
- **ATS-friendly template** (default 📄 `ats`): standard headings (Professional Summary, Technical Skills / Soft Skills, Experience, Education, Certifications, Projects), contact line uses `|` separators, auto-splits skills into Technical vs Soft, print output normalizes to clean ATS format on all themes.
- Themes (`resume.theme`, picked in signup form + Resume tab): 📄 `ats` (default — white, system font, parser-safe for job applications), ✨ `modern` (light card), 🌌 `midnight` (dark neon), 💻 `terminal` (mono green). Print CSS normalizes every theme to clean ATS output.
- Public: every portfolio template (all 10) gains a Resume section linking to the full page; full page at `?u=x&resume=1`, `/u/x/resume`, and `username.portfoolio.me/resume` with a Print / Save-as-PDF button (no server PDF needed).
- Dashboard: **Resume** tab (summary, theme radios, experience/education/certifications add/remove, live iframe preview, open/print buttons) + resume link in Share tab. Old profiles without the new fields render with empty-state hints.
- Files: `frontend/resume.js` (normalizer + section + full doc) + `frontend/resume.css` (themes + print); worker mirrors the renderer server-side (same pattern as skill evidence). Owner setup: re-run `backend/supabase-schema.sql`, then `npx wrangler deploy`.

## Pasted-text quick fill (resume fields)
- Renamed from "LinkedIn import" — works with any pasted profile text (resume, portfolio doc, LinkedIn, etc.).
- Parser (`frontend/linkedin-import.js`, pure + tested via `node frontend/linkedin-import.test.mjs`): labeled lines (`Headline:`/`Location:`/`Skills:`/`Role @ Company | dates`/`School | Degree | years`) anywhere in the paste, plus best-effort section (`Experience`/`Education`) + date-range detection. Fills resume fields (summary if empty, new roles/schools deduped) AND normal sections (empty title/tagline/location, merged skills ≤12). Everything still needs **Save Changes** to publish.

## Profile photos (Cloudinary, free)
1. Cloudinary dashboard → Settings → Upload → Upload presets → Add new, Signing Mode **Unsigned** → copy cloud name + preset.
2. Paste into `frontend/cloudinary-config.js`, commit + push. Users upload from Profile Info (JPG/PNG ≤5MB); URL saved on the profile and shown on all templates + worker pages.

## Templates (pick 1 in builder, stored as `template`)
- 🌌 `midnight` — dark + neon wow (default) → `?u=neerajkr`
- 📄 `minimal` — light, recruiter/ATS clean → `?u=priya`, `?u=demo`
- 💻 `terminal` — hacker mono green → `?u=arjun`
- 🎨 `creative` — gradient playful → `?u=zoe`
- 🔮 `aurora` — frosted glass pastels → `?u=mira`
- 📰 `editorial` — print serif calm → `?u=june`
- 🧱 `brutalist` — bold blocks + shadows → `?u=leo`
- 🌇 `afterglow` *fresh* — sunset neon → `?u=ember`
- 🟣 `ultraviolet` *fresh* — violet haze neon → `?u=iris`
- 🪼 `tidepool` *fresh* — abyss glow → `?u=kai`
- Files: `frontend/templates.css` (themes) + `frontend/templates.js` (renderers) hooked in `app.js`.

## Key files
| File | Purpose |
|------|---------|
| `frontend/index.html` | Landing + builder + user dashboard (all tabs) |
| `frontend/app.js` | Router, renderers (midnight default + helpers), GitHub sync, evidence |
| `frontend/templates.js` | 9 non-midnight theme renderers |
| `frontend/templates.css` | Theme styles |
| `frontend/resume.js` | Resume builder (docBody, sectionHTML, fullDoc, themes) |
| `frontend/resume.css` | Resume theme styles + print normalization |
| `frontend/evidence.js` | Skill↔Project derivation (shared pure functions) |
| `frontend/linkedin-import.js` | Paste parser for resume quick-fill |
| `frontend/cloudinary-config.js` | Cloudinary unsigned upload config |
| `backend/worker.js` | Cloudflare Worker for `*.portfoolio.me/*` (reads Supabase, serves uploads, mirrors all renderers) |
| `backend/supabase-config.js` | Browser Supabase client + helpers (save, upload, avatar, etc.) |
| `backend/supabase-schema.sql` | Idempotent schema (profiles, admins, storage bucket, RLS policies) |
| `backend/wrangler.toml` | Worker config + route `*.portfoolio.me/*` |