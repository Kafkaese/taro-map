import {
  getDemocracyColor,
  getPeaceColor,
  getUSDColor,
  formatUSDorder,
  formatUSDvalue,
  formatTooltipValue,
} from '../src/components/formattingUtils';

describe('getDemocracyColor', () => {
  test('9 to 10 reuses the GPI "very high" color', () => {
    expect(getDemocracyColor(9.0)).toBe('#048581');
    expect(getDemocracyColor(10)).toBe('#048581');
  });
  test('8 to < 9 is the interpolated step between very high and high', () => {
    expect(getDemocracyColor(8.0)).toBe('#2CA396');
    expect(getDemocracyColor(8.99)).toBe('#2CA396');
  });
  test('7 to < 8 reuses the GPI "high" color', () => {
    expect(getDemocracyColor(7.0)).toBe('#53C1AB');
    expect(getDemocracyColor(7.99)).toBe('#53C1AB');
  });
  test('6 to < 7 is the interpolated step between high and medium', () => {
    expect(getDemocracyColor(6.0)).toBe('#A6D29A');
  });
  test('5 to < 6 reuses the GPI "medium" color', () => {
    expect(getDemocracyColor(5.0)).toBe('#FAE389');
  });
  test('4 to < 5 is the interpolated step between medium and low', () => {
    expect(getDemocracyColor(4.0)).toBe('#F6AA6E');
  });
  test('3 to < 4 reuses the GPI "low" color', () => {
    expect(getDemocracyColor(3.0)).toBe('#F37053');
  });
  test('2 to < 3 is the interpolated step between low and very low', () => {
    expect(getDemocracyColor(2.0)).toBe('#F0463C');
  });
  test('1 to < 2 reuses the GPI "very low" color', () => {
    expect(getDemocracyColor(1.0)).toBe('#ED1D24');
  });
  test('0 to < 1 is the dark red midpoint between very low and black', () => {
    expect(getDemocracyColor(0)).toBe('#760E12');
    expect(getDemocracyColor(0.99)).toBe('#760E12');
  });
  test('negative/unknown values fall back to grey', () => {
    expect(getDemocracyColor(-1)).toBe('#383838');
    expect(getDemocracyColor(NaN)).toBe('#383838');
  });
});

describe('getPeaceColor', () => {
  test('< 1.45 is very high (GPI map legend teal)', () => {
    expect(getPeaceColor(1.0)).toBe('#048581');
  });
  test('1.45 to < 1.905 is high', () => {
    expect(getPeaceColor(1.45)).toBe('#53C1AB');
    expect(getPeaceColor(1.7)).toBe('#53C1AB');
  });
  test('1.905 to < 2.35 is medium', () => {
    expect(getPeaceColor(1.905)).toBe('#FAE389');
    expect(getPeaceColor(2.0)).toBe('#FAE389');
  });
  test('2.35 to < 2.9 is low', () => {
    expect(getPeaceColor(2.35)).toBe('#F37053');
    expect(getPeaceColor(2.5)).toBe('#F37053');
  });
  test('>= 2.9 is very low', () => {
    expect(getPeaceColor(2.9)).toBe('#ED1D24');
    expect(getPeaceColor(3.5)).toBe('#ED1D24');
  });
  test('NaN falls back to grey', () => {
    expect(getPeaceColor(NaN)).toBe('#383838');
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
