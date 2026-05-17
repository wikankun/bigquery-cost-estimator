// tests/estimator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCost } from '../utils/estimator';

describe('calculateCost', () => {
  it('calculates cost correctly for 1 TiB in us-central1', () => {
    const bytes = Math.pow(2, 40); // 1 TiB
    const region = 'us-central1';
    expect(calculateCost(bytes, region)).toBe(5.00); // us-central1 is low-cost ($5.00)
  });
});
