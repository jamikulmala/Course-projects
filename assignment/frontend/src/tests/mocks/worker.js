/** @format */

import { rest, setupWorker } from 'msw';
import { handlers } from './handlers';

// Setup requests interception using the given handlers.
const worker = setupWorker(...handlers);
window.msw = { rest, worker };

export { rest, worker };
