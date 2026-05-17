// utils/estimator.ts
import { REGION_PRICING, DEFAULT_REGION, FALLBACK_PRICE } from './constants';

export function extractBytes(text: string): number | null {
  // Regex to match value and unit (MB, GB, TB, PB)
  // Handles commas in numbers like "1,234.5 MB"
  const match = text.match(/([\d,\.]+)\s*(MB|GB|TB|PB|B|KB)/i);
  if (!match) return null;

  const value = parseFloat(match[1].replace(/,/g, ''));
  const unit = match[2].toUpperCase();

  const unitPowers: Record<string, number> = {
    'B': 0,
    'KB': 10,
    'MB': 20,
    'GB': 30,
    'TB': 40,
    'PB': 50,
  };

  const power = unitPowers[unit];
  if (power === undefined) return null;

  return value * Math.pow(2, power);
}

export function calculateCost(bytes: number, region: string = DEFAULT_REGION): number {
  const pricePerTiB = REGION_PRICING[region] ?? FALLBACK_PRICE;
  const tib = bytes / Math.pow(2, 40);
  return Number((tib * pricePerTiB).toFixed(4));
}
