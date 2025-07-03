const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Load the real login page (with form)
  await page.goto('https://replit.com/login?goto=/auth/login', {
    waitUntil: 'networkidle'
  });

  // 2. Wait up to 60s for the email/password fields to appear
  await page.waitForSelector('input', { timeout: 60000 });

  // 3. Grab the first two inputs: email, then password
  const inputs = page.locator('input');
  await inputs.nth(0).fill(process.env.REPL_EMAIL);
  await inputs.nth(1).fill(process.env.REPL_PASSWORD);

  // 4. Submit the form and wait for your dashboard
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // 5. Go to your Repl
  await page.goto(process.env.REPL_URL, {
    waitUntil: 'networkidle'
  });

  // 6. Click Run
  await page.getByRole('button', { name: 'Run' }).click();

  // 7. Wait for it to flip back to “Run” (max 2 min)
  await page.waitForRole('button', {
    name: 'Run',
    timeout: 120_000
  });

  // 8. Close browser
  await browser.close();
})();
