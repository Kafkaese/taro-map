import {
  getDemocracyColor,
  getPeaceColor,
  getUSDColor,
  formatUSDorder,
  formatUSDvalue,
  formatTooltipValue,
} from '../src/components/formattingUtils';

describe('getDemocracyColor', () => {
  test('full democracy (>= 9.0) is dark green', () => {
    expect(getDemocracyColor(9.0)).toBe('#008000');
    expect(getDemocracyColor(10)).toBe('#008000');
  });
  test('flawed democracy (>= 7.0, < 9.0) is light green', () => {
    expect(getDemocracyColor(7.0)).toBe('#98fb98');
    expect(getDemocracyColor(8.99)).toBe('#98fb98');
  });
  test('hybrid regime (>= 4.0, < 7.0) is orange', () => {
    expect(getDemocracyColor(4.0)).toBe('#ffae42');
    expect(getDemocracyColor(6.99)).toBe('#ffae42');
  });
  test('authoritarian (>= 0.0, < 4.0) is dark red', () => {
    expect(getDemocracyColor(0)).toBe('#8b0000');
    expect(getDemocracyColor(3.99)).toBe('#8b0000');
  });
  test('negative/unknown values fall back to grey', () => {
    expect(getDemocracyColor(-1)).toBe('#383838');
  });
});

describe('getPeaceColor', () => {
  test('< 1.0 is green', () => {
    expect(getPeaceColor(0)).toBe('#00E676');
  });
  test('< 2.0 is green-yellow', () => {
    expect(getPeaceColor(1.0)).toBe('#C6FF00');
  });
  test('< 3.0 is yellow', () => {
    expect(getPeaceColor(2.0)).toBe('#d4d400');
  });
  test('< 4.0 is orange', () => {
    expect(getPeaceColor(3.0)).toBe('#FFD600');
  });
  test('>= 4.0 falls back to grey', () => {
    expect(getPeaceColor(4.0)).toBe('#383838');
    expect(getPeaceColor(5)).toBe('#383838');
  });
});

describe('getUSDColor', () => {
  test('high values (>= 4713.75) are dark red', () => {
    expect(getUSDColor(4713.75)).toBe('#8b0000');
  });
  test('mid values (>= 342.5, < 4713.75) are orange', () => {
    expect(getUSDColor(342.5)).toBe('#ffae42');
  });
  test('low non-negative values (>= 0, < 342.5) are green', () => {
    expect(getUSDColor(0)).toBe('#008000');
  });
  test('negative values fall back to grey', () => {
    expect(getUSDColor(-1)).toBe('#383838');
  });
});

describe('formatUSDvalue', () => {
  test('values over a billion are shown in billions', () => {
    expect(formatUSDvalue(2_500_000_000)).toBe('2.50');
  });
  test('values over a million are shown in millions', () => {
    expect(formatUSDvalue(2_500_000)).toBe('2.50');
  });
  test('values over a thousand are shown in thousands', () => {
    expect(formatUSDvalue(2_500)).toBe('2.50');
  });
  test('values at or below a thousand are returned as-is', () => {
    expect(formatUSDvalue(999)).toBe(999);
    expect(formatUSDvalue(0)).toBe(0);
  });
});

describe('formatUSDorder', () => {
  test.each([
    [2_500_000_000, 'billion'],
    [2_500_000, 'million'],
    [2_500, 'thousand'],
    [999, ''],
  ])('formatUSDorder(%d) === %p', (value, expected) => {
    expect(formatUSDorder(value)).toBe(expected);
  });
});

describe('formatTooltipValue', () => {
  test('formats with thousands separators', () => {
    expect(formatTooltipValue(1234567)).toBe('1,234,567');
  });
});
