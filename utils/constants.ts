// utils/constants.ts
export const REGION_PRICING: Record<string, number> = {
  // Multi-regions
  'US': 6.25,
  'EU': 6.25,
  // US Regions
  'us-central1': 5.00,
  'us-east1': 6.25,
  'us-east4': 6.25,
  'us-west1': 6.25,
  // Europe Regions
  'europe-west1': 5.00,
  'europe-west2': 6.25,
  'europe-west3': 6.25,
  'europe-west6': 9.00,
  // Asia Regions
  'asia-southeast1': 6.25,
  'asia-northeast1': 6.25,
  'asia-east1': 6.25,
  // Others
  'australia-southeast1': 6.88,
  'southamerica-east1': 9.00,
};
export const DEFAULT_REGION = 'US';
