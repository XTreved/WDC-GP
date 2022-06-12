// const fetchManager = require('../utils/fetchManager');
// const appSettings = require('../msid');
// const graphManager = require('../utils/graphManager');
// const shifts = require('../bin/shifts');

// initialize router using the promise router module
const router = require('express-promise-router')();
// require('dotenv').config();
const graph = require('../bin/graph');

/* GET auth callback. */
router.get('/signin',
  async (req, res)=>{
    const urlParameters = {
      scopes: process.env.OAUTH_SCOPES.split(','),
      redirectUri: process.env.REDIRECT_URI
    };

    try {
      const authUrl = await req.app.locals
        .msalClient.getAuthCodeUrl(urlParameters);
      res.redirect(authUrl);
    }
    catch (error) {
      console.log(`Error: ${error}`);
      // Create an error here to display in the front-end. Not getting Auth URL
      res.redirect('/');
    }
  }
);

/**
 * callback runs after a successful signin.
 * All logic and database operations which follow should be contained in this router
 * Eventually, sqlite should be used for data storage
 */
router.get('/callback',
  async (req, res)=>{
    const tokenRequest = {
      code: req.query.code,
      scopes: process.env.OAUTH_SCOPES.split(','),
      redirectUri: process.env.REDIRECT_URI
    };

    try {
      const response = await req.app.locals
        .msalClient.acquireTokenByCode(tokenRequest);

      // Save the user's homeAccountId in their session
      req.session.userId = response.account.homeAccountId;

      const user = await graph.getUserDetails(
        req.app.locals.msalClient,
        req.session.userId
      );

      // Add the user to user storage
      req.app.locals.users[req.session.userId] = {
        displayName: user.displayName,
        msId: user.id,
      };
      console.log("Authentication successful");
    } catch(error) {
      console.log("Failed to finalise authentication of user\n"+error);
      // do something here to properly show the user that authentication has failed
    }

    res.redirect('/');
  }
);

router.get('/id',
    (req,res) => {
        res.send(req.app.locals.users[req.session.userId]);
    }
);

router.get('/signout',
  async (req, res)=>{
    // Sign out
    if (req.session.userId) {
      // Look up the user's account in the cache
      const accounts = await req.app.locals.msalClient
        .getTokenCache()
        .getAllAccounts();

      const userAccount = accounts.find(a => a.homeAccountId === req.session.userId);

      // Remove the account
      if (userAccount) {
        req.app.locals.msalClient
          .getTokenCache()
          .removeAccount(userAccount);
      }
    }

    // Destroy the user's session
    req.session.destroy( (err)=>{
      res.redirect('/');
    });
  }
);

module.exports = router;