# EaseMyTrip Test Automation Framework

Automated test framework for the EaseMyTrip website using Playwright and JavaScript.

## Project Structure

```
├── src/
│   ├── config/
│   │   └── testConfig.js          # Configuration settings
│   ├── fixtures/
│   │   └── fixtures.js            # Reusable test fixtures
│   ├── hooks/
│   │   ├── hooks.js               # Global test hooks (beforeAll, afterEach, etc.)
│   │   └── testHelper.js          # Utility functions for tests
│   └── pages/
│       ├── HomePage.js            # Homepage page object
│       └── FlightsPage.js         # Flights page object
├── tests/
│   ├── homepage.spec.js           # Homepage test suite
│   └── specs/
│       └── flights_page.spec.js   # Flights page test suite
├── reports/
│   ├── screenshots/               # Test failure screenshots
│   ├── videos/                    # Test video recordings
│   └── traces/                    # Playwright traces
├── logs/
│   └── test.log                   # Test execution logs
├── playwright.config.js           # Playwright configuration
├── package.json                   # Project dependencies
├── .env.example                   # Environment variables example
└── README.md                      # This file
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RiteshQATest/EaseMyTrip.git
cd EaseMyTrip
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

## Configuration

Edit `.env` file to configure:
- `BASE_URL` - Website URL
- `HEADLESS` - Run tests in headless mode (true/false)
- `SLOW_MOTION` - Add delay between actions (milliseconds)
- `LOG_LEVEL` - Logging level (info, debug, error, warning)

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run homepage tests only
```bash
npm run test:homepage
```

### Run flights page tests only
```bash
npm run test:flights
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

### Run tests in UI mode
```bash
npm run test:ui
```

## Test Suites

### Homepage Tests (tests/homepage.spec.js)
- TC-001: Navigation to homepage
- TC-002: Page title verification
- TC-003: Navigation tabs display
- TC-004: Flight tab functionality
- TC-005: Hotel tab functionality
- TC-006: Bus tab functionality
- TC-007: Sign In button presence
- TC-008: Page URL verification
- TC-009: Screenshot capture
- TC-010: Page responsiveness

### Flights Page Tests (tests/specs/flights_page.spec.js)
- FLT-001: Flight page navigation
- FLT-002: Flight results display
- FLT-003: Individual flight details
- FLT-004: All flights details retrieval
- FLT-005: Page elements verification
- FLT-006: Price filtering
- FLT-007: Loading state handling
- FLT-008: Screenshot capture
- FLT-009: Cheapest price identification
- FLT-010: No results handling

## Page Objects

### HomePage (src/pages/HomePage.js)
Methods for homepage interactions:
- `goto()` - Navigate to homepage
- `searchFlights(fromCity, toCity, departureDate)` - Search flights
- `clickFlightTab()` / `clickHotelTab()` / `clickBusTab()` - Tab navigation
- `homePageTitle()` - Get page title
- `homePagetabs()` - Get navigation tabs
- `isHomePageLoaded()` - Check if homepage loaded
- `takeScreenshot(name)` - Capture screenshot

### FlightsPage (src/pages/FlightsPage.js)
Methods for flight search results:
- `getFlightResults()` - Get flight count
- `getFlightDetails(index)` - Get specific flight info
- `getAllFlightDetails()` - Get all flights info
- `bookFlight(index)` - Book a flight
- `filterByPrice(min, max)` - Price filtering
- `filterByAirline(name)` - Airline filtering
- `sortFlights(sortBy)` - Sort flights
- `getCheapestPrice()` - Find cheapest flight

## Test Helpers

### TestHelper (src/hooks/testHelper.js)
Utility functions:
- `waitForNetworkIdle()` - Wait for network to settle
- `waitForElement()` - Wait for element visibility
- `isElementVisible()` - Check element visibility
- `clickWithRetry()` - Click with retry logic
- `fillInput()` - Smart form filling
- `takeScreenshot()` - Capture screenshots
- `capturePageHTML()` - Save page HTML
- `clearBrowserData()` - Clear cookies/storage

## Test Hooks

### Global Hooks (src/hooks/hooks.js)
- `beforeAll()` - Runs before all tests
- `beforeEach()` - Runs before each test
- `afterEach()` - Runs after each test (screenshot on failure)
- `afterAll()` - Runs after all tests

## Logging

Tests use Winston logger for comprehensive logging:
- Logs saved to `logs/test.log`
- Console output for real-time monitoring
- Automatic screenshot on test failure
- HTML dump capture on failure

## Reports

Test reports are generated in multiple formats:
- **HTML Report**: `playwright-report/index.html`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `reports/screenshots/`
- **Videos**: `reports/videos/`
- **Traces**: `reports/traces/`

## Best Practices

1. **Page Objects**: Use page objects to maintain selectors in one place
2. **Test Data**: Keep test data in configuration or separate files
3. **Error Handling**: Tests include try-catch for better error reporting
4. **Screenshots**: Automatic screenshots on failure for debugging
5. **Logging**: Comprehensive logging for test audit trail
6. **Retry Logic**: Built-in retry mechanisms for flaky tests

## Troubleshooting

### Tests not running
```bash
# Reinstall dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Module not found errors
- Check file paths (case-sensitive on Linux/Mac)
- Ensure all imports use correct file names
- Verify file exists in the correct location

### Element not found
- Update selectors in page objects
- Use `--debug` mode to inspect element selectors
- Check if element is within iframe or shadow DOM

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:
```bash
CI=true npm test
```

## Contributing

1. Create tests following the page object pattern
2. Use descriptive test names with TC- prefix
3. Add console logs for debugging
4. Include error handling
5. Update documentation

## Contact

For issues or questions, contact: RiteshQATest

## License

ISC
