# backend — server + data layer (never rendered as pages)

- `worker.js` — Cloudflare Worker serving `*.portfoolio.me` from Supabase (deploy from here: `npx wrangler deploy`)
- `wrangler.toml` — worker name + `*.portfoolio.me/*` route
- `supabase-config.js` — project URL + publishable key (public by design; RLS is the lock) + all DB helpers, loaded by the frontend via `../backend/supabase-config.js`
- `supabase-schema.sql` — full idempotent schema: profiles, admins, approval RLS. Run in Supabase SQL Editor.

Nothing here is a page. Real secrets (service_role keys) must NEVER live in this repo.
