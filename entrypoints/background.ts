import { fetchExchangeRates } from '@/utils/currency';

export default defineBackground(() => {
  browser.alarms.create('sync-currency', { periodInMinutes: 1440 });

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'sync-currency') {
      await syncCurrency();
    }
  });

  // Initial sync on install/startup
  browser.runtime.onInstalled.addListener(async () => {
    const lastSync = await storage.getItem<number>('local:last_sync');
    if (!lastSync || Date.now() - lastSync > 86400000) {
      await syncCurrency();
    }
  });
});

async function syncCurrency() {
  try {
    const data = await fetchExchangeRates();
    const base = 'usd';
    const rates = data[base];
    if (rates) {
      await storage.setItem('local:rates', rates);
      await storage.setItem('local:last_sync', Date.now());
      console.log('Currency rates synced successfully');
    }
  } catch (error) {
    console.error('Failed to sync currency:', error);
  }
}
