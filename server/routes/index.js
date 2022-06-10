var express = require('express');
var router = express.Router()
const { CreateNewUser, CheckPassword } = require('../sqlite');
// const subjectTitles = require('../web-scraper/connectFrontEnd');

// WDC
const TRACKED_SUBJECTS = [];

const courseTimes = [
  { Class_Nbr: '11564', Dates: '9 Mar -  6 Apr',    Days: 'Wednesday',  Time: '1pm - 2pm',    Location: 'Ingkarni Wardli, 218, Teaching Room' },
  { Class_Nbr: '11564', Dates: '27 Apr -  8 Jun',   Days: 'Wednesday',  Time: '1pm - 2pm',    Location: 'Ingkarni Wardli, 218, Teaching Room' },
  
  { Class_Nbr: '11566', Dates: '10 Mar -  7 Apr',   Days: 'Thursday',   Time: '10am - 11am',  Location: 'Ingkarni Wardli, 218, Teaching Room' },
  { Class_Nbr: '11566', Dates: '28 Apr -  9 Jun',   Days: 'Thursday',   Time: '10am - 11am',  Location: 'Ingkarni Wardli, 218, Teaching Room' },
  
  { Class_Nbr: '11567', Dates: '11 Mar -  8 Apr',   Days: 'Friday',     Time: '2pm - 3pm',    Location: 'Ingkarni Wardli, 218, Teaching Room' },
  { Class_Nbr: '11567', Dates: '29 Apr -  10 Jun',  Days: 'Friday',     Time: '2pm - 3pm',    Location: 'Ingkarni Wardli, 218, Teaching Room' },
  
  { Class_Nbr: '11568', Dates: '10 Mar -  7 Apr',   Days: 'Thursday',   Time: '9am - 10am',   Location: 'Ingkarni Wardli, 218, Teaching Room' },
  { Class_Nbr: '11568', Dates: '28 Apr -  9 Jun',   Days: 'Thursday',   Time: '9am - 10am',   Location: 'Ingkarni Wardli, 218, Teaching Room' },
  
  { Class_Nbr: '11569', Dates: '9 Mar -  6 Apr',    Days: 'Wednesday',  Time: '12pm - 1pm',   Location: 'Ingkarni Wardli, 218, Teaching Room' },
  { Class_Nbr: '11569', Dates: '27 Apr -  8 Jun',   Days: 'Wednesday',  Time: '12pm - 1pm',   Location: 'Ingkarni Wardli, 218, Teaching Room' },
  
  { Class_Nbr: '11570', Dates: '11 Mar -  8 Apr',   Days: 'Friday',     Time: '12pm - 1pm',   Location: 'Ingkarni Wardli, B18, Teaching Room' },
  { Class_Nbr: '11570', Dates: '29 Apr -  10 Jun',  Days: 'Friday',     Time: '12pm - 1pm',   Location: 'Ingkarni Wardli, B18, Teaching Room' },
  
  { Class_Nbr: '19529', Dates: '10 Mar -  7 Apr',   Days: 'Thursday',   Time: '3pm - 4pm',    Location: 'MyUni, OL, Online Class'             },
  { Class_Nbr: '19529', Dates: '28 Apr -  9 Jun',   Days: 'Thursday',   Time: '3pm - 4pm',    Location: 'MyUni, OL, Online Class'             },
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

const subjectTitles = [
  'Puzzle Based Learning',
  'Introduction to Computer Systems, Networks and Security',
  'Information Technology Project',
  'Introduction to Applied Programming',
  'Object Oriented Programming',
  'Grand Challenges in Computer Science',
  'Introduction to Software Engineering',
  'Computer Systems',
  'Systems Programming',
  'Topics in Computer Science',
  'Programming for IT Specialists',
  'Algorithm Design & Data Structures',
  'Algorithm & Data Structure Analysis',
  'Foundations of Computer Science',
  'Problem Solving & Software Development',
  'Software Engineering Workshop I',
  'Software Engineering Workshop II',
  'Web & Database Computing',
  'Databases and Ethical Data',
  'Computer Networks & Applications',
  'Operating Systems',
  'Software Engineering & Project',
  'Artificial Intelligence',
  'Distributed Systems',
  'Advanced Topics in Computer Science',
  'Industry Project in Information Technology',
  'Engineering Software as Services I',
  'Engineering Software as Services II',
  'Parallel and Distributed Computing',
  'Mining Big Data',
  'Secure Programming',
  'Cybersecurity Fundamentals',
  'Software Engineering & Project (Artificial Intelligence)',
  'Software Engineering & Project (Data Science)',
  'Software Engineering & Project (Cybersecurity)',
  'Software Engineering & Project (Distributed Systems & Networking)',
  'Introduction to Statistical Machine Learning',
  'Computer Vision',
  'Evolutionary Computation',
  'Using Machine Learning Tools',
  'ECMS Internship',
  'Computer Science Honours Research Project Part A',
  'Computer Science Honours Research Project Part B',
  'Software Process Improvement',
  'Mobile and Wireless Systems',
  'Hot Topics in IoT Security',
  'Mobile and Wireless Systems Hons',
  'Research Methods in Software Engineering and Computer Science',
  'Advanced Algorithms',
  'Event Driven Computing',
  'Secure Software Engineering',
  'Introduction to Quantum Computing',
  'Software Engineering Research Project A',
  'Software Engineering Research Project B',
  'Applied Machine Learning UG',
  'Applied Natural Language Processing UG',
  'Applied Machine Learning Honours',
  'Applied Natural Language Processing Honours',
  'Specialised Programming',
  'Computer Network & Applications (Part B)',
  'Computer Systems (Part B)',
  'Master of Software Engineering Project Part A',
  'Master of Software Engineering Project Part B',
  'Master Data Science Research Project Part B',
  'Master of Computing & Innovation Project',
  'Master Computer Science Research Project - Part A',
  'Master Computer Science Research Project - Part B',
  'Cyber Security Research Project Part A',
  'Cyber Security Research Project Part B',
  'Cyber Security Industry Project Part A',
  'Cyber Security Industry Project Part B',
  'Algorithm Design and Data Structures',
  'Algorithm & Data Structure Analysis (Part B)',
  'Artificial Intelligence and Machine Learning Research Project Part A',
  'Artificial Intelligence and Machine Learning Research Project Part B',
  'Artificial Intelligence and Machine Learning Industry Project Part A',
  'Artificial Intelligence and Machine Learning Industry Project Part B',
  'Web and Database Computing',
  'Programming and Computational Thinking for Data Science',
  'Big Data Analysis and Project',
  'Foundations of Computer Science A',
  'Foundations of Computer Science - Python A',
  'Foundations of Computer Science B',
  'Foundations of Computer Science - Python B',
  'Human and Ethical Factors in Computer Science',
  'Applied Privacy',
  'Human-Centred Security',
  'Introduction to System Security',
  'Using Machine Learning Tools PG',
  'Deep Learning Fundamentals',
  'Big Data Analysis & Industry Project',
  'Concepts in Artificial Intelligence and Machine Learning',
  'Concepts in Cyber Security',
  'Research Methods',
  'Applied Machine Learning',
  'Applied Natural Language Processing',
  'Research Methods for Cyber Security'
];

const subjectAvailability = [
  'Semester 1',
  'Semester 2',
  'Trisemester 1',
  'Trisemester 2',
  'Trisemester 3',
  'Online Teaching Period 1',
  'Online Teaching Period 2',
  'Online Teaching Period 3',
  'Online Teaching Period 4',
  'Online Teaching Period 5',
  'Online Teaching Period 6',
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Adding courses */
router.post('/addCourse', function(req, res, next) {
  // res.send( {title: req.body.subjectTitles} )

  if('subjectArea' in req.body && 'subjectTitle' in req.body && 'subjectAvailability' in req.body ){

    TRACKED_SUBJECTS.push({title: req.body.subjectTitle, timestamp: new Date()});
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});


/* Removing courses */
router.post('/removeCourse', function(req, res, next) {
  for(let i in TRACKED_SUBJECTS){
    if (req.body.courseName == TRACKED_SUBJECTS[i].title){
      TRACKED_SUBJECTS.splice(i, 1);
    }
    i--;
  }
  res.sendStatus(200);
});

/* Get courses - this request is for displaying courses on the home page */
router.get('/getCourses', function(req, res, next) {
  res.send(JSON.stringify(TRACKED_SUBJECTS));
});

/* Get course area */
router.get('/getCourseArea', function(req, res, next) {
  res.send(JSON.stringify(courseChoices));
});

/* Get course title */
router.get('/getCourseTitle', function(req, res, next) {
  res.send(JSON.stringify(subjectTitles));
});

/* Get course availability */
router.get('/getCourseAvailability', function(req, res, next) {
  res.send(JSON.stringify(subjectAvailability));
});

/* Get course workshop times */
router.get('/getCourseData', function(req, res, next) {
  res.send(JSON.stringify(courseTimes));
});


module.exports = router;

/*
// This was used to test the scraper page
const SAMPLE_SUBJECTS = [
  { title: 'Object Oriented Programming',         id: '1102', area: 'COMP SCI', availability: 'Semester 1'    },
  { title: 'Algorithm Design & Data Structures',  id: '2103', area: 'COMP SCI', availability: 'Semester 2'    },
  { title: 'Hot Topics in IoT Security',          id: '4106', area: 'COMP SCI', availability: 'Trimester 3'   },
  { title: 'Biology I: Human Perspectives',       id: '1201', area: 'BIOLOGY',  availability: 'Semester 2'    },
  { title: 'Postgraduate Professions Internship', id: '7500', area: 'PROF',     availability: 'Trimester 1'   }
]
*/