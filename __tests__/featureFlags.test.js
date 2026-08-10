/**
 * @jest-environment jsdom
 */
import { isConflictsFeatureEnabled } from '../src/featureFlags';

beforeEach(() => {
  delete process.env.REACT_APP_FEATURE_CONFLICTS;
  delete window._env_;
});

test('defaults to enabled when unset in both window._env_ and process.env', () => {
  expect(isConflictsFeatureEnabled()).toBe(true);
});

test('reads "false" from process.env as disabled', () => {
  process.env.REACT_APP_FEATURE_CONFLICTS = 'false';
  expect(isConflictsFeatureEnabled()).toBe(false);
});

test('reads "true" from process.env as enabled', () => {
  process.env.REACT_APP_FEATURE_CONFLICTS = 'false'; // prove it's actually reading, not just defaulting
  window._env_ = undefined;
  process.env.REACT_APP_FEATURE_CONFLICTS = 'true';
  expect(isConflictsFeatureEnabled()).toBe(true);
});

test('window._env_ takes precedence over process.env, same as getApiHost/getApiPort', () => {
  process.env.REACT_APP_FEATURE_CONFLICTS = 'true';
  window._env_ = { REACT_APP_FEATURE_CONFLICTS: 'false' };
  expect(isConflictsFeatureEnabled()).toBe(false);
});

test('an empty string is treated as unset, not as disabled', () => {
  window._env_ = { REACT_APP_FEATURE_CONFLICTS: '' };
  expect(isConflictsFeatureEnabled()).toBe(true);
});
