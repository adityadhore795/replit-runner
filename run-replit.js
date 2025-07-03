const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Go to login and wait for network idle
  await page.goto('https://replit.com/login', { waitUntil: 'networkidle' });

  // 2. Fill in your email (uses Replit's placeholder text)
  await page.getByPlaceholder('Username, email, or repl URL').fill(process.env.REPL_EMAIL);

  // 3. Fill in your password
  await page.getByPlaceholder('Password').fill(process.env.REPL_PASSWORD);

  // 4. Click the Log in button (case‑insensitive match)
  await page.getByRole('button', { name: /log in/i }).click();

  // 5. Wait for navigation into your console
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // 6. Open your Repl
  await page.goto(process.env.REPL_URL, { waitUntil: 'networkidle' });

  // 7. Click the green Run button
  await page.getByRole('button', { name: 'Run' }).click();

  // 8. Wait until it goes back to “Run” (max 2 minutes)
  await page.waitForRole('button', { name: 'Run', timeout: 120_000 });

  // 9. Close
  await browser.close();
})();
