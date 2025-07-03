const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Open the real login form and wait for full load
  await page.goto(
    'https://replit.com/login?goto=/auth/login',
    { waitUntil: 'networkidle' }
  );

  // 2. Fill email/username (case‑insensitive match)
  await page
    .getByPlaceholder(/email or username/i, { timeout: 60000 })
    .fill(process.env.REPL_EMAIL);

  // 3. Fill password
  await page
    .getByPlaceholder(/password/i, { timeout: 60000 })
    .fill(process.env.REPL_PASSWORD);

  // 4. Click “Log In” and await the dashboard
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: /log in/i }).click(),
  ]);

  // 5. Go to your Repl and wait for it to load
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 6. Click Run
  await page.getByRole('button', { name: 'Run' }).click();

  // 7. Wait for it to revert back to “Run” (max 2 min)
  await page.getByRole('button', { name: 'Run', timeout: 120_000 });

  // 8. Close
  await browser.close();
})();
