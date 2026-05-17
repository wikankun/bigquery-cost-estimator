// tests/currency.test.ts
import { describe, it, expect, vi } from 'vitest';
import { fetchExchangeRates } from '../utils/currency';

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
