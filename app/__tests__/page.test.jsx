
import puppeteer from 'puppeteer';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

describe('E2E Tests - Signup Page', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: 'new' });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('completes the signup process', async () => {
        await page.goto(`${backendUrl}/signup`);

        // Fill in the form
        await page.type('input[name="username"]', 'E2E Test User');
        await page.type('input[name="email"]', 'e2e@test.com');
        await page.type('input[name="password"]', 'testPassword123');

        // Submit form
        await Promise.all([
            page.waitForNavigation(),
            page.click('button[type="submit"]')
        ]);

        // Check if redirected to dashboard
        expect(page.url()).toContain('/dashboard');
    }, 30000);

    it('shows error message for invalid signup', async () => {
        await page.goto(`${backendUrl}/signup`);

        // Fill in the form with invalid data
        await page.type('input[name="username"]', 'a');
        await page.type('input[name="email"]', 'invalid-email');
        await page.type('input[name="password"]', 'short');

        // Submit form
        await page.click('button[type="submit"]');

        // Check for alert
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Failed to create user');
            await dialog.dismiss();
        });
    }, 30000);
});