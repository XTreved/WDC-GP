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
]

var vueinst = new Vue({
    el: '#app',
    data: {
        
        // Show or hide each section
        selected:           "home",         // login, signup, home, calendar, scraper
        miniWindow:         "",             // This will be for the calendar/scraper screen
        darkenScreen:       false,

        // Login page login status
        loginPageStatus:    "Please enter your Username and Password",
        loginError:         false,

        // Home page testing
        tracked_subjects:   [],

        // Scraper page testing
        sample_subjects:    [],
        courses:            courseChoices,
    
    }, methods: {
        // Display error texts on the login page
        loginErrorFormat: function() {

            // Change styling of error message
            this.loginError = true;

            // Revert changes after a certain amount of time
            setTimeout(() => {  
                this.loginPageStatus = "Please enter your Username and Password";
                this.loginError = false;
            }, 3000);
        },

        hidePopUpMenu: function() {
            this.darkenScreen = false;
            this.miniWindow = "";
        },
    }
});





/*                                  REQUESTS SENT TO THE USER.JS                                  */

/* Login page login function */
function login() {

    // Get the provided username or password
    let username = document.getElementsByName('Username')[0].value;
    let password = document.getElementsByName('Password')[0].value;

    let login_form = { username: username, password: password};

    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        // This section handles succesfful login
        if (this.readyState == 4 && this.status == 200) {
            console.log("Login Successful");
            vueinst.selected = "home";
        
        // This section handles incorrect username or password
        } else if (this.readyState == 4 && this.status == 401) {
            vueinst.loginPageStatus = "Incorrect Username or Password"
            vueinst.loginErrorFormat();

        // This section handles bad request
        } else if (this.readyState == 4 && this.status == 400){
            vueinst.loginPageStatus = "Bad Request"
            vueinst.loginErrorFormat();
        }
    };

    xhttp.open("POST", "users/login", true);
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(login_form));
}


/* Login page signup function */
function signup() {

    // Get the provided username and password
    let username = document.getElementsByName('newUsername')[0].value;
    let password = document.getElementsByName('newPassword')[0].value;

    // make username and password in a json format
    let signup_form = { username: username, password: password};

    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        // This handles on a successful signup, this will redirect to the login page
        if (this.readyState == 4 && this.status == 200) {
            console.log("Signup Successful");
            vueinst.selected = "login";
            vueinst.loginErrorFormat();
        
        // This handles for when username has already been taken
        } else if (this.readyState == 4 && this.status == 403) {
            vueinst.loginPageStatus = "Username Taken"
            vueinst.loginErrorFormat();

        // This handles bad request
        } else if (this.readyState == 4 && this.status == 400){
            vueinst.loginPageStatus = "Bad Request"
            vueinst.loginErrorFormat();
        }
    };

    xhttp.open("POST", "users/signup", true);
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(signup_form));
}





/*                                  REQUESTS SENT TO THE INDEX.JS                                  */

/* Function to add courses onto the home page */
function addCourse() {

    // Get the provided username or password
    let subjectArea = document.getElementById('subjectArea')[0].value;
    let subjectId = document.getElementById('subjectId')[0].value;
    let subjectTitle = document.getElementById('subjectTitle')[0].value;
    let subjectAvailability = document.getElementById('subjectAvailability')[0].value;

    let subjectForm = { Course_Title: subjectTitle, Subject_Area: subjectId, Term: subjectAvailability}; // Called subject Area but meant to be subject Id

    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        // This section handles succesfful login
        if (this.readyState == 4 && this.status == 200) {
            console.log("Subject Added Successfully");
            showCourses();
        }
    };

    xhttp.open("POST", "/addCourse", true);
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(subjectForm));
}

/* Function to remove course from the home page */
function removeCourse(){
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            showCourses();
        }
    };

    xhttp.open("POST", "/removeCourse");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newActor));
}




/* Displays the courses on the home page */
function showCourses(){
    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        if (this.readyState == 4 && this.status == 200) {
            vueinst.tracked_subjects = JSON.parse(this.response);
        }
    };

    xhttp.open("GET", "/getCourses", true);
    xhttp.send();

}