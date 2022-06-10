var express = require('express');
const router = express.Router();
const { CreateNewUser, CheckPassword } = require('../sqlite');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

let usersDatabase = {
  admin:  { username: "admin",  password: "password"}
};

router.post('/login', async (req, res) => {

  if('username' in req.body && 'password' in req.body){
    
    const correctPass = await CheckPassword(req.body.username, req.body.password);
    

    console.log(correctPass);

    if(correctPass == true){
      console.log("Login Successful");
      res.sendStatus(200);
    } else {
      console.log("Incorrect username or password");
      res.sendStatus(401);
    }

  } else {
    console.log("bad request");
    res.sendStatus(400);
  
}});


// Sign up section -- need to convert this to work with mysql
router.post('/signup', async (req, res) => {


  if('username' in req.body && 'password' in req.body){

    var result = await CreateNewUser(req.body.username, req.body.password);

    if (result == true){ res.sendStatus(200);} 
    else { res.sendStatus(403);}

    
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;