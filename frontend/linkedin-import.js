/* portfoolio.me — LinkedIn paste-import parser (browser + node, no deps).
 * Why paste, not fetch: LinkedIn has no public profile API and blocks
 * automated fetching (login wall + CORS), so a fetch-by-URL button cannot
 * work. Instead the user copies their profile text from LinkedIn and this
 * parser turns it into profile + resume fields (still requires Save).
 * Guided format (also accepted, most reliable):
 *   Headline: Full-Stack Developer | Location: Kerala, India
 *   Skills: React, Node.js, Python
 *   Role @ Company | Jun 2024 - Present
 *   - achievement one
 *   School | B.Tech, Computer Science | 2022 - 2026
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PortfoolioLinkedIn = api;
}(typeof self !== 'undefined' ? self : this, () => {
  const MONTHS = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*';
  const DATE = `(?:${MONTHS}\\.?\\s+)?\\d{4}`;
  const RANGE_ANY = new RegExp(`${DATE}\\s*(?:[\\-\u2013\u2014]|to)\\s*(?:${DATE}|Present|Now|Current)`, 'i');
  const DEGREE_RE = /\b(bachelor|master|b\.?tech|m\.?tech|b\.?e\b|bca|mca|bsc|msc|mba|ph\.?d|diploma|associate|b\.?com|m\.?com)\b/i;

  function clean(s) { return String(s || '').replace(/\r/g, '').trim(); }
  function splitBlocks(text) {
    return clean(text).split(/\n{2,}/).map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean)).filter((b) => b.length);
  }
  // Split a block's lines further when several entries were pasted without
  // blank lines: a new date-range line after content starts a new entry.
  // Group pasted lines into entries when blank lines are missing (LinkedIn
  // order: Role / Company / dates / details). A date line attaches to the
  // role above it — so when the buffer already has dates, pull the trailing
  // head lines (role + company) back onto the new entry instead of orphaning.
  function groupEntries(lines) {
    const entries = [];
    let cur = [];
    const isHead = (l) => {
      const t = String(l || '').trim();
      return !!t && !/^[-*•]/.test(t) && !dateLine(t) &&
        !/^(full-time|part-time|contract|internship|remote|hybrid|on-site)/i.test(t) && t.length <= 48;
    };
    for (const l of lines) {
      if (dateLine(l) && cur.some((x) => dateLine(x))) {
        const head = [];
        while (cur.length && head.length < 2 && isHead(cur[cur.length - 1])) head.unshift(cur.pop());
        if (cur.length) entries.push(cur);
        cur = head;
      }
      cur.push(l);
    }
    if (cur.length) entries.push(cur);
    return entries;
  }
  // Strict: the line IS a date range (duration suffixes like "· 1 yr" allowed),
  // not a content line that merely mentions years ("CUSAT … 2022 - 2026" rejected).
  function dateLine(l) {
    const t = String(l || '').replace(/^[-*•]\s*/, '').trim();
    const m = t.match(new RegExp(`(${DATE})\\s*(?:[\\-\u2013\u2014]|to)\\s*(${DATE}|Present|Now|Current)`, 'i'));
    if (!m || m.index > 8) return null;
    const leftover = (t.slice(0, m.index) + t.slice(m.index + m[0].length)).replace(/[·•|]/g, '').trim();
    if (leftover.length > 24 || /[@,]/.test(leftover)) return null;
    const endRaw = m[2].trim();
    const current = /present|now|current/i.test(endRaw);
    return { start: m[1].replace(/\s+/g, ' ').trim(), end: current ? '' : endRaw, current };
  }
  function parseRange(line) {
    const m = String(line || '').match(new RegExp(`(${DATE})\\s*(?:[\\-\u2013\u2014]|to)\\s*(${DATE}|Present|Now|Current)`, 'i'));
    if (!m) return null;
    const endRaw = m[2].trim();
    const current = /present|now|current/i.test(endRaw);
    return { start: m[1].replace(/\s+/g, ' ').trim(), end: current ? '' : endRaw, current };
  }
  function parseHeadlineBlock(lines, out) {
    // "Role @ Company" | "Role | Company" | "Role, Company" (+ optional dates)
    // LinkedIn paste order is usually Role / Company / dates / details.
    const first = lines[0];
    let role = '', company = '';
    const m = first.match(/^(.+?)\s*[@|]\s*(.+)$/) ||
      (!RANGE_ANY.test(first) && first.match(/^(.+?),\s*([^,]+)$/));
    if (m) { role = m[1].trim(); company = m[2].trim(); }
    else role = first;
    let start = '', end = '', current = false;
    // dates may ride on the headline tail: "Role @ Co | Jun 2024 - Present"
    const cm = company.match(/^(.+?)\s*\|\s*(.+)$/);
    if (cm) {
      const r = parseRange(cm[2]);
      if (r) { company = cm[1].trim(); start = r.start; end = r.end; current = r.current; }
    }
    let body = lines.slice(1);
    // company on its own second line ("Acme · Full-time"), not a date/bullet/type line
    if (!company && body.length) {
      const cand = body[0].replace(/^[-*•]\s*/, '').trim();
      if (cand && !/^[-*•]/.test(body[0].trim()) && !dateLine(body[0]) &&
          !/^(full-time|part-time|contract|internship|remote|hybrid|on-site)/i.test(cand)) {
        company = cand;
        body = body.slice(1);
      }
    }
    const desc = [];
    for (const l of body) {
      const r = dateLine(l);
      if (r && !start) { start = r.start; end = r.end; current = r.current; continue; }
      if (!desc.length && /^(full-time|part-time|contract|internship|remote|hybrid|on-site)/i.test(l)) continue;
      desc.push(l.replace(/^[-*•]\s*/, ''));
    }
    if (role || company) out.push({ role, company, start, end, current, desc: desc.join('\n') });
  }
  function parseEduBlock(lines, out) {
    // "School | Degree, Field | Years" or stacked lines
    let school = '', degree = '', field = '', years = '';
    if (lines[0].includes('|')) {
      const parts = lines[0].split('|').map((s) => s.trim());
      school = parts[0] || '';
      if (parts[1]) {
        const dm = parts[1].split(',').map((s) => s.trim());
        degree = dm[0] || ''; field = dm.slice(1).join(', ');
      }
      years = (parts[2] || '') + (lines.length > 1 && !parts[2] ? ' ' + lines.slice(1).join(' ') : '');
    } else {
      school = lines[0];
      for (const l of lines.slice(1)) {
        if (DEGREE_RE.test(l) && !degree) {
          const dm = l.split(',').map((s) => s.trim());
          degree = dm[0]; field = dm.slice(1).join(', ');
        } else if (RANGE_ANY.test(l) || /^\d{4}\s*[-–]\s*\d{4}$/.test(l)) years = l;
        else if (!degree) degree = l;
      }
    }
    const r = parseRange(years);
    if (school) out.push({ school, degree, field, start: r ? r.start : '', end: r ? (r.current ? 'Present' : r.end) : years.trim() });
  }

  // Main entry: raw pasted text → { title, tagline, location, skills, summary, experience, education }
  function parseLinkedInText(text) {
    const out = { title: '', tagline: '', location: '', skills: [], summary: '', experience: [], education: [] };
    const raw = clean(text);
    if (!raw) return out;
    // 1) labeled lines work anywhere in the paste (blank lines preserved
    // so entry blocks stay separated for step 3)
    const rest = [];
    for (const l of raw.split('\n')) {
      const t = l.trim();
      let m;
      if (!t) { rest.push(''); continue; }
      if ((m = t.match(/^(headline|title)\s*:\s*(.+)$/i))) { if (!out.title) out.title = m[2].trim(); continue; }
      if ((m = t.match(/^tagline\s*:\s*(.+)$/i))) { if (!out.tagline) out.tagline = m[1].trim(); continue; }
      if ((m = t.match(/^location\s*:\s*(.+)$/i))) { if (!out.location) out.location = m[1].trim(); continue; }
      if ((m = t.match(/^(about|summary)\s*:\s*(.+)$/i))) { out.summary += (out.summary ? ' ' : '') + m[2].trim(); continue; }
      if ((m = t.match(/^(top\s+)?skills?\s*:\s*(.+)$/i))) {
        out.skills.push(...m[2].split(/[,•|]/).map((s) => s.trim()).filter(Boolean));
        continue;
      }
      rest.push(t);
    }
    // 2) split the remainder on LinkedIn section headings
    const joined = rest.join('\n');
    const parts = joined.split(/^\s*(experience|education)\s*$/gim);
    let head = parts[0] || '', expText = '', eduText = '';
    for (let i = 1; i < parts.length; i += 2) {
      if (/^experience$/i.test(parts[i].trim())) expText += '\n' + (parts[i + 1] || '');
      else eduText += '\n' + (parts[i + 1] || '');
    }
    const headLines = head.split('\n').map((l) => l.trim()).filter(Boolean)
      .filter((l) => !/^(licenses|certifications|projects?|contact|see more|about)$/i.test(l));
    if (!out.title && headLines.length && headLines[0].length < 80 &&
        !RANGE_ANY.test(headLines[0]) && !DEGREE_RE.test(headLines[0])) {
      out.title = headLines.shift();
    }
    if (!out.summary && headLines.length) out.summary = headLines.slice(0, 3).join(' ').slice(0, 600);
    // 3) entries: blank-line blocks, re-split when date ranges run together
    const expLines = expText.split('\n').map((l) => l.trim()).filter(Boolean);
    groupEntries(expLines).forEach((b) => parseHeadlineBlock(b, out.experience));
    if (!expText.trim()) {
      // no Experience heading: classify date-ranged head blocks (degree = school)
      splitBlocks(head).forEach((b) => {
        if (!b.some((l) => RANGE_ANY.test(l))) return;
        if (DEGREE_RE.test(b.join(' '))) parseEduBlock(b, out.education);
        else parseHeadlineBlock(b, out.experience);
      });
    }
    splitBlocks(eduText).forEach((b) => {
      if (b.length && (DEGREE_RE.test(b.join(' ')) || /\d{4}/.test(b.join(' ')))) parseEduBlock(b, out.education);
    });
    out.skills = [...new Set(out.skills)].slice(0, 12);
    out.experience = out.experience.slice(0, 20);
    out.education = out.education.slice(0, 10);
    return out;
  }

  return { parseLinkedInText, parseRange };
}));
