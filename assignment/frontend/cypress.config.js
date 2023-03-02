/** @format */

import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: true,
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'src/tests/cypress/support/e2e.js',
    downloadsFolder: 'src/tests/cypress/downloads',
    fixturesFolder: 'src/tests/cypress/fixtures',
    specPattern: 'src/tests/cypress/e2e/',
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json'
    }
  }
});
