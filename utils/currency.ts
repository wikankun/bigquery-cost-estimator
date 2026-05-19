// utils/currency.ts
export async function fetchExchangeRates(base: string = 'usd') {
  // Latest recommended endpoint: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  return response.json();
}

export function formatCost(
  usdValue: number,
  currency: { code: string; locale?: string },
  showDecimals: boolean,
  exchangeRate: number = 1,
  precision?: number
): string {
  const converted = usdValue * exchangeRate;
  const fractionDigits = precision !== undefined ? precision : (showDecimals ? 4 : 0);

  return new Intl.NumberFormat(currency.locale || 'en-US', {
    style: 'currency',
    currency: currency.code.toUpperCase(),
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(converted);
}
