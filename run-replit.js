const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();

  // 1. Go to the Replit homepage and wait for everything to load
  await page.goto('https://replit.com', { waitUntil: 'networkidle' });

  // 2. Click the top‑right “Log in” button to open the form
  await page.getByRole('link', { name: /log in/i }).click();

  // 3. Wait for the email/username field to appear
  await page.waitForSelector('input', { timeout: 60000 });

  // 4. Fill in your credentials in the first two inputs
  const inputs = page.locator('input');
  await inputs.nth(0).fill(process.env.REPL_EMAIL);
  await inputs.nth(1).fill(process.env.REPL_PASSWORD);

  // 5. Submit the form and wait for your dashboard
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: /log in/i }).click()
  ]);

  // 6. Navigate to your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 7. Click the green “Run” button
  await page.getByRole('button', { name: 'Run' }).click();

  // 8. Wait up to 2 minutes for it to flip back to “Run”
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 9. Close out
  await browser.close();
})();
