import puppeteer from 'puppeteer';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

describe('E2E Tests - Signup and Login', () => {
  let browser;
  let page;
  let createdUserEmail;
  let createdUserPassword;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('completes the signup process', async () => {
    await page.goto(`${backendUrl}/signup`);
    createdUserEmail = `testuser${Date.now()}@example.com`;
    createdUserPassword = 'testPassword123';
    await page.type('input[name="username"]', 'E2E Test User');
    await page.type('input[name="email"]', createdUserEmail);
    await page.type('input[name="password"]', createdUserPassword);
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]'),
    ]);
    expect(page.url()).toContain('/dashboard');
  }, 10000);

  it('should log in successfully with the created user', async () => {
    await page.goto(`${backendUrl}/login`);
    await page.type('input[name="Email"]', createdUserEmail);
    await page.type('input[name="password"]', createdUserPassword);
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]'),
    ]);
    expect(page.url()).toContain('/dashboard');
  }, 10000);

  it('should display an error message for incorrect password', async () => {
    await page.goto(`${backendUrl}/login`);
    await page.type('input[name="Email"]', 'test@example.com');
    await page.type('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('User not found');
        await dialog.dismiss();
    });
  }, 10000);
});
