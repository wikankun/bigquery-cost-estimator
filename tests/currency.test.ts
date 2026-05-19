// tests/currency.test.ts
import { describe, it, expect, vi } from 'vitest';
import { fetchExchangeRates, formatCost } from '../utils/currency';

describe('fetchExchangeRates', () => {
  it('fetches exchange rates successfully', async () => {
    const mockData = { usd: { eur: 0.85 } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const rates = await fetchExchangeRates('usd');
    expect(rates).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
    );
  });

  it('throws error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await expect(fetchExchangeRates('usd')).rejects.toThrow('Failed to fetch exchange rates');
  });
});

describe('formatCost', () => {
  it('formats USD without decimals', () => {
    const result = formatCost(12.3456, { code: 'usd' }, false);
    // Use regex to match localized currency symbols which might vary by environment, 
    // but usually it's $12 in en-US
    expect(result).toMatch(/\$12/);
  });

  it('formats USD with 4 decimals', () => {
    const result = formatCost(12.34567, { code: 'usd' }, true);
    expect(result).toMatch(/\$12\.3457/);
  });

  it('formats with exchange rate', () => {
    const result = formatCost(10, { code: 'eur', locale: 'de-DE' }, true, 0.9);
    // 10 * 0.9 = 9.0000 EUR
    // German format uses comma for decimal and space for symbol usually
    expect(result).toMatch(/9,0000\s*€/);
  });

  it('rounds to nearest integer when decimals hidden', () => {
    expect(formatCost(12.5, { code: 'usd' }, false)).toMatch(/\$13/);
    expect(formatCost(12.4, { code: 'usd' }, false)).toMatch(/\$12/);
  });
});
