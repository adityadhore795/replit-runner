const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to login and wait for network idle
  await page.goto('https://replit.com/login', { waitUntil: 'networkidle' });

  // 2. Robust email/username entry
  // We’ll try several selectors; whichever appears first gets filled.
  const emailSelectors = [
    'input[type="email"]',
    'input[name="username"]',
    'input[placeholder*="email"]',
    'input[placeholder*="username"]',
    'input[type="text"]'
  ];
  let emailFilled = false;
  for (const sel of emailSelectors) {
    const el = await page.$(sel);
    if (el) {
      await page.fill(sel, process.env.REPL_EMAIL);
      emailFilled = true;
      break;
    }
  }
  if (!emailFilled) {
    throw new Error('Could not find an email/username input on the login page.');
  }

  // 3. Password field (should always be type="password")
  await page.waitForSelector('input[type="password"]', { timeout: 30000 });
  await page.fill('input[type="password"]', process.env.REPL_PASSWORD);

  // 4. Click the submit button
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // 5. Go to your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 6. Click Run
  await page.getByRole('button', { name: 'Run' }).click();

  // 7. Wait for it to revert back to “Run” (max 2 minutes)
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 8. Done
  await browser.close();
})();
