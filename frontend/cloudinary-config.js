/* portfoolio.me — Cloudinary unsigned uploads (no secrets; preset must allow unsigned).
 * Setup: Cloudinary dashboard → Settings → Upload → Upload presets → Add (Signing Mode: Unsigned).
 * Paste the cloud name + preset below. Until then, avatar upload shows a setup notice. */
const PORTFOOLIO_CLOUDINARY_CLOUD = 'PASTE_CLOUD_NAME_HERE';
const PORTFOOLIO_CLOUDINARY_PRESET = 'PASTE_UNSIGNED_PRESET_HERE';

function cloudinaryEnabled() {
  return PORTFOOLIO_CLOUDINARY_CLOUD.indexOf('PASTE_') !== 0 && PORTFOOLIO_CLOUDINARY_PRESET.indexOf('PASTE_') !== 0;
}
async function uploadAvatar(file) {
  if (!cloudinaryEnabled()) throw new Error('av-setup');
  if (!file || !/^image\//.test(file.type)) throw new Error('av-type');
  if (file.size > 5 * 1024 * 1024) throw new Error('av-size');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', PORTFOOLIO_CLOUDINARY_PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(PORTFOOLIO_CLOUDINARY_CLOUD)}/image/upload`, {
    method: 'POST', body: fd,
  });
  if (!r.ok) throw new Error('av-upload');
  const d = await r.json();
  return d.secure_url;
}
