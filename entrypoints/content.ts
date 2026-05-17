import { extractBytes } from '@/utils/estimator';

export default defineContentScript({
  matches: ['*://console.cloud.google.com/bigquery*'],
  main() {
    console.log('BigQuery Cost Estimator: Content script loaded');

    const observer = new MutationObserver(() => {
      // Look for known validation message selectors
      const selectors = [
        '.cfc-query-validation-message',
        '.bq-query-validation',
        '.validation-message',
      ];
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent) {
          const bytes = extractBytes(el.textContent);
          if (bytes !== null) {
            // Task 4 will handle UI injection, for now just log
            console.log(`Detected bytes: ${bytes}`);
            // TODO: dispatch update event
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  },
});
