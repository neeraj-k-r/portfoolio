import test from 'node:test';
import assert from 'node:assert/strict';
import Analytics from './admin-analytics.js';

test('Analytics module initializes correctly', () => {
  assert.ok(Analytics, 'Analytics module must exist');
  assert.equal(typeof Analytics.computeTotalUsers, 'function');
  assert.equal(typeof Analytics.aggregatePlatformKPIs, 'function');
});
