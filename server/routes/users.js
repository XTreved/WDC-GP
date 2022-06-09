var express = require('express');
var router = express.Router();

var fetch = require('../fetch');
var { 
  GRAPH_BASE,
  GRAPH_ME_ENDPOINT,
  GRAPH_TEAMS_LIST_ENDPOINT,
  
} = require('../authConfig');

// custom middleware to check authentication state
function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route if un-authenticated
  }

  next();
}

router.get('/id',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
      // res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
      console.log(req.session.account.idTokenClaims);
      res.send(req.session.account.idTokenClaims);
  }
);

router.get('/profile',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
      try {
          const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
          res.send(graphResponse);
      } catch (error) {
          next(error);
      }
  }
);

router.get('/joinedTeams',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
      try {
          const graphResponse = await fetch(GRAPH_TEAMS_LIST_ENDPOINT, req.session.accessToken);
          res.send(graphResponse);
      } catch (error) {
          next(error);
      }
  }
);

/* ******************************** */

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

let usersDatabase = {
  admin:  { username: "admin",  password: "password"}
};

// Login section -- need to convert this to work with mysql
router.post('/login', function(req, res, next) {
  if('username' in req.body && 'password' in req.body){
    if(req.body.username in usersDatabase && usersDatabase[req.body.username].password === req.body.password){
      console.log("Login Successful");
      res.sendStatus(200);
    } else {
      console.log("Incorrect username or password");
      res.sendStatus(401);
    }

  } else {
    console.log("bad request");
    res.sendStatus(400);
  }
});

// Sign up section -- need to convert this to work with mysql
router.post('/signup', function(req, res, next) {
  if('username' in req.body && 'password' in req.body){
    if(req.body.username in usersDatabase){
      console.log("username taken");
      res.sendStatus(403);
    } else {
      usersDatabase[req.body.username] = { username: req.body.username,  password: req.body.password };
      console.log("User: " + req.body.username + " created");
      res.sendStatus(200);
    }

  } else {
    console.log("bad request");
    res.sendStatus(400);
  }
});

module.exports = router;
