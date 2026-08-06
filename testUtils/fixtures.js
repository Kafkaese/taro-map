/**
 * Shared mock data shaped exactly like the countryData object App.jsx's
 * updateActiveCountry() assembles from the API responses, so component
 * tests don't each need to reverse-engineer the shape from scratch.
 */
export const buildCountryData = (overrides = {}) => ({
  name: { value: 'Germany' },
  democracyIndex: { value: 8.67 },
  peaceIndex: { value: 1.5 },
  totalImports: { value: 1500000 },
  importSources: [
    { name: 'US', full_name: 'United States', value: 900000 },
    { name: 'FR', full_name: 'France', value: 600000 },
  ],
  importTimeSeries: [
    { year: 2019, value: 1200000 },
    { year: 2020, value: 1500000 },
  ],
  totalExports: { value: 800000 },
  exportSources: [
    { name: 'PL', full_name: 'Poland', value: 500000 },
    { name: 'IT', full_name: 'Italy', value: 300000 },
  ],
  exportTimeSeries: [
    { year: 2019, value: 700000 },
    { year: 2020, value: 800000 },
  ],
  merchExports: { value: 50000000 },
  ...overrides,
});

export const defaultSettings = {
  language: 'English',
  currency: { value: 'USD', label: 'US Dollar', symbol: '$' },
};
