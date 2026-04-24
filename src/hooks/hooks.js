const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/test.log' }),
    new winston.transports.Console()
  ]
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs', { recursive: true });
}

// Global test setup
test.beforeAll(async () => {
  logger.info('🚀 Test suite started');
});

// Before each test
test.beforeEach(async ({ page, context }, testInfo) => {
  logger.info(`📝 Starting test: ${testInfo.title}`);
  
  // Set viewport size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Add custom console listener
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      logger.error(`Browser console error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      logger.warn(`Browser console warning: ${msg.text()}`);
    }
  });
});

// After each test
test.afterEach(async ({ page }, testInfo) => {
  logger.info(`✅ Completed test: ${testInfo.title}`);
  
  // Take screenshot on failure
  if (testInfo.status !== 'passed') {
    logger.error(`❌ Test failed: ${testInfo.title}`);
    
    const screenshotPath = path.join('reports/screenshots', `${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath });
    logger.info(`📸 Screenshot saved: ${screenshotPath}`);
    
    testInfo.attachments.push({
      name: 'screenshot',
      path: screenshotPath,
      contentType: 'image/png'
    });
  }
  
  // Clear cookies and local storage
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

// Global test teardown
test.afterAll(async () => {
  logger.info('🏁 Test suite completed');
});

module.exports = { logger };
