const fs = require('fs');
const path = require('path');

class TestHelper {
  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(page, timeout = 5000) {
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      console.warn('Network idle timeout:', error.message);
    }
  }

  /**
   * Wait for element to be visible
   */
  static async waitForElement(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
  }

  /**
   * Wait for element to disappear
   */
  static async waitForElementToDisappear(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout, state: 'hidden' });
  }

  /**
   * Take screenshot with custom path
   */
  static async takeScreenshot(page, name) {
    const screenshotDir = 'reports/screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const timestamp = new Date().getTime();
    const filePath = path.join(screenshotDir, `${name}_${timestamp}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  /**
   * Capture page HTML
   */
  static async capturePageHTML(page, name) {
    const htmlDir = 'reports/html-dumps';
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }
    
    const timestamp = new Date().getTime();
    const filePath = path.join(htmlDir, `${name}_${timestamp}.html`);
    const html = await page.content();
    fs.writeFileSync(filePath, html);
    return filePath;
  }

  /**
   * Clear browser data
   */
  static async clearBrowserData(page) {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.caches?.keys().then(names => {
        names.forEach(name => window.caches.delete(name));
      });
    });
  }

  /**
   * Perform login (customize based on your app)
   */
  static async login(page, email, password) {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }

  /**
   * Check if element is visible
   */
  static async isElementVisible(page, selector) {
    try {
      const element = await page.$(selector);
      return element && await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get element text
   */
  static async getElementText(page, selector) {
    return await page.textContent(selector);
  }

  /**
   * Click element with retry
   */
  static async clickWithRetry(page, selector, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await page.click(selector);
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await page.waitForTimeout(500);
      }
    }
  }

  /**
   * Fill input with clear and type
   */
  static async fillInput(page, selector, value) {
    await page.click(selector);
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await page.type(selector, value, { delay: 50 });
  }
}

module.exports = TestHelper;
