

const SAMPLE_SUBJECTS = [
    { title:'ADDS',         day:'Monday'    },
    { title:'SPC',          day:'Tuesday'   },
    { title:'WDC',          day:'Wednesday' }
];


var vueinst = new Vue({
    el: '#app',
    data: {
        
        /* Show or hide each section */
        selected: "login", // login, home, calendar, scraper

        /* Home page testing */
        subjects: SAMPLE_SUBJECTS
    }
});