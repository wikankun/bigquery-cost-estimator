import { describe, it, expect } from 'vitest';
import { extractBytes } from '../utils/estimator';

describe('extractBytes', () => {
  it('extracts MB correctly', () => {
    expect(extractBytes('This query will process 100 MB when run.')).toBe(100 * Math.pow(2, 20));
  });

  it('extracts GB correctly', () => {
    expect(extractBytes('This query will process 1.5 GB when run.')).toBe(1.5 * Math.pow(2, 30));
  });

  it('handles commas in numbers', () => {
    expect(extractBytes('This query will process 1,234.5 MB when run.')).toBe(1234.5 * Math.pow(2, 20));
  });

  it('handles different units', () => {
    expect(extractBytes('10 B')).toBe(10);
    expect(extractBytes('10 KB')).toBe(10 * Math.pow(2, 10));
    expect(extractBytes('10 TB')).toBe(10 * Math.pow(2, 40));
    expect(extractBytes('10 PB')).toBe(10 * Math.pow(2, 50));
  });

  it('returns null if no match', () => {
    expect(extractBytes('No bytes here')).toBeNull();
  });
});
