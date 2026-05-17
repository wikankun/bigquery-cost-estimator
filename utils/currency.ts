// utils/currency.ts
export async function fetchExchangeRates(base: string = 'usd') {
  // Latest recommended endpoint: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  return response.json();
}
