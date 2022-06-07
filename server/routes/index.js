var express = require('express');
const { RouteTest } = require('../sqlite.js');
var router = express.Router();


// This was used to test the overview page
const TRACKED_SUBJECTS = [
  { title:'ADDS',         day:'Monday'},
  { title:'SPC',          day:'Tuesday'},
  { title:'WDC',          day:'Wednesday'}
];


// This was used to test the scraper page
const SAMPLE_SUBJECTS = [
  { title: 'Object Oriented Programming',         id: '1102', area: 'COMP SCI', availability: 'Semester 1'    },
  { title: 'Algorithm Design & Data Structures',  id: '2103', area: 'COMP SCI', availability: 'Semester 2'    },
  { title: 'Hot Topics in IoT Security',          id: '4106', area: 'COMP SCI', availability: 'Trimester 3'   },
  { title: 'Biology I: Human Perspectives',       id: '1201', area: 'BIOLOGY',  availability: 'Semester 2'    },
  { title: 'Postgraduate Professions Internship', id: '7500', area: 'PROF',     availability: 'Trimester 1'   }
]


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Adding courses */
router.post('/addCourse', function(req, res, next) {

});


/* Removing courses */
router.post('/removeCourse', function(req, res, next) {

});

/* Get courses - this request is for displaying courses on the home page */
router.get('/getCourses', function(req, res, next) {
  res.send(JSON.stringify(TRACKED_SUBJECTS));
});


module.exports = router;








