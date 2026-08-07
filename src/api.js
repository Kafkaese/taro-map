/**
 * Client for the arms-tracker backend API. Centralizes base-URL
 * construction (host/port come from the runtime env-config in production,
 * or process.env in development - see CLAUDE.md) and query-param encoding,
 * so every caller gets the same request-building and error handling instead
 * of each hand-rolling its own fetch calls.
 *
 * Every function takes an optional AbortSignal as its last argument, so
 * callers can cancel a stale, still-in-flight request (e.g. the user
 * hovered/clicked a different country before the previous one resolved)
 * instead of letting it resolve later and overwrite newer data.
 */

const getApiHost = () =>
    window._env_ === undefined ? process.env.REACT_APP_API_HOST : window._env_.REACT_APP_API_HOST;

const getApiPort = () =>
    window._env_ === undefined ? process.env.REACT_APP_API_PORT : window._env_.REACT_APP_API_PORT;

const buildUrl = (path, params) => {
    const query = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    return `https://${getApiHost()}:${getApiPort()}${path}?${query}`;
};

const apiFetch = async (path, params, signal) => {
    const response = await fetch(buildUrl(path, params), { signal });
    if (!response.ok) {
        throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return response.json();
};

export const fetchCountryName = (countryCode, signal) =>
    apiFetch('/metadata/name/short', { country_code: countryCode }, signal);

export const fetchDemocracyIndex = (countryCode, year, signal) =>
    apiFetch('/metadata/democracy_index', { country_code: countryCode, year }, signal);

export const fetchPeaceIndex = (countryCode, year, signal) =>
    apiFetch('/metadata/peace_index', { country_code: countryCode, year }, signal);

export const fetchTotalImports = (countryCode, year, currency, signal) =>
    apiFetch('/arms/imports/total', { country_code: countryCode, year, currency }, signal);

export const fetchImportSources = (countryCode, year, currency, limit = 20, signal) =>
    apiFetch('/arms/imports/by_country', { country_code: countryCode, year, limit, currency }, signal);

export const fetchImportTimeSeries = (countryCode, currency, signal) =>
    apiFetch('/arms/imports/timeseries', { country_code: countryCode, currency }, signal);

export const fetchTotalExports = (countryCode, year, currency, signal) =>
    apiFetch('/arms/exports/total', { country_code: countryCode, year, currency }, signal);

export const fetchExportSources = (countryCode, year, currency, limit = 5, signal) =>
    apiFetch('/arms/exports/by_country', { country_code: countryCode, year, limit, currency }, signal);

export const fetchExportTimeSeries = (countryCode, currency, signal) =>
    apiFetch('/arms/exports/timeseries', { country_code: countryCode, currency }, signal);

export const fetchMerchandiseExports = (countryCode, year, currency, signal) =>
    apiFetch('/merchandise/exports/total', { country_code: countryCode, year, currency }, signal);

// Bulk lookups: which countries have any data at all for a given year (used
// to grey out countries with nothing to show, before the user even hovers).
// Returns a bare array of country codes, e.g. ["DE", "FR"] - not currency
// scoped, since data presence/absence doesn't depend on display currency.
export const fetchAvailableImportCountries = (year, signal) =>
    apiFetch('/arms/imports/available', { year }, signal);

export const fetchAvailableExportCountries = (year, signal) =>
    apiFetch('/arms/exports/available', { year }, signal);
