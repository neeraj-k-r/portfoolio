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

  const Analytics = {};

  return Analytics;
}));
