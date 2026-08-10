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
  conflicts: [],
  ...overrides,
});

/**
 * A single conflicts entry shaped exactly like GET /conflicts/by_country's
 * response, for tests that need the Ongoing Conflicts section to actually
 * render something.
 */
export const buildConflict = (overrides = {}) => ({
  conflict_id: 3,
  name: 'Sudanese civil wars',
  start_year: 1955,
  total_deaths_low: 1521000,
  total_deaths_high: 1521000,
  total_deaths_est: 1600000,
  military_deaths_est: 240000,
  civilian_deaths_est: 1360000,
  refugees_est: 3500000,
  idps_est: 8860000,
  confidence: 'low',
  wikipedia_url: 'https://en.wikipedia.org/wiki/Sudanese_civil_war_(2023%E2%80%93present)',
  notes: 'Test fixture notes.',
  belligerents: [
    { country_name: 'Sudan', alpha2: 'SD' },
    { country_name: 'South Sudan', alpha2: 'SS' },
    { country_name: 'Egypt', alpha2: 'EG' },
  ],
  ...overrides,
});

export const defaultSettings = {
  language: 'English',
  currency: { value: 'USD', label: 'US Dollar', symbol: '$' },
};
