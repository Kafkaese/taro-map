/**
 * Simple env-var-driven feature flags. Follows the same runtime-config
 * pattern api.js's getApiHost/getApiPort already use: window._env_ (set at
 * deploy time via env-config.js, see CLAUDE.md) wins over process.env
 * (dev-time .env / build-time default) - so a flag can be flipped by
 * editing the deployed env-config.js directly, without a full
 * rebuild-and-redeploy through CI.
 */

const readFlag = (name, defaultValue) => {
    const raw = window._env_ === undefined ? process.env[name] : window._env_[name];
    if (raw === undefined || raw === '') return defaultValue;
    return raw === 'true' || raw === '1';
};

// Ongoing Conflicts sidebar section - the disclaimer banner, conflict
// cards, methodology dialog, and the GET /conflicts/by_country fetch that
// feeds them. Defaults to enabled: this is a kill switch for rolling the
// feature back quickly (the underlying data is AI-compiled and low-
// confidence, see OngoingConflicts.jsx's own disclaimer), not an opt-in
// flag that ships dark by default.
export const isConflictsFeatureEnabled = () =>
    readFlag('REACT_APP_FEATURE_CONFLICTS', true);
