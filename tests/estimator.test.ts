// tests/estimator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCost, extractBytes } from '../utils/estimator';

describe('calculateCost', () => {
  it('calculates cost correctly for 1 TiB in us-central1', () => {
    const bytes = Math.pow(2, 40); // 1 TiB
    const region = 'us-central1';
    expect(calculateCost(bytes, region)).toBe(5.00);
  });

  it('calculates cost correctly for 1 TiB in US (default)', () => {
    const bytes = Math.pow(2, 40); // 1 TiB
    expect(calculateCost(bytes)).toBe(6.25);
  });
});

describe('extractBytes', () => {
  it('extracts bytes from "1.5 GB"', () => {
    expect(extractBytes('This query will process 1.5 GB when run.')).toBe(1.5 * Math.pow(1024, 3));
  });

  it('extracts bytes from "100 MB"', () => {
    expect(extractBytes('100 MB will be processed')).toBe(100 * Math.pow(1024, 2));
  });

  it('extracts bytes from "2.1 TB"', () => {
    expect(extractBytes('2.1 TB')).toBe(2.1 * Math.pow(1024, 4));
  });

  it('extracts bytes with commas "1,234.5 MB"', () => {
    expect(extractBytes('1,234.5 MB')).toBe(1234.5 * Math.pow(1024, 2));
  });

  it('returns null for no match', () => {
    expect(extractBytes('No bytes here')).toBeNull();
  });
});

