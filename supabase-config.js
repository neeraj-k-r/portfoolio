/* portfoolio.me — cloud backend (Supabase). Paste your project values below to go live. */
const PORTFOOLIO_SUPABASE_URL = 'PASTE_SUPABASE_URL_HERE';
const PORTFOOLIO_SUPABASE_ANON_KEY = 'PASTE_SUPABASE_ANON_KEY_HERE';

let _cloud = null;
function cloudEnabled() {
  return PORTFOOLIO_SUPABASE_URL.startsWith('https://') && PORTFOOLIO_SUPABASE_ANON_KEY.length > 40;
}
function cloud() {
  if (!cloudEnabled()) return null;
  if (!_cloud) _cloud = window.supabase.createClient(PORTFOOLIO_SUPABASE_URL, PORTFOOLIO_SUPABASE_ANON_KEY);
  return _cloud;
}
async function cloudGetProfile(username) {
  const sb = cloud(); if (!sb) return null;
  const { data } = await sb.from('profiles').select('*').eq('username', String(username).toLowerCase()).eq('status', 'approved').maybeSingle();
  return data || null;
}
async function cloudSaveProfile(p) {
  const sb = cloud(); if (!sb) throw new Error('cloud-off');
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('not-logged-in');
  const { data: existing } = await sb.from('profiles').select('status').eq('user_id', user.id).maybeSingle();
  const row = {
    user_id: user.id, username: p.username.toLowerCase(), name: p.name, title: p.title,
    tagline: p.tagline, email: p.email, phone: p.phone, location: p.location,
    github: p.github, linkedin: p.linkedin, template: p.template || 'midnight',
    skills: p.skills || [], projects: p.projects || [], available: p.available !== false,
    status: (existing && existing.status) || 'pending',
  };
  const { error } = await sb.from('profiles').upsert(row, { onConflict: 'user_id' });
  if (error) throw error;
  return row;
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
  return data || null;
}
async function cloudIsAdmin() {
  const sb = cloud(); if (!sb) return false;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
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
