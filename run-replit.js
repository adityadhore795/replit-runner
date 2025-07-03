const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to login
  await page.goto('https://replit.com/login');
  await page.fill('input[name="username"]', process.env.REPL_EMAIL);
  await page.fill('input[name="password"]', process.env.REPL_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // 2. Open your Repl
  await page.goto(process.env.REPL_URL);

  // 3. Click the green Run button
  await page.getByRole('button', { name: 'Run' }).click();

  // 4. Wait until it turns back to “Run” (max 2 minutes)
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 5. Close up
  await browser.close();
})();
