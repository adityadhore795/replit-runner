const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to login
  await page.goto('https://replit.com/login', { waitUntil: 'networkidle' });

  // 2. Wait for any <input> fields, then fill
  await page.waitForSelector('input', { timeout: 60000 });
  const inputs = page.locator('input');
  // first input → email/username
  await inputs.nth(0).fill(process.env.REPL_EMAIL);
  // second input → password
  await inputs.nth(1).fill(process.env.REPL_PASSWORD);

  // 3. Submit form
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // 4. Go to your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 5. Click Run
  await page.getByRole('button', { name: 'Run' }).click();

  // 6. Wait up to 2 minutes for it to revert to “Run”
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 7. Close browser
  await browser.close();
})();
