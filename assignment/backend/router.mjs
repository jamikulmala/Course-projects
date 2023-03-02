import debug from 'debug';
import ApiRouter from './routes/api.mjs';

// Create logger for debugging
// (Better console.log with colours and does not show any output in production)
const log = debug('assignment-backend:router');

export const setupRoutes = app => {
  log('Setting up API routes');
  app.use('/api', ApiRouter);
};
