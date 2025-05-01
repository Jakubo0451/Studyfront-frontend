/**
 * @jest-environment node
 */

import puppeteer from 'puppeteer';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
jest.setTimeout(60000);

describe('E2E Tests - Signup Page', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
    });

    afterAll(async () => {
        if (browser) await browser.close();
    });

    it('completes the signup process', async () => {
        await page.goto(`${frontendUrl}/signup`, { waitUntil: 'networkidle0' });

        // Fill in the form
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', 'E2E Test User');
        await page.type('input[name="email"]', 'e2e@test.com');
        await page.type('input[name="password"]', 'testPassword123');

        // Submit form
        await page.click('button[type="submit"]');
        await page.waitForFunction(
            () => window.location.pathname.includes('/dashboard'),
            { timeout: 60000 }
        );

        // Check if redirected to dashboard
        expect(page.url()).toContain('/dashboard');
    }, 60000);

    it('shows error message for invalid signup', async () => {
        await page.goto(`${frontendUrl}/signup`, { waitUntil: 'networkidle0' });

        // Fill in the form with invalid data
        await page.waitForSelector('input[name="username"]');
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
});
