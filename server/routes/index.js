var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Login section -- need to convert this to work with mysql
router.post('/addCourse', function(req, res, next) {

});

router.

module.exports = router;
