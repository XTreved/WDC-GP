var express = require('express');

const router = express.Router();

// This was used to test the overview page
const TRACKED_SUBJECTS = [
  { title:'ADDS',         day:'Monday'},
  { title:'SPC',          day:'Tuesday'},
  { title:'WDC',          day:'Wednesday'},
  { title:'WDC',          day:'Wednesday'},
  { title:'WDC',          day:'Wednesday'}
];

// This was used to test the scraper page
const SAMPLE_SUBJECTS = [
  { title: 'Object Oriented Programming',         id: '1102', area: 'COMP SCI', availability: 'Semester 1'    },
  { title: 'Algorithm Design & Data Structures',  id: '2103', area: 'COMP SCI', availability: 'Semester 2'    },
  { title: 'Hot Topics in IoT Security',          id: '4106', area: 'COMP SCI', availability: 'Trimester 3'   },
  { title: 'Biology I: Human Perspectives',       id: '1201', area: 'BIOLOGY',  availability: 'Semester 2'    },
  { title: 'Postgraduate Professions Internship', id: '7500', area: 'PROF',     availability: 'Trimester 1'   }
];

const courseChoices = [ // this data was an can be scraped if new courses are added to university
    'ABORIG', 'ACCTFIN', 'ACCTING', 'ACUCARE', 'AGRIBUS', 'AGRIC',
    'AGRONOMY', 'AN BEHAV', 'ANAT SC', 'ANIML SC', 'ANTH', 'APP BIOL',
    'APP DATA', 'APP MTH', 'ARCH', 'ARTH', 'ARTS', 'ARTSEXP',
    'ASIA', 'AUST', 'BIOCHEM', 'BIOINF', 'BIOLOGY', 'BIOMED',
    'BIOMET', 'BIOSTATS', 'BIOTECH', 'BUSANA', 'C&ENVENG', 'CEME',
    'CHEM', 'CHEM ENG', 'CHIN', 'CLAS', 'COMMERCE', 'COMMGMT',
    'COMMLAW', 'COMP SCI', 'CONMGNT', 'CORPFIN', 'CRARTS', 'CRIM',
    'CRWR', 'CULTST', 'CYBER', 'DATA', 'DENT', 'DESST',
    'DEVT', 'ECON', 'ECOTOUR', 'EDUC', 'ELEC ENG', 'ENG',
    'ENGL', 'ENTREP', 'ENV BIOL', 'EXCHANGE', 'FILM', 'FOOD SC',
    'FREN', 'GEN PRAC', 'GEND', 'GENETICS', 'GEOG', 'GEOLOGY',
    'GERM', 'GSSA', 'HEALTH', 'HIST', 'HLTH SC', 'HONECMS',
    'HORTICUL', 'INDO', 'INTBUS', 'ITAL', 'JAPN', 'LARCH',
    'LAW', 'LING', 'MANAGEMT', 'MARKETNG', 'MATHS', 'MDIA',
    'MECH ENG', 'MEDIC ST', 'MEDICINE', 'MGRE', 'MICRO', 'MINING',
    'MUSCLASS', 'MUSCOMP', 'MUSEP', 'MUSEUM', 'MUSGEN', 'MUSHONS',
    'MUSICOL', 'MUSJAZZ', 'MUSONIC', 'MUSPERF', 'MUSPOP', 'MUSSUPST',
    'MUSTHEAT', 'NURSING', 'OB&GYNAE', 'OCCTH', 'ODONT', 'OENOLOGY',
    'OPHTHAL', 'ORALHLTH', 'ORT&TRAU', 'PAEDIAT', 'PALAEO', 'PATHOL',
    'PEACE', 'PETROENG', 'PETROGEO', 'PHARM', 'PHIL',  'PHYSICS',
    'PHYSIOL', 'PHYSIOTH', 'PLANNING', 'PLANT SC', 'POLICY', 'POLIS',
    'PROF', 'PROJMGNT', 'PROP', 'PSYCHIAT', 'PSYCHOL', 'PUB HLTH',
    'PURE MTH', 'RUR HLTH', 'SCIENCE', 'SOCI', 'SOIL&WAT', 'SPAN',
    'SPATIAL', 'SPEECH', 'STATS', 'SURGERY', 'TECH', 'TESOL',
    'TRADE', 'UAC', 'UACOL', 'VET SC', 'VET TECH', 'VITICULT',
    'WINE'
];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Adding courses */
router.post('/addCourse', function(req, res, next) {

});

router.get('/login', function (req, res, next) {
  res.render('login', {
      title: 'MSAL Node & Express Web App',
      isAuthenticated: req.session.isAuthenticated,
      username: req.session.account.username,
  });
});

/* Removing courses */
router.post('/removeCourse', function(req, res, next) {

});

/* Get courses - this request is for displaying courses on the home page */
router.get('/getCourses', function(req, res, next) {
  res.send(JSON.stringify(TRACKED_SUBJECTS));
});


router.get('/getCourseArea', function(req, res, next) {
  res.send(JSON.stringify(courseChoices));
});

module.exports = router;