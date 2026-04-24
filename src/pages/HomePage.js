const { expect } = require('@playwright/test');
const TestHelper = require('../hooks/testHelper');

class HomePage {
  // Selectors
  FLIGHT_TAB = '[data-test="flight-tab"]';
  HOTEL_TAB = '[data-test="hotel-tab"]';
  BUS_TAB = '[data-test="bus-tab"]';
  FROM_CITY = 'input[name="source"]';
  TO_CITY = 'input[name="destination"]';
  DEPARTURE_DATE = 'input[name="deptDate"]';
  RETURN_DATE = 'input[name="returnDate"]';
  PASSENGERS = 'select[name="passengers"]';
  CLASS = 'select[name="travelclass"]';
  SEARCH_BUTTON = 'button:has-text("Search Flights")';
  NAVIGATION_MENU = '.navigation-menu';
  HEADER_LOGO = 'img[alt="EaseMyTrip"]';
  SIGN_IN_BUTTON = 'a:has-text("Sign In")';
  MY_ACCOUNT = 'a:has-text("My Account")';

  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://www.easemytrip.com';
  }

  /**
   * Navigate to homepage
   */
  async goto() {
    try {
      await this.page.goto(this.baseURL);
      await TestHelper.waitForNetworkIdle(this.page);
      console.log('✅ Navigate to EaseMyTrip website successfully');
    } catch (error) {
      console.error('❌ Failed to navigate to homepage:', error.message);
      throw error;
    }
  }

  /**
   * Verify homepage title
   */
  async homePageTitle() {
    try {
      const pageTitle = await this.page.title();
      console.log(`📄 Page Title: ${pageTitle}`);
      expect(pageTitle).toBeTruthy();
      return pageTitle;
    } catch (error) {
      console.error('❌ Failed to get page title:', error.message);
      throw error;
    }
  }

  /**
   * Get all navigation tabs
   */
  async homePagetabs() {
    try {
      const tabs = await this.page.locator('.nav-tabs, .tab-container, [class*="tab"]').allTextContents();
      console.log(`📑 Homepage Tabs: ${tabs.join(', ')}`);
      return tabs;
    } catch (error) {
      console.error('❌ Failed to get homepage tabs:', error.message);
      throw error;
    }
  }

  /**
   * Click on Flight tab
   */
  async clickFlightTab() {
    try {
      await this.page.click('text=Flight');
      await this.page.waitForLoadState('networkidle');
      console.log('✅ Flight tab clicked');
    } catch (error) {
      console.error('❌ Failed to click flight tab:', error.message);
      throw error;
    }
  }

  /**
   * Click on Hotel tab
   */
  async clickHotelTab() {
    try {
      await this.page.click('text=Hotel');
      await this.page.waitForLoadState('networkidle');
      console.log('✅ Hotel tab clicked');
    } catch (error) {
      console.error('❌ Failed to click hotel tab:', error.message);
      throw error;
    }
  }

  /**
   * Click on Bus tab
   */
  async clickBusTab() {
    try {
      await this.page.click('text=Bus');
      await this.page.waitForLoadState('networkidle');
      console.log('✅ Bus tab clicked');
    } catch (error) {
      console.error('❌ Failed to click bus tab:', error.message);
      throw error;
    }
  }

  /**
   * Search flights
   */
  async searchFlights(fromCity, toCity, departureDate, passengers = 1, travelClass = 'Economy') {
    try {
      // Click flight tab
      await this.clickFlightTab();

      // Fill from city
      await TestHelper.fillInput(this.page, this.FROM_CITY, fromCity);
      await this.page.waitForTimeout(500);

      // Fill to city
      await TestHelper.fillInput(this.page, this.TO_CITY, toCity);
      await this.page.waitForTimeout(500);

      // Fill departure date
      await this.page.fill(this.DEPARTURE_DATE, departureDate);
      await this.page.waitForTimeout(500);

      // Select passengers
      await this.page.selectOption(this.PASSENGERS, passengers.toString());

      // Select class
      await this.page.selectOption(this.CLASS, travelClass);

      // Click search button
      await TestHelper.clickWithRetry(this.page, this.SEARCH_BUTTON);
      await this.page.waitForLoadState('networkidle');
      console.log(`✅ Flight search completed - From: ${fromCity}, To: ${toCity}`);
    } catch (error) {
      console.error('❌ Failed to search flights:', error.message);
      throw error;
    }
  }

  /**
   * Click on Sign In button
   */
  async clickSignIn() {
    try {
      await TestHelper.clickWithRetry(this.page, this.SIGN_IN_BUTTON);
      console.log('✅ Sign In button clicked');
    } catch (error) {
      console.error('❌ Failed to click Sign In:', error.message);
      throw error;
    }
  }

  /**
   * Click on My Account
   */
  async clickMyAccount() {
    try {
      await TestHelper.clickWithRetry(this.page, this.MY_ACCOUNT);
      console.log('✅ My Account clicked');
    } catch (error) {
      console.error('❌ Failed to click My Account:', error.message);
      throw error;
    }
  }

  /**
   * Verify homepage is loaded
   */
  async isHomePageLoaded() {
    try {
      const isLoaded = await TestHelper.isElementVisible(this.page, this.HEADER_LOGO);
      console.log(`📍 Homepage loaded: ${isLoaded}`);
      return isLoaded;
    } catch (error) {
      console.error('❌ Failed to verify homepage:', error.message);
      throw error;
    }
  }

  /**
   * Get page URL
   */
  async getPageURL() {
    const url = this.page.url();
    console.log(`🔗 Current URL: ${url}`);
    return url;
  }

  /**
   * Close browser/page
   */
  async closeBrowser() {
    try {
      await this.page.close();
      console.log('✅ Browser closed');
    } catch (error) {
      console.error('❌ Failed to close browser:', error.message);
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name = 'homepage') {
    try {
      const path = await TestHelper.takeScreenshot(this.page, name);
      console.log(`📸 Screenshot saved: ${path}`);
      return path;
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error.message);
      throw error;
    }
  }
}

module.exports = HomePage;