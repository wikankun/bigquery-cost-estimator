import { extractBytes, calculateCost } from '@/utils/estimator';
import '@/assets/overlay.css';

const SELECTORS = [
  '.cfc-query-validation-message',
  '.bq-query-validation',
  '.validation-message',
];

export default defineContentScript({
  matches: ['*://console.cloud.google.com/bigquery*'],
  main() {
    let timeout: ReturnType<typeof setTimeout>;

    const updateCostOverlay = (bytes: number, anchorEl: Element) => {
      const cost = calculateCost(bytes);
      let badge = anchorEl.querySelector('.bq-cost-badge');
      
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'bq-cost-badge';
        anchorEl.appendChild(badge);
      }
      
      badge.textContent = `Est. Cost: $${cost.toFixed(4)}`;
    };

    const handleMutations = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        for (const selector of SELECTORS) {
          const el = document.querySelector(selector);
          if (el?.textContent) {
            const bytes = extractBytes(el.textContent);
            if (bytes !== null) {
              console.log(`[BQ-Cost] Detected bytes: ${bytes}`);
              updateCostOverlay(bytes, el);
              // Store current query cost for the Run button handler
              (window as any).__BQ_LAST_COST = calculateCost(bytes);
            }
          }
        }
      }, 500);
    };

    // Task 5: Intercept Run Button click
    document.addEventListener('click', async (e) => {
      const btn = (e.target as HTMLElement).closest('button');
      if (btn?.textContent?.includes('Run') && !btn.disabled) {
        const lastCost = (window as any).__BQ_LAST_COST || 0;
        if (lastCost === 0) return;

        const limit = await storage.getItem<number>('local:monthly_limit') || 10; // Default $10
        const currentMonthly = await storage.getItem<number>('local:monthly_total') || 0;

        if (currentMonthly + lastCost > limit) {
          const confirmed = window.confirm(
            `⚠️ Quota Warning\n\nThis query costs ~$${lastCost.toFixed(4)}.\nYour monthly total ($${currentMonthly.toFixed(2)}) will exceed your limit ($${limit.toFixed(2)}).\n\nProceed anyway?`
          );
          if (!confirmed) {
            e.stopPropagation();
            e.preventDefault();
            return;
          }
        }

        // Track the spend
        const today = new Date().toISOString().split('T')[0];
        const dailyKey = `local:daily_total:${today}` as const;
        const currentDaily = await storage.getItem<number>(dailyKey as any) || 0;

        await storage.setItem('local:monthly_total', currentMonthly + lastCost);
        await storage.setItem(dailyKey as any, currentDaily + lastCost);
        console.log(`[BQ-Cost] Tracked cost: $${lastCost.toFixed(4)}`);
      }
    }, true);

    const observer = new MutationObserver(handleMutations);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    console.log('[BQ-Cost] Content script initialized');
  },
});
