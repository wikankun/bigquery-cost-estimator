import './style.css';

async function init() {
  const dailySpendEl = document.querySelector<HTMLSpanElement>('#daily-spend')!;
  const monthlySpendEl = document.querySelector<HTMLSpanElement>('#monthly-spend')!;
  const quotaPercentEl = document.querySelector<HTMLSpanElement>('#quota-percent')!;
  const quotaFillEl = document.querySelector<HTMLDivElement>('#quota-fill')!;
  const lastSyncEl = document.querySelector<HTMLSpanElement>('#last-sync')!;
  const monthlyLimitInput = document.querySelector<HTMLInputElement>('#monthly-limit')!;
  const saveBtn = document.querySelector<HTMLButtonElement>('#save-settings')!;

  // Load stats
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `local:daily_total:${today}` as const;
  const dailySpend = await storage.getItem<number>(dailyKey as any) || 0;
  const monthlySpend = await storage.getItem<number>('local:monthly_total') || 0;
  const lastSync = await storage.getItem<number>('local:last_sync');
  const limit = await storage.getItem<number>('local:monthly_limit') || 10;

  // Update UI
  dailySpendEl.textContent = `$${dailySpend.toFixed(2)}`;
  monthlySpendEl.textContent = `$${monthlySpend.toFixed(2)}`;
  monthlyLimitInput.value = limit.toString();

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
    const newLimit = parseFloat(monthlyLimitInput.value);
    if (!isNaN(newLimit) && newLimit > 0) {
      await storage.setItem('local:monthly_limit', newLimit);
      updateProgress(monthlySpend, newLimit);
      
      const originalText = saveBtn.textContent;
      saveBtn.textContent = 'Saved!';
      saveBtn.style.background = '#1e8e3e';
      
      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
      }, 2000);
    }
  });
}

init().catch(console.error);
