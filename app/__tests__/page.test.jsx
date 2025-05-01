/**
 * @jest-environment node
 */

import puppeteer from 'puppeteer';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
jest.setTimeout(60000);

describe('E2E Tests - Signup and Login', () => {
  let browser;
  let page;
  let createdUserEmail;
  let createdUserPassword;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  it('completes the signup process', async () => {
    await page.goto(`${frontendUrl}/signup`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[name="username"]', { timeout: 60000 });

    createdUserEmail = `testuser${Date.now()}@example.com`;
    createdUserPassword = 'testPassword123';

    // Fill in the form
    await page.type('input[name="username"]', 'E2E Test User');
    await page.type('input[name="email"]', createdUserEmail);
    await page.type('input[name="password"]', createdUserPassword);

    // Submit form
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]'),
    ]);

    expect(page.url()).toContain('/dashboard');
  }, 60000);

  it('shows error message for invalid signup', async () => {
    await page.goto(`${frontendUrl}/signup`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[name="username"]', { timeout: 60000 });

    // Fill in the form with invalid data
    await page.type('input[name="username"]', 'a');
    await page.type('input[name="email"]', 'invalid-email');
    await page.type('input[name="password"]', 'short');

    // Submit form
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Please enter a valid email address.');
      await dialog.dismiss();
    });
    await page.click('button[type="submit"]');
  }, 30000);

  it('should log in successfully with the created user', async () => {
    await page.goto(`${frontendUrl}/login`, { waitUntil: 'networkidle0' });

    // Fill in login form
    await page.type('input[name="Email"]', createdUserEmail);
    await page.type('input[name="password"]', createdUserPassword);

    // Submit form
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]'),
    ]);

    expect(page.url()).toContain('/dashboard');
  }, 60000);

  it('should display an error message for incorrect password', async () => {
    await page.goto(`${frontendUrl}/login`, { waitUntil: 'networkidle0' });

    // Fill in login form with wrong password
    await page.type('input[name="Email"]', 'test@example.com');
    await page.type('input[name="password"]', 'wrongpassword');

    // Listen for dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('User not found');
      await dialog.dismiss();
    });

    await page.click('button[type="submit"]');
  }, 30000);
});
