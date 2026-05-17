import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['alarms', 'storage'],
    host_permissions: ['https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/*.json'],
  },
});
