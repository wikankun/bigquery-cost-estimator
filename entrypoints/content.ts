import { extractBytes, calculateCost } from '@/utils/estimator';
import { formatCost } from '@/utils/currency';
import { CURRENCIES, DEFAULT_REGION, DEFAULT_CURRENCY } from '@/utils/constants';
import '@/assets/overlay.css';

const SELECTORS = [
  '.cfc-query-validation-message',
  '.bq-query-validation',
  '.validation-message',
];

export default defineContentScript({
  matches: ['*://console.cloud.google.com/bigquery*'],
  main() {
    const updateCostOverlay = async (bytes: number, anchorEl: Element) => {
      try {
        const region = await storage.getItem<string>('local:region') || DEFAULT_REGION;
        const currencyCode = await storage.getItem<string>('local:currency') || DEFAULT_CURRENCY;
        const limit = await storage.getItem<number>('local:monthly_limit') || 10;
        const currentMonthly = await storage.getItem<number>('local:monthly_total') || 0;
        const showDecimals = await storage.getItem<boolean>('local:show_decimals') ?? true;

        const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
        const rates = await storage.getItem<Record<string, number>>('local:rates') || { [currency.code]: 1 };
        const rate = rates[currency.code] || 1;

        const costUsd = calculateCost(bytes, region);

        let badge = anchorEl.querySelector('.bq-cost-badge');

        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'bq-cost-badge';
          anchorEl.appendChild(badge);
        }

        const isOverLimit = (currentMonthly + costUsd) > limit;
        badge.classList.toggle('success', !isOverLimit);
        badge.classList.toggle('warning', isOverLimit);

        badge.textContent = `Cost: ${formatCost(costUsd, currency, showDecimals, rate)}`;
        (window as any).__BQ_LAST_COST = costUsd;
      } catch (error) {
        if (error instanceof Error && error.message.includes('context invalidated')) {
          console.log('[BQ-Cost] Extension context invalidated. Stopping observer.');
          observer.disconnect();
          return;
        }
        console.error('[BQ-Cost] Failed to update cost overlay:', error);
      }
    };

    const processElement = (el: Element) => {
      const text = el.textContent || '';
      // Guard: only process if text actually changed and contains our target phrase
      if (text.includes('This query will process')) {
        // Remove our badge text from comparison to avoid feedback loops
        const cleanText = text.replace(/Est\. Cost:.*$/, '').trim();
        if ((el as any).__BQ_LAST_TEXT === cleanText) return;

        (el as any).__BQ_LAST_TEXT = cleanText;
        const bytes = extractBytes(cleanText);
        if (bytes !== null) {
          updateCostOverlay(bytes, el);
        }
      } else {
        // Remove badge and reset tracker if message changed to something else
        el.querySelector('.bq-cost-badge')?.remove();
        delete (el as any).__BQ_LAST_TEXT;
      }
    };

    let cachedLimit = 10;
    let cachedMonthly = 0;

    const updateCache = async () => {
      cachedLimit = await storage.getItem<number>('local:monthly_limit') || 10;
      cachedMonthly = await storage.getItem<number>('local:monthly_total') || 0;
    };

    updateCache();
    storage.watch<number>('local:monthly_limit', (val) => cachedLimit = val || 10);
    storage.watch<number>('local:monthly_total', (val) => cachedMonthly = val || 0);

    const trackSpend = async (cost: number) => {
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `local:daily_total:${today}` as const;
      const currentDaily = await storage.getItem<number>(dailyKey as any) || 0;
      
      // Update storage - cachedMonthly will be updated by the watcher
      await storage.setItem('local:monthly_total', cachedMonthly + cost);
      await storage.setItem(dailyKey as any, currentDaily + cost);
      console.log(`[BQ-Cost] Tracked cost: $${cost.toFixed(4)}`);
    };

    const handleExecution = (e: Event) => {
      const lastCost = (window as any).__BQ_LAST_COST || 0;
      if (lastCost <= 0) return;

      if (cachedMonthly + lastCost > cachedLimit) {
        const confirmed = window.confirm(
          `⚠️ Quota Warning\n\nThis query costs ~$${lastCost.toFixed(4)}.\nYour monthly total ($${cachedMonthly.toFixed(2)}) will exceed your limit ($${cachedLimit.toFixed(2)}).\n\nProceed anyway?`
        );
        if (!confirmed) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }
      trackSpend(lastCost);
    };

    // Intercept Run actions
    document.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (btn?.textContent?.includes('Run') && !btn.disabled) {
        handleExecution(e);
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleExecution(e);
      }
    }, true);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof Element) {
              for (const selector of SELECTORS) {
                if (node.matches(selector)) processElement(node);
                node.querySelectorAll(selector).forEach(processElement);
              }
            }
          });
        }

        // Handle text content changes or element updates
        const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
        if (target) {
          for (const selector of SELECTORS) {
            const el = target.closest(selector);
            if (el) processElement(el);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    console.log('[BQ-Cost] Optimized content script initialized');
  },
});
