/* portfoolio.me — cloud backend (Supabase). Paste your project values below to go live. */
const PORTFOOLIO_SUPABASE_URL = 'https://oorcivmymcokbjiawkig.supabase.co';
const PORTFOOLIO_SUPABASE_ANON_KEY = 'sb_publishable_u3HhZlncnGcg_UBT4G3N-Q_3uE5Qh63';
// Superadmin: this email can approve users from the site's admin panel. No Supabase emails needed.
const PORTFOOLIO_SUPERADMIN_EMAIL = 'portfoolio.me@gmail.com';

let _cloud = null;
function cloudEnabled() {
  return PORTFOOLIO_SUPABASE_URL.startsWith('https://') && PORTFOOLIO_SUPABASE_ANON_KEY.length > 40;
}
function cloud() {
  if (!cloudEnabled()) return null;
  if (!_cloud) _cloud = window.supabase.createClient(PORTFOOLIO_SUPABASE_URL, PORTFOOLIO_SUPABASE_ANON_KEY);
  return _cloud;
}
function normRow(r) {
  if (r && typeof r.avatar_url !== 'undefined' && typeof r.avatarUrl === 'undefined') r.avatarUrl = r.avatar_url || '';
  return r;
}
async function cloudGetProfile(username) {
  const sb = cloud(); if (!sb) return null;
  const { data } = await sb.from('profiles').select('*').eq('username', String(username).toLowerCase()).eq('status', 'approved').maybeSingle();
  return normRow(data) || null;
}
async function cloudSaveProfile(p) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('not-logged-in');
  const { data: existing } = await sb.from('profiles').select('status,site_type,site_path').eq('user_id', user.id).maybeSingle();
  const row = {
    user_id: user.id, username: p.username.toLowerCase(), name: p.name, title: p.title,
    tagline: p.tagline, email: user.email, phone: p.phone, location: p.location,
    github: p.github, linkedin: p.linkedin, instagram: p.instagram || '', template: p.template || 'midnight',
    avatar_url: p.avatarUrl || '',
    skills: p.skills || [], projects: p.projects || [], available: p.available !== false,
    experience: Array.isArray(p.experience) ? p.experience.slice(0, 20) : [],
    education: Array.isArray(p.education) ? p.education.slice(0, 10) : [],
    resume: (p.resume && typeof p.resume === 'object') ? p.resume : {},
    status: (existing && existing.status) || 'approved',
    // prebuilt-upload hosting: explicit value on p wins, else keep what is live
    site_type: p.site_type || (existing && existing.site_type) || 'builder',
    site_path: (typeof p.site_path === 'string' ? p.site_path : (existing && existing.site_path)) || '',
  };
  if (p.site_type === 'upload') row.site_updated_at = new Date().toISOString();
  const res = await sb.from('profiles').upsert(row, { onConflict: 'user_id' });
  if (!res.error) return row;
  // Older DB missing the newest columns (resume/upload set): PostgREST rejects
  // the whole upsert, which would lose ALL edits. Retry once with core fields
  // only — a partial save beats no save. Owner fix: re-run supabase-schema.sql.
  if (/could not find the '.+' column/i.test(res.error.message || '')) {
    const { experience, education, resume, site_type, site_path, site_updated_at, ...core } = row;
    const retry = await sb.from('profiles').upsert(core, { onConflict: 'user_id' });
    if (!retry.error) return { ...core, _partial: true };
  }
  throw res.error;
}

