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

  const Analytics = {};

  return Analytics;
}));
