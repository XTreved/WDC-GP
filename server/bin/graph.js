var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
  /**
   * Returns the contents of graph/v1.0/me. Personally identifiable info
   * @param {*} msalClient 
   * @param {*} userId 
   * @returns 
   */
  getUserDetails: async function(msalClient, userId) {
    const client = getAuthenticatedClient(msalClient, userId, ["user.read"]);

    const user = await client
      .api('/me')
      .get();
    return user;
  },
  /**
   * Wraps the getAuthenticatedClient function as an accessible module
   * @param {*} msalClient 
   * @param {*} userId 
   * @param {*} scopes 
   * @returns A Graph client
   */
  getAuthClient: (msalClient, userId, scopes) => {
    return getAuthenticatedClient(msalClient,userId,scopes);
  }
};

function getAuthenticatedClient(msalClient, userId, reqScopes) {
  if (!msalClient || !userId || !reqScopes) {
    throw new Error(
      `Invalid MSAL state. Client: ${msalClient ? 'present' : 'missing'}, User ID: ${userId ? 'present' : 'missing'}, Scopes: ${reqScopes ? 'present' : 'missing'}`);
  }

  // Initialize Graph client
  const client = graph.Client.init({
    // Implement an auth provider that gets a token
    // from the app's MSAL instance
    authProvider: async (done) => {
      try {
        // Get the user's account
        const account = await msalClient
          .getTokenCache()
          .getAccountByHomeId(userId);

        if (account) {
          // Attempt to get the token silently
          // This method uses the token cache and
          // refreshes expired tokens as needed
          const response = await msalClient.acquireTokenSilent({
            scopes: reqScopes,
            redirectUri: process.env.OAUTH_REDIRECT_URI,
            account: account
          });

          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken);
        }
      } catch (err) {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        done(err, null);
      }
    }
  });

  return client;
}