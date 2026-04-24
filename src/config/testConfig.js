require('dotenv').config();

const config = {
  // Base URLs
  baseUrl: process.env.BASE_URL || 'https://www.easemytrip.com',
  
  // Timeouts
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
  actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '10000'),
  
  // Browser settings
  headless: process.env.HEADLESS !== 'false',
  slowMotion: parseInt(process.env.SLOW_MOTION || '0'),
  
  // Environment
  environment: process.env.ENVIRONMENT || 'staging',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Screenshot/Video settings
  takeScreenshots: process.env.TAKE_SCREENSHOTS !== 'false',
  recordVideo: process.env.RECORD_VIDEO === 'true',
  
  // Credentials (use with caution - prefer env vars)
  testUserEmail: process.env.TEST_USER_EMAIL || 'test@example.com',
  testUserPassword: process.env.TEST_USER_PASSWORD || 'password123',
};

module.exports = config;
