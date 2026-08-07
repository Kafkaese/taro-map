/**
 * Client for the arms-tracker backend API. Centralizes base-URL
 * construction (host/port come from the runtime env-config in production,
 * or process.env in development - see CLAUDE.md) and query-param encoding,
 * so every caller gets the same request-building and error handling instead
 * of each hand-rolling its own fetch calls.
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

const apiFetch = async (path, params) => {
    const response = await fetch(buildUrl(path, params));
    if (!response.ok) {
        throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return response.json();
};

export const fetchCountryName = (countryCode) =>
    apiFetch('/metadata/name/short', { country_code: countryCode });

export const fetchDemocracyIndex = (countryCode, year) =>
    apiFetch('/metadata/democracy_index', { country_code: countryCode, year });

export const fetchPeaceIndex = (countryCode, year) =>
    apiFetch('/metadata/peace_index', { country_code: countryCode, year });

export const fetchTotalImports = (countryCode, year, currency) =>
    apiFetch('/arms/imports/total', { country_code: countryCode, year, currency });

export const fetchImportSources = (countryCode, year, currency, limit = 20) =>
    apiFetch('/arms/imports/by_country', { country_code: countryCode, year, limit, currency });

export const fetchImportTimeSeries = (countryCode, currency) =>
    apiFetch('/arms/imports/timeseries', { country_code: countryCode, currency });

export const fetchTotalExports = (countryCode, year, currency) =>
    apiFetch('/arms/exports/total', { country_code: countryCode, year, currency });

export const fetchExportSources = (countryCode, year, currency, limit = 5) =>
    apiFetch('/arms/exports/by_country', { country_code: countryCode, year, limit, currency });

export const fetchExportTimeSeries = (countryCode, currency) =>
    apiFetch('/arms/exports/timeseries', { country_code: countryCode, currency });

export const fetchMerchandiseExports = (countryCode, year, currency) =>
    apiFetch('/merchandise/exports/total', { country_code: countryCode, year, currency });
