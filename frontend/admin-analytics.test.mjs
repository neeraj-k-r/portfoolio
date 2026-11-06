import test from 'node:test';
import assert from 'node:assert/strict';
import Analytics from './admin-analytics.js';

test('Analytics module initializes correctly', () => {
  assert.ok(Analytics, 'Analytics module must exist');
  assert.equal(typeof Analytics.computeTotalUsers, 'function');
  assert.equal(typeof Analytics.aggregatePlatformKPIs, 'function');
});

test('computeTotalUsers handles valid lists and edge cases', () => {
  assert.equal(Analytics.computeTotalUsers([]), 0);
  assert.equal(Analytics.computeTotalUsers(null), 0);
  assert.equal(Analytics.computeTotalUsers([{ username: 'u1' }, { username: 'u2' }]), 2);
});

test('computeStatusCounts computes approved, pending, and rejected', () => {
  const users = [
    { username: 'u1', status: 'approved' },
    { username: 'u2', status: 'pending' },
    { username: 'u3', status: 'rejected' },
    { username: 'u4', status: 'approved' }
  ];
  const counts = Analytics.computeStatusCounts(users);
  assert.deepEqual(counts, { approved: 2, pending: 1, rejected: 1 });
});

test('computeTrackBreakdown computes tech vs visual counts and percentages', () => {
  const users = [
    { username: 'u1', track: 'tech' },
    { username: 'u2', track: 'visual' },
    { username: 'u3', track: 'visual' },
    { username: 'u4', track: 'tech' }
  ];
  const breakdown = Analytics.computeTrackBreakdown(users);
  assert.equal(breakdown.tech, 2);
  assert.equal(breakdown.visual, 2);
  assert.equal(breakdown.techPercent, 50);
  assert.equal(breakdown.visualPercent, 50);
});

test('computeHostingBreakdown computes builder vs upload counts and percentages', () => {
  const users = [
    { username: 'u1', site_type: 'builder' },
    { username: 'u2', site_type: 'upload' },
    { username: 'u3', site_type: 'builder' }
  ];
  const hosting = Analytics.computeHostingBreakdown(users);
  assert.equal(hosting.builder, 2);
  assert.equal(hosting.upload, 1);
  assert.equal(hosting.builderPercent, 67);
  assert.equal(hosting.uploadPercent, 33);
});

test('computeContentTotals sums projects, works, and skills', () => {
  const users = [
    { username: 'u1', projects: [{}, {}], skills: ['a', 'b'] },
    { username: 'u2', works: [{}, {}, {}], skills: ['c'] }
  ];
  const content = Analytics.computeContentTotals(users);
  assert.equal(content.projects, 2);
  assert.equal(content.works, 3);
  assert.equal(content.skills, 3);
  assert.equal(content.totalContent, 5);
});

test('aggregatePlatformKPIs combines all platform metrics accurately', () => {
  const users = [
    { username: 'u1', status: 'approved', track: 'tech', site_type: 'builder', projects: [{}], skills: ['React'] },
    { username: 'u2', status: 'pending', track: 'visual', site_type: 'upload', works: [{}], featured: true }
  ];
  const kpis = Analytics.aggregatePlatformKPIs(users);
  assert.equal(kpis.totalUsers, 2);
  assert.equal(kpis.approvedCount, 1);
  assert.equal(kpis.pendingCount, 1);
  assert.equal(kpis.techCount, 1);
  assert.equal(kpis.visualCount, 1);
  assert.equal(kpis.featuredCount, 1);
});

test('computeTopTemplates ranks templates by popularity', () => {
  const users = [
    { username: 'u1', template: 'suki' },
    { username: 'u2', template: 'suki' },
    { username: 'u3', template: 'mythos' },
    { username: 'u4', template: 'midnight' }
  ];
  const top = Analytics.computeTopTemplates(users, 3);
  assert.equal(top[0].id, 'suki');
  assert.equal(top[0].count, 2);
  assert.equal(top[0].percent, 50);
});
