import './style.css';
import { REGIONS, CURRENCIES, REGION_LABELS, REGION_PRICING, DEFAULT_REGION, DEFAULT_CURRENCY } from '@/utils/constants';
import { formatCost } from '@/utils/currency';

async function init() {
  const dailySpendEl = document.querySelector<HTMLSpanElement>('#daily-spend')!;
  const monthlySpendEl = document.querySelector<HTMLSpanElement>('#monthly-spend')!;
  const quotaPercentEl = document.querySelector<HTMLSpanElement>('#quota-percent')!;
  const quotaFillEl = document.querySelector<HTMLDivElement>('#quota-fill')!;
  const lastSyncEl = document.querySelector<HTMLSpanElement>('#last-sync')!;
  const monthlyLimitInput = document.querySelector<HTMLInputElement>('#monthly-limit')!;
  const limitCurrencySymbol = document.querySelector<HTMLSpanElement>('#limit-currency-symbol')!;
  const regionSelect = document.querySelector<HTMLSelectElement>('#region-select')!;
  const currencySelect = document.querySelector<HTMLSelectElement>('#currency-select')!;
  const showDecimalsCheckbox = document.querySelector<HTMLInputElement>('#show-decimals')!;
  const saveBtn = document.querySelector<HTMLButtonElement>('#save-settings')!;

  // Populate selectors
  REGIONS.forEach(region => {
    const opt = document.createElement('option');
    opt.value = region;
    const label = REGION_LABELS[region];
    const price = REGION_PRICING[region];
    opt.textContent = `${region}${label ? ` (${label})` : ''} - $${price.toFixed(2)}/TiB`;
    regionSelect.appendChild(opt);
  });

  CURRENCIES.forEach(curr => {
    const opt = document.createElement('option');
    opt.value = curr.code;
    opt.textContent = `${curr.code.toUpperCase()} (${curr.symbol})`;
    currencySelect.appendChild(opt);
  });

  // Load settings
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `local:daily_total:${today}` as const;
  const dailySpend = await storage.getItem<number>(dailyKey as any) || 0;
  const monthlySpend = await storage.getItem<number>('local:monthly_total') || 0;
  const lastSync = await storage.getItem<number>('local:last_sync');
  const limit = await storage.getItem<number>('local:monthly_limit') || 10;
  const region = await storage.getItem<string>('local:region') || DEFAULT_REGION;
  const currencyCode = await storage.getItem<string>('local:currency') || DEFAULT_CURRENCY;
  const showDecimals = await storage.getItem<boolean>('local:show_decimals') ?? true;
  
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const rates = await storage.getItem<Record<string, number>>('local:rates') || { [currency.code]: 1 };
  const rate = rates[currency.code] || 1;

  // Update UI
  const formatValue = (usdValue: number) => {
    return formatCost(usdValue, currency, showDecimals, rate, 2);
  };

  dailySpendEl.textContent = formatValue(dailySpend);
  monthlySpendEl.textContent = formatValue(monthlySpend);
  
  // Show limit in local currency
  const localLimit = limit * rate;
  monthlyLimitInput.value = localLimit.toFixed(2);
  limitCurrencySymbol.textContent = currency.symbol;

  regionSelect.value = region;
  currencySelect.value = currencyCode;
  showDecimalsCheckbox.checked = showDecimals;

  if (lastSync) {
    lastSyncEl.textContent = `Rates synced: ${new Date(lastSync).toLocaleString()}`;
  }

  const updateProgress = (current: number, max: number) => {
    const percent = Math.min(Math.round((current / max) * 100), 100);
    quotaPercentEl.textContent = `${percent}%`;
    quotaFillEl.style.width = `${percent}%`;
    
    if (percent >= 100) {
      quotaFillEl.style.background = '#d93025'; // Red if over limit
    } else if (percent >= 80) {
      quotaFillEl.style.background = '#f9ab00'; // Yellow if near limit
    }
  };

  updateProgress(monthlySpend, limit);

  // Save settings
  saveBtn.addEventListener('click', async () => {
    const localLimitInput = parseFloat(monthlyLimitInput.value);
    const newRegion = regionSelect.value;
    const newCurrency = currencySelect.value;
    const newShowDecimals = showDecimalsCheckbox.checked;

    if (!isNaN(localLimitInput) && localLimitInput > 0) {
      // Convert back to USD for internal storage
      const newLimitUsd = localLimitInput / rate;

      await storage.setItem('local:monthly_limit', newLimitUsd);
      await storage.setItem('local:region', newRegion);
      await storage.setItem('local:currency', newCurrency);
      await storage.setItem('local:show_decimals', newShowDecimals);
      
      // Reload UI or just show saved
      const originalText = saveBtn.textContent;
      saveBtn.textContent = 'Saved! Reloading...';
      saveBtn.style.background = '#1e8e3e';
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
}

init().catch(console.error);
