const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to the new login page
  await page.goto('https://replit.com/auth/login', { waitUntil: 'domcontentloaded' });

  // 2. Wait up to 60 s for at least one <input> to appear
  await page.waitForSelector('input', { timeout: 60000 });

  // 3. Grab the first two inputs on the page:
  const inputs = page.locator('input');
  //   - first is email/username
  await inputs.nth(0).fill(process.env.REPL_EMAIL);
  //   - second is password
  await inputs.nth(1).fill(process.env.REPL_PASSWORD);

  // 4. Click “Log in”
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // 5. Navigate to your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 6. Click the green “Run” button
  await page.getByRole('button', { name: 'Run' }).click();

  // 7. Wait for it to revert to “Run” (max 2 minutes)
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 8. Close browser
  await browser.close();
})();
