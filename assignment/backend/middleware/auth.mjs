import debug from 'debug';
import { User } from '../models/user.mjs';

// Create logger for debugging
// (Better console.log with colours and does not show any output in production)
const log = debug('assignment-backend:auth-middleware');

/**
 * Get JWT authentication token from request header
 *
 * @param {Request} req
 * @returns {string|null} token string or null if missing
 */
const getTokenFromCookie = req => {
  if (!('signedCookies' in req) || !req.signedCookies.token) {
    log('Missing or invalid token cookie');
    return null;
  }

  return req.signedCookies.token;
};

/**
 * Get token from cookie and make user available in the request object
 */
export const getCurrentUser = (req, res, next) => {
  try {
    // Check if a token was received
    const cookieOptions = { ...res.app.get('cookieOptions'), signed: true };
    const token = getTokenFromCookie(req);
    if (!token) return next(); // no token

    // Verify the received token
    const decodedToken = User.verifyToken(token);
    if (!decodedToken) {
      log('Invalid token.');
      res.clearCookie('token', cookieOptions);
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Verify that the user actually exists in the database
    const user = User.findByEmail(decodedToken.email);
    if (!user) {
      log('Unknown user.');
      res.clearCookie('token', cookieOptions);
      return res.status(403).json({ error: 'Unknown user' });
    }

    // Authentication succeeded:
    //   1. set the current user to be available inside the current request
    //   2. refresh cookie
    req.user = user;
    res.cookie('token', user.getToken(), cookieOptions);
    next();
  } catch (err) {
    log('Authentication failed');
    return res.sendStatus(500);
  }
};

/**
 * Express middleware to check whether a valid JWT authentication token is supplied or not
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns calls next() on valid token and otherwise sends response with appropriate error status (401, 404 or 500)
 */
export const requireAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Login required' });
  if (!req.user.isAdmin()) return res.status(403).json({ error: 'Admin rights required' });
  next();
};

export const requireCustomer = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Login required' });
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer rights required' });
  }
  next();
};

export const requireNotAuthenticated = (req, res, next) => {
  if (req.user) {
    res.status(403).json({ error: 'Only for guests' });
  }
  next();
};

export const requireNotSelf = (req, res, next) => {
  if (req.user && req.params.id && req.user.id === req.params.id) {
    res.status(400).json({ error: 'Modifying own data is not allowed' });
  }
  next();
};
