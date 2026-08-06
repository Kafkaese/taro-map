/**
 * Installs global.fetch as a jest mock that resolves with JSON built by
 * `responder(url)`. Returns the mock so callers can inspect `.mock.calls`
 * to assert exactly which URLs were requested.
 *
 * `responder` receives the full request URL and must return the payload
 * to resolve with. Returning `undefined` resolves with `response.ok: false`,
 * mirroring a failed request.
 */
export const mockFetchJson = (responder) => {
  global.fetch = jest.fn((url) => {
    const data = responder(url);
    if (data === undefined) {
      return Promise.resolve({ ok: false, json: () => Promise.resolve(null) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
  });
  return global.fetch;
};
