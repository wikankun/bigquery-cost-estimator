// utils/estimator.ts
import { REGION_PRICING, DEFAULT_REGION } from './constants';

export function calculateCost(bytes: number, region: string = DEFAULT_REGION): number {
  const pricePerTiB = REGION_PRICING[region] || REGION_PRICING[DEFAULT_REGION];
  const tib = bytes / Math.pow(2, 40);
  return Number((tib * pricePerTiB).toFixed(4));
}
