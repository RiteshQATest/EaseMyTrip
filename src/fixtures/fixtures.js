const { test: base } = require('@playwright/test');
const HomePage = require('../src/pages/HomePage');
const FlightsPage = require('../src/pages/FlightsPage');

exports.test = base.extend({
  // HomePage fixture
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  // FlightsPage fixture
  flightsPage: async ({ page }, use) => {
    const flightsPage = new FlightsPage(page);
    await flightsPage.goto();
    await use(flightsPage);
  },

  // Authenticated page context fixture
  authenticatedPage: async ({ page }, use) => {
    // Add any authentication logic here if needed
    // For example: await page.goto('login_url');
    // await page.fill('username', 'testuser');
    // await page.fill('password', 'testpass');
    // await page.click('login_button');
    await use(page);
  },

  // Logger fixture
  logger: async ({}, use) => {
    const { logger } = require('./hooks');
    await use(logger);
  },
});

exports.expect = require('@playwright/test').expect;
