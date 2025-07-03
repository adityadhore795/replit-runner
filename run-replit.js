const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Open the login form directly
  await page.goto(
    'https://replit.com/login?goto=/auth/login',
    { waitUntil: 'domcontentloaded' }
  );

  // 2. Fill email/username by its placeholder text
  await page.getByPlaceholder('EMAIL OR USERNAME', { timeout: 60000 })
            .fill(process.env.REPL_EMAIL);

  // 3. Fill password
  await page.getByPlaceholder('PASSWORD', { timeout: 30000 })
            .fill(process.env.REPL_PASSWORD);

  // 4. Click the “Log In” button
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: 'Log In' }).click()
  ]);

  // 5. Navigate to your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 6. Click Run
  await page.getByRole('button', { name: 'Run' }).click();

  // 7. Wait for it to revert back to “Run” (max 2 min)
  await page.getByRole('button', { name: 'Run', timeout: 120_000 });

  // 8. Close the browser
  await browser.close();
})();
