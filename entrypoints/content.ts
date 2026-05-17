import { extractBytes } from '@/utils/estimator';

const SELECTORS = [
  '.cfc-query-validation-message',
  '.bq-query-validation',
  '.validation-message',
];

export default defineContentScript({
  matches: ['*://console.cloud.google.com/bigquery*'],
  main() {
    let timeout: ReturnType<typeof setTimeout>;

    const handleMutations = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        for (const selector of SELECTORS) {
          const el = document.querySelector(selector);
          if (el?.textContent) {
            const bytes = extractBytes(el.textContent);
            if (bytes !== null) {
              console.log(`[BQ-Cost] Detected bytes: ${bytes}`);
              // Task 4: updateCostOverlay(bytes, el);
            }
          }
        }
      }, 500);
    };

    const observer = new MutationObserver(handleMutations);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    console.log('[BQ-Cost] Content script initialized');
  },
});
