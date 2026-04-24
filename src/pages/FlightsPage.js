const { expect } = require('@playwright/test');
const TestHelper = require('../hooks/testHelper');

class FlightsPage {
  // Selectors for search results page
  FLIGHT_RESULTS = '.flight-item, [data-test="flight-result"]';
  FLIGHT_CARD = '.flight-card, .flightResultBox';
  AIRLINE_NAME = '.airline-name, [class*="airline"]';
  DEPARTURE_TIME = '.departure-time, [class*="departure"]';
  ARRIVAL_TIME = '.arrival-time, [class*="arrival"]';
  DURATION = '.duration, [class*="duration"]';
  PRICE = '.price, [class*="price"]';
  BOOK_BUTTON = 'button:has-text("Book"), button:has-text("Select")';
  FILTER_SECTION = '.filter-section, [class*="filter"]';
  PRICE_FILTER = 'input[name="price"]';
  AIRLINE_FILTER = 'input[name="airline"]';
  STOPS_FILTER = 'input[name="stops"]';
  SORT_DROPDOWN = 'select[name="sort"], button[class*="sort"]';
  NO_RESULTS = '.no-results, [class*="no-result"]';
  LOADING_SPINNER = '.spinner, [class*="loading"]';
  PASSENGER_COUNT = '[class*="passenger"]';
  TRIP_TYPE = '[class*="trip"]';
  BACK_BUTTON = 'button:has-text("Back"), a[class*="back"]';

  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://www.easemytrip.com';
  }

  /**
   * Navigate to flights page
   */
  async goto() {
    try {
      await this.page.goto(`${this.baseURL}/flights`);
      await TestHelper.waitForNetworkIdle(this.page);
      console.log('✅ Navigated to Flights page');
    } catch (error) {
      console.error('❌ Failed to navigate to flights page:', error.message);
      throw error;
    }
  }

  /**
   * Get all flight results
   */
  async getFlightResults() {
    try {
      await TestHelper.waitForElement(this.page, this.FLIGHT_RESULTS);
      const flights = await this.page.locator(this.FLIGHT_RESULTS).count();
      console.log(`📋 Found ${flights} flight(s)`);
      return flights;
    } catch (error) {
      console.error('❌ Failed to get flight results:', error.message);
      throw error;
    }
  }

  /**
   * Get flight details by index
   */
  async getFlightDetails(index = 0) {
    try {
      const flight = this.page.locator(this.FLIGHT_CARD).nth(index);
      const airline = await flight.locator(this.AIRLINE_NAME).textContent();
      const departure = await flight.locator(this.DEPARTURE_TIME).textContent();
      const arrival = await flight.locator(this.ARRIVAL_TIME).textContent();
      const duration = await flight.locator(this.DURATION).textContent();
      const price = await flight.locator(this.PRICE).textContent();

      const details = {
        airline: airline?.trim(),
        departure: departure?.trim(),
        arrival: arrival?.trim(),
        duration: duration?.trim(),
        price: price?.trim(),
      };

      console.log(`✈️ Flight Details:`, details);
      return details;
    } catch (error) {
      console.error('❌ Failed to get flight details:', error.message);
      throw error;
    }
  }

  /**
   * Get all flights with details
   */
  async getAllFlightDetails() {
    try {
      const count = await this.getFlightResults();
      const flightsList = [];

      for (let i = 0; i < count; i++) {
        const details = await this.getFlightDetails(i);
        flightsList.push(details);
      }

      console.log(`📊 Retrieved ${flightsList.length} flight details`);
      return flightsList;
    } catch (error) {
      console.error('❌ Failed to get all flight details:', error.message);
      throw error;
    }
  }

  /**
   * Book a flight by index
   */
  async bookFlight(index = 0) {
    try {
      const bookButton = this.page.locator(this.BOOK_BUTTON).nth(index);
      await TestHelper.clickWithRetry(this.page, `${this.BOOK_BUTTON} >> nth=${index}`);
      await this.page.waitForLoadState('networkidle');
      console.log(`✅ Booked flight at index ${index}`);
    } catch (error) {
      console.error('❌ Failed to book flight:', error.message);
      throw error;
    }
  }

  /**
   * Book cheapest flight
   */
  async bookCheapestFlight() {
    try {
      const flights = await this.getAllFlightDetails();
      if (flights.length === 0) {
        throw new Error('No flights available');
      }

      let cheapestIndex = 0;
      let cheapestPrice = parseFloat(flights[0].price?.replace(/[^\d.]/g, '') || 0);

      for (let i = 1; i < flights.length; i++) {
        const price = parseFloat(flights[i].price?.replace(/[^\d.]/g, '') || 0);
        if (price < cheapestPrice) {
          cheapestPrice = price;
          cheapestIndex = i;
        }
      }

      await this.bookFlight(cheapestIndex);
      console.log(`💰 Booked cheapest flight (₹${cheapestPrice}) at index ${cheapestIndex}`);
    } catch (error) {
      console.error('❌ Failed to book cheapest flight:', error.message);
      throw error;
    }
  }

  /**
   * Filter flights by price range
   */
  async filterByPrice(minPrice, maxPrice) {
    try {
      await TestHelper.waitForElement(this.page, this.PRICE_FILTER);
      
      // Fill min price
      const minInput = this.page.locator(`${this.PRICE_FILTER}[placeholder*="Min"], input[class*="min"]`).first();
      await minInput.fill(minPrice.toString());

      // Fill max price
      const maxInput = this.page.locator(`${this.PRICE_FILTER}[placeholder*="Max"], input[class*="max"]`).last();
      await maxInput.fill(maxPrice.toString());

      await this.page.waitForLoadState('networkidle');
      console.log(`✅ Filtered flights by price: ₹${minPrice} - ₹${maxPrice}`);
    } catch (error) {
      console.error('❌ Failed to filter by price:', error.message);
      throw error;
    }
  }

  /**
   * Filter by airline
   */
  async filterByAirline(airlineName) {
    try {
      const airlineCheckbox = this.page.locator(`input[value="${airlineName}"], label:has-text("${airlineName}") input`).first();
      await airlineCheckbox.check();
      await this.page.waitForLoadState('networkidle');
      console.log(`✅ Filtered by airline: ${airlineName}`);
    } catch (error) {
      console.error('❌ Failed to filter by airline:', error.message);
      throw error;
    }
  }

  /**
   * Filter by number of stops
   */
  async filterByStops(stops) {
    try {
      const stopsOption = this.page.locator(`input[value="${stops}"], label:has-text("${stops}")  input`).first();
      await stopsOption.check();
      await this.page.waitForLoadState('networkidle');
      console.log(`✅ Filtered by stops: ${stops}`);
    } catch (error) {
      console.error('❌ Failed to filter by stops:', error.message);
      throw error;
    }
  }

  /**
   * Sort flights
   */
  async sortFlights(sortBy = 'price_low_to_high') {
    try {
      const sortOptions = {
        'price_low_to_high': 'Price: Low to High',
        'price_high_to_low': 'Price: High to Low',
        'departure_earliest': 'Departure: Earliest',
        'departure_latest': 'Departure: Latest',
        'arrival_earliest': 'Arrival: Earliest',
        'duration_shortest': 'Duration: Shortest',
        'rating_highest': 'Rating: Highest',
      };

      const sortLabel = sortOptions[sortBy] || sortBy;
      await this.page.selectOption(this.SORT_DROPDOWN, sortLabel);
      await this.page.waitForLoadState('networkidle');
      console.log(`✅ Sorted flights by: ${sortLabel}`);
    } catch (error) {
      console.error('❌ Failed to sort flights:', error.message);
      throw error;
    }
  }

  /**
   * Check if no results message is displayed
   */
  async isNoResultsDisplayed() {
    try {
      const noResults = await TestHelper.isElementVisible(this.page, this.NO_RESULTS);
      if (noResults) {
        console.log('⚠️ No flights found');
      }
      return noResults;
    } catch (error) {
      console.error('❌ Failed to check no results:', error.message);
      throw error;
    }
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    try {
      await TestHelper.waitForElementToDisappear(this.page, this.LOADING_SPINNER, 30000);
      console.log('✅ Loading complete');
    } catch (error) {
      console.warn('⚠️ Loading timeout (may not have spinner)');
    }
  }

  /**
   * Get flight count
   */
  async getFlightCount() {
    try {
      const count = await this.page.locator(this.FLIGHT_RESULTS).count();
      console.log(`📊 Total flights: ${count}`);
      return count;
    } catch (error) {
      console.error('❌ Failed to get flight count:', error.message);
      throw error;
    }
  }

  /**
   * Search for cheapest price
   */
  async getCheapestPrice() {
    try {
      const flights = await this.getAllFlightDetails();
      const prices = flights
        .map(f => parseFloat(f.price?.replace(/[^\d.]/g, '') || 0))
        .filter(p => p > 0);

      if (prices.length === 0) {
        throw new Error('No prices found');
      }

      const cheapest = Math.min(...prices);
      console.log(`💰 Cheapest flight price: ₹${cheapest}`);
      return cheapest;
    } catch (error) {
      console.error('❌ Failed to get cheapest price:', error.message);
      throw error;
    }
  }

  /**
   * Get flight by airline name
   */
  async getFlightByAirline(airlineName) {
    try {
      const flights = await this.getAllFlightDetails();
      const flight = flights.find(f => f.airline?.toLowerCase().includes(airlineName.toLowerCase()));

      if (!flight) {
        console.warn(`⚠️ No flight found for airline: ${airlineName}`);
        return null;
      }

      console.log(`✈️ Found flight for ${airlineName}:`, flight);
      return flight;
    } catch (error) {
      console.error('❌ Failed to get flight by airline:', error.message);
      throw error;
    }
  }

  /**
   * Go back to search
   */
  async goBack() {
    try {
      await TestHelper.clickWithRetry(this.page, this.BACK_BUTTON);
      await this.page.waitForLoadState('networkidle');
      console.log('✅ Navigated back');
    } catch (error) {
      console.error('❌ Failed to go back:', error.message);
      throw error;
    }
  }

  /**
   * Take screenshot of results
   */
  async takeScreenshot(name = 'flights_page') {
    try {
      const path = await TestHelper.takeScreenshot(this.page, name);
      console.log(`📸 Screenshot saved: ${path}`);
      return path;
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error.message);
      throw error;
    }
  }

  /**
   * Verify flight page elements
   */
  async verifyPageElements() {
    try {
      const results = await TestHelper.isElementVisible(this.page, this.FLIGHT_RESULTS);
      const filters = await TestHelper.isElementVisible(this.page, this.FILTER_SECTION);
      const sort = await TestHelper.isElementVisible(this.page, this.SORT_DROPDOWN);

      const verification = {
        flightResults: results,
        filterSection: filters,
        sortDropdown: sort,
      };

      console.log('✅ Page elements verification:', verification);
      return verification;
    } catch (error) {
      console.error('❌ Failed to verify page elements:', error.message);
      throw error;
    }
  }

  /**
   * Close page
   */
  async closePage() {
    try {
      await this.page.close();
      console.log('✅ Page closed');
    } catch (error) {
      console.error('❌ Failed to close page:', error.message);
    }
  }
}

module.exports = FlightsPage;
