const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, getAllUsers, saveNewUser, validateUser, getUserById, deleteUserById, updateUserRole } = require('./utils/users');
const { getCurrentUser } = require('./auth/auth');

const jsondata = require('./products.json').map(product => ({...product }));

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    if(!request.headers.authorization){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(getCredentials(request)[1] === undefined){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(await getCurrentUser(request) === null){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(Object.values(await getCurrentUser(request))[4] === 'customer'){
      return responseUtils.forbidden(response);
    }
    else{
      const path = filePath.split('/');
      const user = getUserById(path[3]);
      if(method.toUpperCase() === 'GET'){
        if(user !== undefined){
          return responseUtils.sendJson(response,user);
        }
        else{
          return responseUtils.notFound(response);
        }
      }
      if(method.toUpperCase() === 'PUT'){
        const roLe = await parseBodyJson(request);
        if(user !== undefined){
          if(roLe['role'] === 'admin' || roLe['role'] === 'customer'){
            const newrole = updateUserRole(path[3],roLe['role']);
            return responseUtils.sendJson(response,newrole);
          }
          else{
            return responseUtils.badRequest(response);
          }
        }
      else{
        return responseUtils.notFound(response);
      }
    }
      if(method.toUpperCase() === 'DELETE'){
        const use = deleteUserById(path[3]);
        if(use !== undefined){
          return responseUtils.sendJson(response,use);
        }
        else{
          return responseUtils.notFound(response);
        }
      }
    }
  }
    // TODO: 8.6 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    // If the HTTP method of a request is OPTIONS you can use sendOptions(filePath, response) function from this module
    // If there is no currently logged in user, you can use basicAuthChallenge(response) from /utils/responseUtils.js to ask for credentials
    //  If the current user's role is not admin you can use forbidden(response) from /utils/responseUtils.js to send a reply
    // Useful methods here include:
    // - getUserById(userId) from /utils/users.js
    // - notFound(response) from  /utils/responseUtils.js 
    // - sendJson(response,  payload)  from  /utils/responseUtils.js can be used to send the requested data in JSON format

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    // TODO: 8.5 Add authentication (only allowed to users with role "admin")
    if(!request.headers.authorization){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(getCredentials(request)[1] === undefined){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(await getCurrentUser(request) === null){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(Object.values(await getCurrentUser(request))[4] === 'customer'){
      return responseUtils.forbidden(response);
    }
    else{
      return responseUtils.sendJson(response, getAllUsers());
    }
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    const json = await parseBodyJson(request);
    const reqbody = validateUser(json);
    
    if(reqbody.length === 0 && emailInUse(json.email) === false){
        const newUser = saveNewUser(json);
        newUser.role = 'customer';
        responseUtils.createdResource(response,newUser);
      }
    else{
      responseUtils.badRequest(response,"400 Bad Request");
    }

    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    // Useful methods here include:
    // - validateUser(user) from /utils/users.js 
    // - emailInUse(user.email) from /utils/users.js
    // - badRequest(response, message) from /utils/responseUtils.js
  }

  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    if(!request.headers.authorization){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(getCredentials(request)[1] === undefined){
      return responseUtils.basicAuthChallenge(response);
    }
    else if(await getCurrentUser(request) === null){
      return responseUtils.basicAuthChallenge(response);
    }
    else{
      return responseUtils.sendJson(response, jsondata);
    }
}
};

module.exports = { handleRequest };
