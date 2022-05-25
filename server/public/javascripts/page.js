

const SAMPLE_SUBJECTS = [
    { title:'ADDS',         day:'Monday'    },
    { title:'SPC',          day:'Tuesday'   },
    { title:'WDC',          day:'Wednesday' }
];


var vueinst = new Vue({
    el: '#app',
    data: {
        
        /* Show or hide each section */
        showLoginPage: false,
        showOverviewPage: true,
        showCalendarPage: false,
        showCourseAddingPage: false,


        /* Overview page */
        subjects: SAMPLE_SUBJECTS
    }
});