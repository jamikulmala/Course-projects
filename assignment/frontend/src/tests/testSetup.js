/** @format */

import { afterAll, afterEach, beforeEach } from 'vitest';
import { server } from './mocks/server.js';

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
