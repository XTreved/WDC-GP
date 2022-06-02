// This was used to test the overview page
const TRACKED_SUBJECTS = [
    { title:'ADDS',         day:'Monday'},
    { title:'SPC',          day:'Tuesday'},
    { title:'WDC',          day:'Wednesday'}
];


// This was used to test the scraper page
const SAMPLE_SUBJECTS = [
    { title: 'Object Oriented Programming',         id: '1102', area: 'COMP SCI', availability: 'Semester 1'},
    { title: 'Algorithm Design & Data Structures',  id: '2103', area: 'COMP SCI', availability: 'Semester 2'},
    { title: 'Hot Topics in IoT Security',          id: '4106', area: 'COMP SCI', availability: 'Trimester 3'},
    { title: 'Biology I: Human Perspectives',       id: '1201', area: 'BIOLOGY',  availability: 'Semester 2'},
    { title: 'Postgraduate Professions Internship', id: '7500', area: 'PROF',     availability: 'Trimester 1'}
]



const LOGIN_DATA = [
    { username: 'LN',      password: 'WDC'}
]

var vueinst = new Vue({
    el: '#app',
    data: {
        
        /* Show or hide each section */
        selected: "scraper", // login, signup, home, calendar, scraper

        /* Home page testing */
        tracked_subjects: TRACKED_SUBJECTS,

        /* Scraper page testing */
        sample_subjects: SAMPLE_SUBJECTS
    }
});