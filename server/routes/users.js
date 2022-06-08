var express = require('express');
var router = express.Router();
var sqlFile = require('../sqlite.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
let usersDatabase = {
  admin:  { username: "admin",  password: "password"}
}
*/

// Login section -- need to convert this to work with mysql
/*
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
*/

router.post('/login', function(req, res, next) {
  if('username' in req.body && 'password' in req.body){

    var correctPass = false;

    console.log(correctPass);
    correctPass = sqlFile.CheckPassword(req.body.username, req.body.password);

    console.log("Test " + correctPass);

    if(correctPass == false){
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
    var result = sqlFile.CreateNewUser(req.body.username, req.body.password);

    res.sendStatus(200);
  } else {
    console.log("ERROR");
  }
});


/*
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
*/

module.exports = router;
