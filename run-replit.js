const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to login page
  await page.goto('https://replit.com/login', { waitUntil: 'networkidle' });

  // 2. Wait for & fill the email/username field
  await page.waitForSelector('input[type="email"], input[type="text"]', { timeout: 60000 });
  // Try email field first, otherwise fall back to text
  const emailSelector = await page.$('input[type="email"]')
    ? 'input[type="email"]'
    : 'input[type="text"]';
  await page.fill(emailSelector, process.env.REPL_EMAIL);

  // 3. Fill the password
  await page.waitForSelector('input[type="password"]', { timeout: 30000 });
  await page.fill('input[type="password"]', process.env.REPL_PASSWORD);

  // 4. Submit the form
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // 5. Navigate to your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 6. Click Run
  await page.getByRole('button', { name: 'Run' }).click();

  // 7. Wait for it to revert to “Run” (max 2 minutes)
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 8. Done
  await browser.close();
})();
