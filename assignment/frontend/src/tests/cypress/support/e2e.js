/** @format */

// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import { rest, worker } from '../../mocks/worker';

Cypress.on('test:before:run:async', async () => {
	// start msw mocking before any tests are run
	await worker.start({ quiet: false });
});

Cypress.on('window:before:load', (window) => {
	// regular cy.intercept() should probably be used to fake network errors etc.
	// bu make worker and rest available to the page (just in case)

	// Example usage inside a test:
	// cy.window().then(window => {
	//   const { rest, worker } = window.msw;
	//   worker.use(() => {
	//     rest.get('**/api/products', (req, res, ctx) => {
	//       return res(ctx.json([]));
	//     });
	//   });
	// });

	if (!window.msw) window.msw = { rest, worker };
});

Cypress.on('test:after:run', () => {
	// stop msw mocking after all tests are run
	worker.stop();
});

// Global beforeEach for all e2e tests
beforeEach(() => {
	// Reset any runtime handlers tests may use.
	// using cy.intercept() instead of direct manipulation should make this unnecessary
	cy.window().then((window) => {
		if (window?.msw?.worker) {
			const { worker } = window.msw;
			worker.resetHandlers();
		}
	});
});
