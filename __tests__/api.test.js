/**
 * @jest-environment jsdom
 */
import { fetchCountryName, fetchDemocracyIndex } from '../src/api';
import { mockFetchJson } from '../testUtils/mockFetch';

beforeEach(() => {
  process.env.REACT_APP_API_HOST = 'api.example.com';
  process.env.REACT_APP_API_PORT = '443';
  delete window._env_;
});

test('builds the request URL from process.env when window._env_ is not set (dev mode)', async () => {
  const fetchMock = mockFetchJson(() => ({ value: 'Germany' }));
  await fetchCountryName('DE');
  expect(fetchMock).toHaveBeenCalledWith(
    'https://api.example.com:443/metadata/name/short?country_code=DE'
  );
});

test('prefers window._env_ over process.env when both are set (prod/runtime config)', async () => {
  window._env_ = { REACT_APP_API_HOST: 'runtime.example.com', REACT_APP_API_PORT: '8443' };
  const fetchMock = mockFetchJson(() => ({ value: 'Germany' }));
  await fetchCountryName('DE');
  expect(fetchMock).toHaveBeenCalledWith(
    'https://runtime.example.com:8443/metadata/name/short?country_code=DE'
  );
});

test('URL-encodes query parameters', async () => {
  const fetchMock = mockFetchJson(() => ({ value: 8.67 }));
  await fetchDemocracyIndex('DE', 2020);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://api.example.com:443/metadata/democracy_index?country_code=DE&year=2020'
  );
});

test('resolves with the parsed JSON body on success', async () => {
  mockFetchJson(() => ({ value: 'Germany' }));
  await expect(fetchCountryName('DE')).resolves.toEqual({ value: 'Germany' });
});

test('rejects when the response is not ok, instead of resolving with an error body', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) })
  );
  await expect(fetchCountryName('DE')).rejects.toThrow();
});
