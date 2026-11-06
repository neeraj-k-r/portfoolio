/**
 * portfoolio.me — Admin Analytics Engine & User Directory
 * Comprehensive analytics, platform KPIs, template adoption, and user activity tracking.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortfoolioAdminAnalytics = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * @typedef {Object} UserProfile
   * @property {string} username
   * @property {string} [name]
   * @property {string} [email]
   * @property {string} [title]
   * @property {string} [track] - 'tech' | 'visual'
   * @property {string} [template]
   * @property {string} [status] - 'approved' | 'pending' | 'rejected'
   * @property {string} [site_type] - 'builder' | 'upload'
   * @property {Array} [projects]
   * @property {Array} [works]
   * @property {Array} [skills]
   * @property {Object} [resume]
   * @property {boolean} [featured]
   * @property {string} [created_at]
   * @property {string} [updated_at]
   */

  /**
   * Calculate total registered users with null-safety
   * @param {Array<UserProfile>} users
   * @returns {number}
   */
  Analytics.computeTotalUsers = function(users) {
    if (!Array.isArray(users)) return 0;
    return users.length;
  };

  /**
   * Compute status breakdown (approved/live, pending, rejected)
   * @param {Array<UserProfile>} users
   * @returns {{ approved: number, pending: number, rejected: number }}
   */
  Analytics.computeStatusCounts = function(users) {
    const counts = { approved: 0, pending: 0, rejected: 0 };
    if (!Array.isArray(users)) return counts;
    users.forEach(u => {
      const st = String(u.status || 'pending').toLowerCase();
      if (st === 'approved') counts.approved++;
      else if (st === 'rejected') counts.rejected++;
      else counts.pending++;
    });
    return counts;
  };

  /**
   * Compute technical vs visual & creative track breakdown
   * @param {Array<UserProfile>} users
   * @returns {{ tech: number, visual: number, techPercent: number, visualPercent: number }}
   */
  Analytics.computeTrackBreakdown = function(users) {
    let tech = 0;
    let visual = 0;
    if (!Array.isArray(users) || !users.length) {
      return { tech: 0, visual: 0, techPercent: 0, visualPercent: 0 };
    }
    users.forEach(u => {
      const trk = String(u.track || 'tech').toLowerCase();
      if (trk === 'visual') visual++;
      else tech++;
    });
    const total = tech + visual;
    const techPercent = total > 0 ? Math.round((tech / total) * 100) : 0;
    const visualPercent = total > 0 ? Math.round((visual / total) * 100) : 0;
    return { tech, visual, techPercent, visualPercent };
  };

  /**
   * Compute hosting mode distribution (builder templates vs custom zip uploads)
   * @param {Array<UserProfile>} users
   * @returns {{ builder: number, upload: number, builderPercent: number, uploadPercent: number }}
   */
  Analytics.computeHostingBreakdown = function(users) {
    let builder = 0;
    let upload = 0;
    if (!Array.isArray(users) || !users.length) {
      return { builder: 0, upload: 0, builderPercent: 0, uploadPercent: 0 };
    }
    users.forEach(u => {
      const st = String(u.site_type || 'builder').toLowerCase();
      if (st === 'upload') upload++;
      else builder++;
    });
    const total = builder + upload;
    const builderPercent = total > 0 ? Math.round((builder / total) * 100) : 0;
    const uploadPercent = total > 0 ? Math.round((upload / total) * 100) : 0;
    return { builder, upload, builderPercent, uploadPercent };
  };

  /**
   * Compute all-time total projects, visual works, and unique skills count
   * @param {Array<UserProfile>} users
   * @returns {{ projects: number, works: number, skills: number, totalContent: number }}
   */
  Analytics.computeContentTotals = function(users) {
    let projects = 0;
    let works = 0;
    let skills = 0;
    if (!Array.isArray(users)) return { projects: 0, works: 0, skills: 0, totalContent: 0 };
    users.forEach(u => {
      if (Array.isArray(u.projects)) projects += u.projects.length;
      if (Array.isArray(u.works)) works += u.works.length;
      if (Array.isArray(u.skills)) skills += u.skills.length;
    });
    return { projects, works, skills, totalContent: projects + works };
  };

  /**
   * Compute total compiled resumes across users
   * @param {Array<UserProfile>} users
   * @returns {number}
   */
  Analytics.computeResumeTotals = function(users) {
    if (!Array.isArray(users)) return 0;
    return users.filter(u => {
      return (u.resume && (u.resume.summary || u.resume.theme || (Array.isArray(u.experience) && u.experience.length)));
    }).length;
  };

  /**
   * Compute count of showcase featured portfolios
   * @param {Array<UserProfile>} users
   * @returns {number}
   */
  Analytics.computeFeaturedCount = function(users) {
    if (!Array.isArray(users)) return 0;
    return users.filter(u => Boolean(u.featured)).length;
  };

  /**
   * Compute active creators in 7-day and 30-day windows
   * @param {Array<UserProfile>} users
   * @param {Date} [now]
   * @returns {{ active7Days: number, active30Days: number }}
   */
  Analytics.computeActiveUsersWindow = function(users, now = new Date()) {
    if (!Array.isArray(users)) return { active7Days: 0, active30Days: 0 };
    const nowMs = now.getTime();
    const ms7Days = 7 * 24 * 60 * 60 * 1000;
    const ms30Days = 30 * 24 * 60 * 60 * 1000;
    let active7Days = 0;
    let active30Days = 0;

    users.forEach(u => {
      const tsStr = u.updated_at || u.site_updated_at || u.created_at;
      if (!tsStr) return;
      const ts = new Date(tsStr).getTime();
      if (isNaN(ts)) return;
      const diff = nowMs - ts;
      if (diff >= 0 && diff <= ms7Days) active7Days++;
      if (diff >= 0 && diff <= ms30Days) active30Days++;
    });

    return { active7Days, active30Days };
  };

  /**
   * Aggregate all top-level platform KPI metrics in a single calculation
   * @param {Array<UserProfile>} users
   * @returns {Object}
   */
  Analytics.aggregatePlatformKPIs = function(users) {
    const list = Array.isArray(users) ? users : [];
    const totalUsers = Analytics.computeTotalUsers(list);
    const status = Analytics.computeStatusCounts(list);
    const track = Analytics.computeTrackBreakdown(list);
    const hosting = Analytics.computeHostingBreakdown(list);
    const content = Analytics.computeContentTotals(list);
    const resumes = Analytics.computeResumeTotals(list);
    const featured = Analytics.computeFeaturedCount(list);
    const active = Analytics.computeActiveUsersWindow(list);

    return {
      totalUsers,
      approvedCount: status.approved,
      pendingCount: status.pending,
      rejectedCount: status.rejected,
      techCount: track.tech,
      visualCount: track.visual,
      techPercent: track.techPercent,
      visualPercent: track.visualPercent,
      builderCount: hosting.builder,
      uploadCount: hosting.upload,
      builderPercent: hosting.builderPercent,
      uploadPercent: hosting.uploadPercent,
      totalProjects: content.projects,
      totalWorks: content.works,
      totalSkills: content.skills,
      totalContent: content.totalContent,
      resumeCount: resumes,
      featuredCount: featured,
      active7Days: active.active7Days,
      active30Days: active.active30Days
    };
  };

  /**
   * Comprehensive Template Metadata Registry
   */
  Analytics.TEMPLATE_METADATA = {
    midnight: { name: 'Midnight', emoji: '🌌', track: 'tech' },
    minimal: { name: 'Minimal', emoji: '📄', track: 'tech' },
    terminal: { name: 'Terminal', emoji: '💻', track: 'tech' },
    creative: { name: 'Creative', emoji: '🎨', track: 'tech' },
    aurora: { name: 'Aurora', emoji: '🔮', track: 'tech' },
    editorial: { name: 'Editorial', emoji: '📰', track: 'tech' },
    brutalist: { name: 'Brutalist', emoji: '🧱', track: 'tech' },
    afterglow: { name: 'Afterglow', emoji: '🌇', track: 'tech' },
    ultraviolet: { name: 'Ultraviolet', emoji: '🟣', track: 'tech' },
    tidepool: { name: 'Tidepool', emoji: '🪼', track: 'tech' },
    nova: { name: 'Nova', emoji: '✨', track: 'tech' },
    codeflow: { name: 'Codeflow', emoji: '⚡', track: 'tech' },
    wave: { name: 'Wave', emoji: '🌊', track: 'tech' },
    assistant: { name: 'Assistant', emoji: '🤖', track: 'tech' },
    console: { name: 'Console', emoji: '📟', track: 'tech' },
    snowcard: { name: 'Snowcard', emoji: '❄️', track: 'tech' },
    parchment: { name: 'Parchment', emoji: '📜', track: 'tech' },
    cloud: { name: 'Cloud', emoji: '☁️', track: 'tech' },
    github: { name: 'GitHub', emoji: '🐙', track: 'tech' },
    particle: { name: 'Particle', emoji: '✨', track: 'tech' },
    panels: { name: 'Panels', emoji: '🍱', track: 'tech' },
    monolith: { name: 'Monolith', emoji: '🏛️', track: 'tech' },
    editor: { name: 'Editor', emoji: '📝', track: 'tech' },
    magazine: { name: 'Magazine', emoji: '🗞️', track: 'tech' },
    bold: { name: 'Bold', emoji: '💥', track: 'tech' },
    clean: { name: 'Clean', emoji: '🌿', track: 'tech' },
    vibrant: { name: 'Vibrant', emoji: '🌈', track: 'tech' },
    neon: { name: 'Neon', emoji: '💡', track: 'tech' },
    hacker: { name: 'Hacker', emoji: '👾', track: 'tech' },
    gallery: { name: 'Gallery', emoji: '🖼️', track: 'visual' },
    studio: { name: 'Studio', emoji: '☀️', track: 'visual' },
    noir: { name: 'Noir', emoji: '🌙', track: 'visual' },
    museum: { name: 'Museum', emoji: '🏛️', track: 'visual' },
    catalog: { name: 'Catalog', emoji: '📖', track: 'visual' },
    bloom: { name: 'Bloom', emoji: '🌸', track: 'visual' },
    motion: { name: 'Motion', emoji: '⚡', track: 'visual' },
    atelier: { name: 'Atelier', emoji: '🏛️', track: 'visual' },
    cinema: { name: 'Cinema', emoji: '🎬', track: 'visual' },
    arch: { name: 'Arch', emoji: '📐', track: 'visual' },
    zine: { name: 'Zine', emoji: '🎨', track: 'visual' },
    zen: { name: 'Zen', emoji: '🍵', track: 'visual' },
    desire: { name: 'Desire', emoji: '✨', track: 'visual' },
    lumina: { name: 'Lumina', emoji: '🏛️', track: 'visual' },
    vogue: { name: 'Vogue', emoji: '💎', track: 'visual' },
    filmstrip: { name: 'Filmstrip', emoji: '🎞️', track: 'visual' },
    biennale: { name: 'Biennale', emoji: '🏛️', track: 'visual' },
    pavilion: { name: 'Pavilion', emoji: '🏛️', track: 'visual' },
    documenta: { name: 'Documenta', emoji: '📑', track: 'visual' },
    triennale: { name: 'Triennale', emoji: '📐', track: 'visual' },
    sketchbook: { name: 'Sketchbook', emoji: '📓', track: 'visual' },
    salon: { name: 'Salon', emoji: '🖼️', track: 'visual' },
    illustra: { name: 'Illustra', emoji: '🎨', track: 'visual' },
    techno: { name: 'Techno Lab', emoji: '⚡', track: 'visual' },
    analog: { name: 'Analog Desk', emoji: '📻', track: 'visual' },
    mythos: { name: 'Mythos Classical', emoji: '🏛️', track: 'visual' },
    suki: { name: 'Suki Cinematic', emoji: '🎬', track: 'visual' }
  };

  /**
   * Compute template usage counts across all users
   * @param {Array<UserProfile>} users
   * @returns {Object<string, number>}
   */
  Analytics.computeTemplateUsage = function(users) {
    const usage = {};
    if (!Array.isArray(users)) return usage;
    users.forEach(u => {
      const tpl = String(u.template || 'midnight').toLowerCase();
      usage[tpl] = (usage[tpl] || 0) + 1;
    });
    return usage;
  };

  /**
   * Compute ranked list of top templates with adoption percentages
   * @param {Array<UserProfile>} users
   * @param {number} [limit=10]
   * @returns {Array<{ id: string, name: string, emoji: string, track: string, count: number, percent: number }>}
   */
  Analytics.computeTopTemplates = function(users, limit = 10) {
    if (!Array.isArray(users) || !users.length) return [];
    const usage = Analytics.computeTemplateUsage(users);
    const total = users.length;
    const entries = Object.keys(usage).map(id => {
      const meta = Analytics.TEMPLATE_METADATA[id] || { name: id, emoji: '🎨', track: 'tech' };
      const count = usage[id];
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return { id, name: meta.name, emoji: meta.emoji, track: meta.track, count, percent };
    });

    entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return entries.slice(0, limit);
  };

  /**
   * Compute track adoption rates for technical vs visual tracks
   * @param {Array<UserProfile>} users
   * @returns {{ techRatio: number, visualRatio: number, dominantTrack: string }}
   */
  Analytics.computeTrackAdoptionRates = function(users) {
    const breakdown = Analytics.computeTrackBreakdown(users);
    const total = breakdown.tech + breakdown.visual;
    const techRatio = total > 0 ? Number((breakdown.tech / total).toFixed(2)) : 0;
    const visualRatio = total > 0 ? Number((breakdown.visual / total).toFixed(2)) : 0;
    const dominantTrack = breakdown.tech >= breakdown.visual ? 'tech' : 'visual';
    return { techRatio, visualRatio, dominantTrack };
  };

  /**
   * Format ISO date string to clean readable date (e.g., "Nov 6, 2026")
   * @param {string|Date} dateStr
   * @returns {string}
   */
  Analytics.formatISOToReadable = function(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /**
   * Calculate human-friendly relative time (e.g., "just now", "5m ago", "2d ago")
   * @param {string|Date} dateStr
   * @param {Date} [now]
   * @returns {string}
   */
  Analytics.formatRelativeTime = function(dateStr, now = new Date()) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return diffMin + 'm ago';
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return diffHours + 'h ago';
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return diffDays + 'd ago';
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return diffMonths + 'mo ago';
    return Math.floor(diffMonths / 12) + 'y ago';
  };

  /**
   * Derive user activity milestone description
   * @param {UserProfile} user
   * @returns {string}
   */
  Analytics.deriveUserActivityType = function(user) {
    if (!user) return 'Platform Activity';
    if (user.site_type === 'upload') return 'Custom Site Upload';
    if (user.featured) return 'Featured on Showcase';
    if (Array.isArray(user.projects) && user.projects.length >= 3) return 'Major Portfolio Build';
    if (Array.isArray(user.works) && user.works.length >= 3) return 'Visual Reel Publish';
    return 'Subdomain Registered';
  };

  /**
   * Compute recent chronological activity stream
   * @param {Array<UserProfile>} users
   * @param {number} [limit=8]
   * @returns {Array<Object>}
   */
  Analytics.computeRecentActivity = function(users, limit = 8) {
    if (!Array.isArray(users)) return [];
    const sorted = [...users].sort((a, b) => {
      const ta = new Date(a.updated_at || a.site_updated_at || a.created_at || 0).getTime();
      const tb = new Date(b.updated_at || b.site_updated_at || b.created_at || 0).getTime();
      return tb - ta;
    });

    return sorted.slice(0, limit).map(u => ({
      username: u.username,
      name: u.name || u.username,
      email: u.email || '',
      type: Analytics.deriveUserActivityType(u),
      timestamp: u.updated_at || u.site_updated_at || u.created_at,
      track: u.track || 'tech',
      template: u.template || 'midnight'
    }));
  };

  /**
   * Normalize search query for case-insensitive matching
   * @param {string} query
   * @returns {string}
   */
  Analytics.sanitizeSearchTerm = function(query) {
    return String(query || '').trim().toLowerCase();
  };

  /**
   * Filter users matching query across username, name, email, title, and skills
   * @param {Array<UserProfile>} users
   * @param {string} query
   * @returns {Array<UserProfile>}
   */
  Analytics.filterUsersByQuery = function(users, query) {
    if (!Array.isArray(users)) return [];
    const q = Analytics.sanitizeSearchTerm(query);
    if (!q) return users;
    return users.filter(u => {
      const skillsStr = Array.isArray(u.skills) ? u.skills.join(' ') : '';
      const text = [u.username, u.name, u.email, u.title, skillsStr, u.template].join(' ').toLowerCase();
      return text.includes(q);
    });
  };

  /**
   * Filter users by portfolio track (tech vs visual)
   * @param {Array<UserProfile>} users
   * @param {string} track - 'all' | 'tech' | 'visual'
   * @returns {Array<UserProfile>}
   */
  Analytics.filterUsersByTrack = function(users, track = 'all') {
    if (!Array.isArray(users)) return [];
    const trk = String(track || 'all').toLowerCase();
    if (trk === 'all' || !trk) return users;
    return users.filter(u => String(u.track || 'tech').toLowerCase() === trk);
  };

  /**
   * Filter users by template theme
   * @param {Array<UserProfile>} users
   * @param {string} template - 'all' or template key
   * @returns {Array<UserProfile>}
   */
  Analytics.filterUsersByTemplate = function(users, template = 'all') {
    if (!Array.isArray(users)) return [];
    const tpl = String(template || 'all').toLowerCase();
    if (tpl === 'all' || !tpl) return users;
    return users.filter(u => String(u.template || 'midnight').toLowerCase() === tpl);
  };

  /**
   * Filter users by approval status
   * @param {Array<UserProfile>} users
   * @param {string} status - 'all' | 'approved' | 'pending' | 'rejected'
   * @returns {Array<UserProfile>}
   */
  Analytics.filterUsersByStatus = function(users, status = 'all') {
    if (!Array.isArray(users)) return [];
    const st = String(status || 'all').toLowerCase();
    if (st === 'all' || !st) return users;
    return users.filter(u => String(u.status || 'pending').toLowerCase() === st);
  };

  const Analytics = {};

  return Analytics;
}));
