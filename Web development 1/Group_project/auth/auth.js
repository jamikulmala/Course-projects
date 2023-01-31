const { getCredentials } = require("../utils/requestUtils");
const { getUser } = require("../utils/users");

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.5 Implement getting current user based on the "Authorization" request header

  // NOTE: You can import two methods which can be useful here: // - getCredentials(request) function from utils/requestUtils.js
  // - getUser(email, password) function from utils/users.js to get the currently logged in user
  const user = getCredentials(request);
  const currentUser = await getUser(user[0], user[1]);
  if(currentUser !== undefined){
    return currentUser;
  }
  else{
    return null;
  }

};

module.exports = { getCurrentUser };
