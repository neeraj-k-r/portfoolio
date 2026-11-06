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

  const Analytics = {};

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

  /**
   * Filter users by hosting site type (builder vs upload)
   * @param {Array<UserProfile>} users
   * @param {string} siteType - 'all' | 'builder' | 'upload'
   * @returns {Array<UserProfile>}
   */
  Analytics.filterUsersBySiteType = function(users, siteType = 'all') {
    if (!Array.isArray(users)) return [];
    const st = String(siteType || 'all').toLowerCase();
    if (st === 'all' || !st) return users;
    return users.filter(u => String(u.site_type || 'builder').toLowerCase() === st);
  };

  /**
   * Sort users by newest registration date first
   * @param {Array<UserProfile>} users
   * @returns {Array<UserProfile>}
   */
  Analytics.sortUsersByNewest = function(users) {
    if (!Array.isArray(users)) return [];
    return [...users].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  };

  /**
   * Sort users by oldest registration date first
   * @param {Array<UserProfile>} users
   * @returns {Array<UserProfile>}
   */
  Analytics.sortUsersByOldest = function(users) {
    if (!Array.isArray(users)) return [];
    return [...users].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  };

  /**
   * Sort users by highest projects and works count
   * @param {Array<UserProfile>} users
   * @returns {Array<UserProfile>}
   */
  Analytics.sortUsersByContent = function(users) {
    if (!Array.isArray(users)) return [];
    return [...users].sort((a, b) => {
      const ca = (Array.isArray(a.projects) ? a.projects.length : 0) + (Array.isArray(a.works) ? a.works.length : 0);
      const cb = (Array.isArray(b.projects) ? b.projects.length : 0) + (Array.isArray(b.works) ? b.works.length : 0);
      return cb - ca;
    });
  };

  /**
   * Sort users alphabetically by username
   * @param {Array<UserProfile>} users
   * @returns {Array<UserProfile>}
   */
  Analytics.sortUsersByUsername = function(users) {
    if (!Array.isArray(users)) return [];
    return [...users].sort((a, b) => String(a.username || '').localeCompare(String(b.username || '')));
  };

  /**
   * Sort users by most recent activity timestamp
   * @param {Array<UserProfile>} users
   * @returns {Array<UserProfile>}
   */
  Analytics.sortUsersByActivity = function(users) {
    if (!Array.isArray(users)) return [];
    return [...users].sort((a, b) => {
      const ta = new Date(a.updated_at || a.site_updated_at || a.created_at || 0).getTime();
      const tb = new Date(b.updated_at || b.site_updated_at || b.created_at || 0).getTime();
      return tb - ta;
    });
  };

  /**
   * Master filter and sort pipeline
   * @param {Array<UserProfile>} users
   * @param {Object} [options]
   * @returns {Array<UserProfile>}
   */
  Analytics.filterAndSortUsers = function(users, options = {}) {
    let result = Array.isArray(users) ? [...users] : [];
    if (options.query) result = Analytics.filterUsersByQuery(result, options.query);
    if (options.track && options.track !== 'all') result = Analytics.filterUsersByTrack(result, options.track);
    if (options.template && options.template !== 'all') result = Analytics.filterUsersByTemplate(result, options.template);
    if (options.status && options.status !== 'all') result = Analytics.filterUsersByStatus(result, options.status);
    if (options.siteType && options.siteType !== 'all') result = Analytics.filterUsersBySiteType(result, options.siteType);

    const sort = options.sortBy || 'newest';
    if (sort === 'oldest') result = Analytics.sortUsersByOldest(result);
    else if (sort === 'content') result = Analytics.sortUsersByContent(result);
    else if (sort === 'username') result = Analytics.sortUsersByUsername(result);
    else if (sort === 'activity') result = Analytics.sortUsersByActivity(result);
    else result = Analytics.sortUsersByNewest(result);

    return result;
  };

  /**
   * Escape and quote field for CSV output
   * @param {*} val
   * @returns {string}
   */
  Analytics.escapeCSVField = function(val) {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return '"' + s + '"';
  };

  /**
   * Generate CSV report string of all users and analytics metadata
   * @param {Array<UserProfile>} users
   * @returns {string}
   */
  Analytics.exportAnalyticsCSV = function(users) {
    const headers = [
      'Username', 'Name', 'Email', 'Title', 'Track', 'Template',
      'Site Type', 'Status', 'Projects Count', 'Works Count', 'Skills Count',
      'Featured', 'Created At', 'Last Active'
    ];
    const rows = [headers.join(',')];
    if (Array.isArray(users)) {
      users.forEach(u => {
        const pCount = Array.isArray(u.projects) ? u.projects.length : 0;
        const wCount = Array.isArray(u.works) ? u.works.length : 0;
        const sCount = Array.isArray(u.skills) ? u.skills.length : 0;
        const lastActive = u.updated_at || u.site_updated_at || u.created_at || '';
        const row = [
          u.username || '',
          u.name || '',
          u.email || '',
          u.title || '',
          u.track || 'tech',
          u.template || 'midnight',
          u.site_type || 'builder',
          u.status || 'pending',
          pCount,
          wCount,
          sCount,
          u.featured ? 'Yes' : 'No',
          u.created_at || '',
          lastActive
        ];
        rows.push(row.map(Analytics.escapeCSVField).join(','));
      });
    }
    return rows.join('\r\n');
  };

  /**
   * Generate JSON report string with aggregated metrics and user dataset
   * @param {Array<UserProfile>} users
   * @returns {string}
   */
  Analytics.exportAnalyticsJSON = function(users) {
    const kpis = Analytics.aggregatePlatformKPIs(users);
    const topTemplates = Analytics.computeTopTemplates(users, 39);
    const activity = Analytics.computeRecentActivity(users, 20);
    const exportData = {
      generatedAt: new Date().toISOString(),
      kpis,
      topTemplates,
      recentActivity: activity,
      users: Array.isArray(users) ? users : []
    };
    return JSON.stringify(exportData, null, 2);
  };

  /**
   * Render HTML for the 4 top-level KPI metric cards
   * @param {Object} kpis
   * @returns {string}
   */
  Analytics.renderKPICardsHTML = function(kpis) {
    const k = kpis || {};
    return `
      <div class="an-kpi-grid">
        <div class="an-kpi-card">
          <div class="an-kpi-num" style="color:var(--an-cyan)">${k.totalUsers || 0}</div>
          <div class="an-kpi-label">Total Creators</div>
          <div class="an-kpi-sub">${k.approvedCount || 0} live approved • ${k.pendingCount || 0} pending</div>
        </div>
        <div class="an-kpi-card">
          <div class="an-kpi-num" style="color:var(--an-lime)">${k.approvedCount || 0}</div>
          <div class="an-kpi-label">Live Subdomains</div>
          <div class="an-kpi-sub">${k.totalUsers > 0 ? Math.round((k.approvedCount / k.totalUsers) * 100) : 0}% approval rate</div>
        </div>
        <div class="an-kpi-card">
          <div class="an-kpi-num" style="color:var(--an-purple)">${k.techCount || 0} : ${k.visualCount || 0}</div>
          <div class="an-kpi-label">Tech vs Visual Track</div>
          <div class="an-kpi-sub">${k.techPercent || 0}% tech • ${k.visualPercent || 0}% visual & creative</div>
        </div>
        <div class="an-kpi-card">
          <div class="an-kpi-num" style="color:var(--an-amber)">${k.totalContent || 0}</div>
          <div class="an-kpi-label">Projects & Works</div>
          <div class="an-kpi-sub">${k.totalProjects || 0} code repos • ${k.totalWorks || 0} media pieces</div>
        </div>
      </div>`;
  };

  /**
   * Render HTML for the Dual-Track Distribution Card
   * @param {Object} kpis
   * @returns {string}
   */
  Analytics.renderTrackDistributionCardHTML = function(kpis) {
    const k = kpis || {};
    return `
      <div class="an-chart-card">
        <div class="an-chart-head">
          <div class="an-chart-title">⚖️ Creator Track Distribution</div>
          <span class="mono" style="font-size:12px;color:var(--muted)">${k.totalUsers || 0} total</span>
        </div>
        <p style="font-size:13px;color:var(--muted)">Ratio of technical software engineers vs visual, media & design portfolios.</p>
        <div class="an-progress-bar">
          <div class="an-progress-fill-tech" style="width:${k.techPercent || 50}%" title="Technical: ${k.techPercent}%"></div>
          <div class="an-progress-fill-visual" style="width:${k.visualPercent || 50}%" title="Visual & Creative: ${k.visualPercent}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-top:6px">
          <span><b style="color:#818cf8">💻 Tech Track:</b> ${k.techCount || 0} (${k.techPercent || 0}%)</span>
          <span><b style="color:#f472b6">🎨 Visual Track:</b> ${k.visualCount || 0} (${k.visualPercent || 0}%)</span>
        </div>
      </div>`;
  };

  /**
   * Render HTML for Hosting Mode Breakdown Card
   * @param {Object} kpis
   * @returns {string}
   */
  Analytics.renderHostingDistributionCardHTML = function(kpis) {
    const k = kpis || {};
    return `
      <div class="an-chart-card">
        <div class="an-chart-head">
          <div class="an-chart-title">📦 Site Hosting Modes</div>
          <span class="mono" style="font-size:12px;color:var(--muted)">${k.totalUsers || 0} subdomains</span>
        </div>
        <p style="font-size:13px;color:var(--muted)">Usage of automated builder templates vs custom uploaded ZIP bundles.</p>
        <div class="an-progress-bar">
          <div style="background:#22d3ee;width:${k.builderPercent || 100}%;height:100%" title="Builder Themes: ${k.builderPercent}%"></div>
          <div style="background:#fbbf24;width:${k.uploadPercent || 0}%;height:100%" title="Custom Uploads: ${k.uploadPercent}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-top:6px">
          <span><b style="color:#22d3ee">🎨 Builder Themes:</b> ${k.builderCount || 0} (${k.builderPercent || 0}%)</span>
          <span><b style="color:#fbbf24">📁 Custom Uploads:</b> ${k.uploadCount || 0} (${k.uploadPercent || 0}%)</span>
        </div>
      </div>`;
  };

  /**
   * Render HTML for Top Template Adoption Chart Card
   * @param {Array<Object>} topTemplates
   * @returns {string}
   */
  Analytics.renderTemplateAdoptionCardHTML = function(topTemplates) {
    const list = Array.isArray(topTemplates) ? topTemplates : [];
    return `
      <div class="an-chart-card">
        <div class="an-chart-head">
          <div class="an-chart-title">🔥 Most Popular Portfolio Themes</div>
          <span class="mono" style="font-size:12px;color:var(--muted)">Top ${list.length}</span>
        </div>
        <div class="an-tpl-list">
          ${list.length ? list.map(t => `
            <div class="an-tpl-item">
              <span class="an-tpl-name">${t.emoji} ${t.name}</span>
              <div class="an-tpl-bar-wrap">
                <div class="an-tpl-bar-fill" style="width:${Math.max(t.percent, 8)}%"></div>
              </div>
              <span class="an-tpl-count">${t.count} (${t.percent}%)</span>
            </div>`).join('') : '<p style="color:var(--muted);font-size:13px">No template data recorded yet.</p>'}
        </div>
      </div>`;
  };

  /**
   * Render HTML for Recent Activity Stream Card
   * @param {Array<Object>} activity
   * @returns {string}
   */
  Analytics.renderActivityFeedCardHTML = function(activity) {
    const list = Array.isArray(activity) ? activity : [];
    return `
      <div class="an-chart-card">
        <div class="an-chart-head">
          <div class="an-chart-title">⚡ Chronological Platform Activity</div>
          <span class="mono" style="font-size:12px;color:var(--muted)">Latest ${list.length}</span>
        </div>
        <div class="an-feed-list">
          ${list.length ? list.map(a => `
            <div class="an-feed-item">
              <div class="an-feed-meta">
                <b>@${a.username}</b>
                <span class="an-track-tag ${a.track}">${a.type}</span>
              </div>
              <span class="an-feed-time">${Analytics.formatRelativeTime(a.timestamp)}</span>
            </div>`).join('') : '<p style="color:var(--muted);font-size:13px">No recent user activity.</p>'}
        </div>
      </div>`;
  };

  /**
   * Render Search and Filter controls bar
   * @param {Object} [state]
   * @returns {string}
   */
  Analytics.renderAnalyticsFilterControlsHTML = function(state = {}) {
    const activeTrack = state.track || 'all';
    const activeStatus = state.status || 'all';
    const q = state.query || '';
    return `
      <div class="an-filters-bar">
        <div class="an-search-wrap">
          <span class="an-search-icon">🔍</span>
          <input type="text" id="anSearchInput" placeholder="Search by username, name, email, or theme..." value="${q}">
        </div>
        <div class="an-pills">
          <button class="an-pill ${activeTrack === 'all' ? 'is-active' : ''}" data-an-track="all">All Tracks</button>
          <button class="an-pill ${activeTrack === 'tech' ? 'is-active' : ''}" data-an-track="tech">💻 Tech</button>
          <button class="an-pill ${activeTrack === 'visual' ? 'is-active' : ''}" data-an-track="visual">🎨 Visual</button>
          <button class="an-pill ${activeStatus === 'approved' ? 'is-active' : ''}" data-an-status="approved">Live Only</button>
          <button class="an-pill ${activeStatus === 'pending' ? 'is-active' : ''}" data-an-status="pending">Pending</button>
        </div>
      </div>`;
  };

  /**
   * Render User Avatar / Monogram Initial
   * @param {UserProfile} user
   * @returns {string}
   */
  Analytics.renderUserMonogramAvatar = function(user) {
    const u = user || {};
    const initial = (u.name || u.username || '?').trim().charAt(0).toUpperCase();
    if (u.avatarUrl || u.avatar_url) {
      return `<img src="${u.avatarUrl || u.avatar_url}" alt="${u.name || u.username}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid var(--stroke)">`;
    }
    return `<span style="width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:#fff;background:linear-gradient(135deg,#6366f1,#22d3ee);flex-shrink:0">${initial}</span>`;
  };

  /**
   * Render Track Badge Component
   * @param {string} track
   * @returns {string}
   */
  Analytics.renderTrackBadgeHTML = function(track) {
    const isVisual = String(track).toLowerCase() === 'visual';
    return `<span class="an-track-tag ${isVisual ? 'visual' : 'tech'}">${isVisual ? '🎨 Visual' : '💻 Tech'}</span>`;
  };

  /**
   * Render Template Pill with Emoji
   * @param {string} templateId
   * @returns {string}
   */
  Analytics.renderTemplatePillHTML = function(templateId) {
    const id = String(templateId || 'midnight').toLowerCase();
    const meta = Analytics.TEMPLATE_METADATA[id] || { name: id, emoji: '🎨' };
    return `<span class="an-tpl-tag">${meta.emoji} ${meta.name}</span>`;
  };

  /**
   * Render Status Badge
   * @param {string} status
   * @returns {string}
   */
  Analytics.renderStatusBadgeHTML = function(status) {
    const st = String(status || 'pending').toLowerCase();
    if (st === 'approved') return '<span class="status-pill live">Live</span>';
    if (st === 'rejected') return '<span class="status-pill rejected">Rejected</span>';
    return '<span class="status-pill pending">Pending</span>';
  };

  /**
   * Render User Content Stats Column
   * @param {UserProfile} user
   * @returns {string}
   */
  Analytics.renderUserContentStatsHTML = function(user) {
    const u = user || {};
    const pCount = Array.isArray(u.projects) ? u.projects.length : 0;
    const wCount = Array.isArray(u.works) ? u.works.length : 0;
    const hasResume = Boolean(u.resume && (u.resume.summary || (Array.isArray(u.experience) && u.experience.length)));
    return `
      <div style="font-size:12px;color:var(--muted)">
        ${pCount > 0 ? `<span><b>${pCount}</b> proj</span>` : ''}
        ${wCount > 0 ? `<span><b>${wCount}</b> works</span>` : ''}
        ${hasResume ? '<span style="color:#a3e635"> • 📄 ATS</span>' : ''}
      </div>`;
  };

  /**
   * Render Action Buttons for an individual user
   * @param {UserProfile} user
   * @returns {string}
   */
  Analytics.renderUserActionsHTML = function(user) {
    const u = user || {};
    const subUrl = `https://${u.username}.portfoolio.me`;
    return `
      <div style="display:flex;gap:6px;justify-content:flex-end">
        <a class="btn btn-ghost btn-sm" href="/?u=${encodeURIComponent(u.username)}" target="_blank" title="Preview site">👁️</a>
        <a class="btn btn-ghost btn-sm" href="${subUrl}" target="_blank" title="Open live subdomain">↗</a>
      </div>`;
  };

  /**
   * Render Table Row for a single user
   * @param {UserProfile} user
   * @param {number} idx
   * @returns {string}
   */
  Analytics.renderAnalyticsTableRowHTML = function(user, idx) {
    const u = user || {};
    return `
      <tr>
        <td style="width:40px;color:var(--muted);font-family:'JetBrains Mono'">#${idx + 1}</td>
        <td>
          <div style="display:flex;gap:12px;align-items:center">
            ${Analytics.renderUserMonogramAvatar(u)}
            <div>
              <b>@${u.username}</b> ${u.featured ? '⭐' : ''}
              <div style="font-size:12px;color:var(--muted)">${u.name || 'Anonymous'}</div>
            </div>
          </div>
        </td>
        <td>
          <a href="mailto:${u.email || ''}" style="color:#94a3b8;font-size:12.5px;text-decoration:none">${u.email || '—'}</a>
        </td>
        <td>${Analytics.renderTrackBadgeHTML(u.track)}</td>
        <td>${Analytics.renderTemplatePillHTML(u.template)}</td>
        <td>${Analytics.renderStatusBadgeHTML(u.status)}</td>
        <td>${Analytics.renderUserContentStatsHTML(u)}</td>
        <td>
          <span style="font-family:'JetBrains Mono';font-size:12px;color:var(--muted)" title="${u.created_at || ''}">
            ${Analytics.formatRelativeTime(u.created_at)}
          </span>
        </td>
        <td style="text-align:right">${Analytics.renderUserActionsHTML(u)}</td>
      </tr>`;
  };

  /**
   * Render complete user analytics table
   * @param {Array<UserProfile>} users
   * @returns {string}
   */
  Analytics.renderAnalyticsTableHTML = function(users) {
    const list = Array.isArray(users) ? users : [];
    if (!list.length) {
      return `
        <div class="an-table-wrap" style="padding:40px;text-align:center">
          <p style="color:var(--muted);font-size:14px">No users matched your search criteria.</p>
        </div>`;
    }

    return `
      <div class="an-table-wrap">
        <table class="an-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Creator</th>
              <th>Email</th>
              <th>Track</th>
              <th>Theme</th>
              <th>Status</th>
              <th>Content</th>
              <th>Joined</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((u, i) => Analytics.renderAnalyticsTableRowHTML(u, i)).join('')}
          </tbody>
        </table>
      </div>`;
  };

  /**
   * Render complete Analytics Dashboard view
   * @param {Array<UserProfile>} users
   * @param {Object} [options]
   * @returns {string}
   */
  Analytics.renderAnalyticsDashboardViewHTML = function(users, options = {}) {
    const list = Array.isArray(users) ? users : [];
    const kpis = Analytics.aggregatePlatformKPIs(list);
    const topTemplates = Analytics.computeTopTemplates(list, 6);
    const activity = Analytics.computeRecentActivity(list, 6);
    const filteredUsers = Analytics.filterAndSortUsers(list, options);

    return `
      <div class="an-dashboard">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
          <div>
            <h2 style="font-size:22px;margin:0 0 4px">📊 Platform Analytics & User Insights</h2>
            <p style="color:var(--muted);font-size:13px;margin:0">Live metrics, template adoption rates, and creator directories.</p>
          </div>
          <div class="an-btn-group">
            <button class="an-btn-export" id="anExportCsvBtn"><i class="fa-solid fa-file-csv"></i> Export CSV</button>
            <button class="an-btn-export" id="anExportJsonBtn"><i class="fa-solid fa-file-code"></i> Export JSON</button>
            <button class="btn btn-ghost btn-sm" id="anRefreshBtn"><i class="fa-solid fa-rotate"></i> Refresh</button>
          </div>
        </div>

        ${Analytics.renderKPICardsHTML(kpis)}

        <div class="an-charts-grid">
          ${Analytics.renderTrackDistributionCardHTML(kpis)}
          ${Analytics.renderHostingDistributionCardHTML(kpis)}
        </div>

        <div class="an-charts-grid">
          ${Analytics.renderTemplateAdoptionCardHTML(topTemplates)}
          ${Analytics.renderActivityFeedCardHTML(activity)}
        </div>

        <div style="margin-top:32px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:18px;margin:0">👥 Creator User Directory (${filteredUsers.length} of ${list.length})</h3>
          </div>
          ${Analytics.renderAnalyticsFilterControlsHTML(options)}
          <div id="anTableContainer">
            ${Analytics.renderAnalyticsTableHTML(filteredUsers)}
          </div>
        </div>
      </div>`;
  };

  /**
   * Browser file download helper for CSV
   * @param {Array<UserProfile>} users
   * @param {string} [filename]
   */
  Analytics.downloadCSV = function(users, filename = 'portfoolio-analytics.csv') {
    if (typeof window === 'undefined' || !window.Blob) return;
    const csv = Analytics.exportAnalyticsCSV(users);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /**
   * Browser file download helper for JSON
   * @param {Array<UserProfile>} users
   * @param {string} [filename]
   */
  Analytics.downloadJSON = function(users, filename = 'portfoolio-analytics.json') {
    if (typeof window === 'undefined' || !window.Blob) return;
    const jsonStr = Analytics.exportAnalyticsJSON(users);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Global namespace binding
  if (typeof window !== 'undefined') {
    window.PortfoolioAdminAnalytics = Analytics;
  }

  return Analytics;
}));

// Finalized 90-commit analytics release