// ---- Prebuilt portfolio hosting (Supabase Storage, bucket: portfolio-sites) ----
// Layout: sites/<username>/<relative path>  (index.html required at root)
const PORTFOOLIO_SITES_BUCKET = 'portfolio-sites';
function siteStoragePrefix(username) {
  return 'sites/' + String(username || '').toLowerCase();
}
function sitePublicUrl(username, relPath) {
  if (!cloudEnabled()) return null;
  const rel = String(relPath || 'index.html').replace(/^\/+/, '');
  return PORTFOOLIO_SUPABASE_URL + '/storage/v1/object/public/' +
    PORTFOOLIO_SITES_BUCKET + '/' + siteStoragePrefix(username) + '/' + rel;
}
function guessContentType(path) {
  const ext = String(path || '').split('.').pop().toLowerCase().split('?')[0];
  const map = { html: 'text/html', htm: 'text/html', css: 'text/css', js: 'text/javascript',
    json: 'application/json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg',
    jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', ico: 'image/x-icon',
    woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', mp4: 'video/mp4', txt: 'text/plain' };
  return map[ext] || 'application/octet-stream';
}
async function cloudUploadSiteFiles(username, files) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const u = String(username || '').toLowerCase();
  if (!u) throw new Error('no-username');
  const prefix = siteStoragePrefix(u);
  for (const f of files) {
    const rel = String(f.path || '').replace(/^\/+/, '');
    if (!rel || rel.includes('..')) throw new Error('bad-path: ' + rel);
    const { error } = await sb.storage.from(PORTFOOLIO_SITES_BUCKET)
      .upload(prefix + '/' + rel, f.blob, { upsert: true, contentType: f.contentType || guessContentType(rel) });
    if (error) throw error;
  }
  // mark profile as upload-hosted
  const { data: { user } } = await sb.auth.getUser();
  if (user) {
    await sb.from('profiles').update({
      site_type: 'upload', site_path: prefix + '/index.html', site_updated_at: new Date().toISOString(),
    }).eq('user_id', user.id);
  }
  return prefix + '/index.html';
}
async function cloudSetSiteTypeUpload(username, on) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('not-logged-in');
  const patch = on
    ? { site_type: 'upload', site_path: siteStoragePrefix(username) + '/index.html', site_updated_at: new Date().toISOString() }
    : { site_type: 'builder' };
  const { error } = await sb.from('profiles').update(patch).eq('user_id', user.id);
  if (error) throw error;
  return patch;
}
async function cloudDeleteSite(username) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const u = String(username || '').toLowerCase();
  const prefix = siteStoragePrefix(u);
  // list + remove in chunks (storage has no recursive delete)
  let removed = 0;
  async function wipe(dir) {
    const { data, error } = await sb.storage.from(PORTFOOLIO_SITES_BUCKET).list(dir, { limit: 100 });
    if (error) throw error;
    for (const e of (data || [])) {
      if (!e || !e.name) continue;
      const full = dir + '/' + e.name;
      if (e.id == null) { await wipe(full); } // folder placeholder
      else {
        const { error: rerr } = await sb.storage.from(PORTFOOLIO_SITES_BUCKET).remove([full]);
        if (rerr) throw rerr;
        removed++;
      }
    }
  }
  await wipe(prefix);
  const { data: { user } } = await sb.auth.getUser();
  if (user) await sb.from('profiles').update({ site_type: 'builder', site_path: '' }).eq('user_id', user.id);
  return removed;
}
async function cloudSignUp(email, password) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  return data; // data.session is null when email confirmation is ON — user must click inbox link, then log in
}
async function cloudSignIn(email, password) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
async function cloudMyProfile() {
  const sb = cloud(); if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  return normRow(data) || null;
}
async function cloudIsAdmin() {
  const sb = cloud(); if (!sb) return false;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
  if ((user.email || '').toLowerCase() === PORTFOOLIO_SUPERADMIN_EMAIL) return true;
  const { data } = await sb.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  return !!data;
}
async function cloudPending() {
  const sb = cloud(); if (!sb) return [];
  const { data, error } = await sb.from('profiles').select('username,name,title,email,created_at').eq('status', 'pending').order('created_at');
  if (error) throw error;
  return data || [];
}
async function cloudSetStatus(username, status) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { error } = await sb.from('profiles').update({ status }).eq('username', String(username).toLowerCase());
  if (error) throw error;
}
async function cloudDeleteProfile(username) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { error } = await sb.from('profiles').delete().eq('username', String(username).toLowerCase());
  if (error) throw error;
}
