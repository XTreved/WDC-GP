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

var vueinst = new Vue({
    el: '#app',
    data: {
        
        /* Show or hide each section */
        selected: "login", // login, signup, home, calendar, scraper

        /* Login page login status */
        loginPageStatus: "Please enter your Username and Password",
        loginError: false,

        /* Home page testing */
        tracked_subjects: TRACKED_SUBJECTS,

        /* Scraper page testing */
        sample_subjects: SAMPLE_SUBJECTS,



    
    }, methods: {
        /* Display error texts on the login page */
        loginErrorFormat: function() {

            /* Change styling of error message */
            this.loginError = true;

            /* Revert changes after a certain amount of time */
            setTimeout(() => {  
                this.loginPageStatus = "Please enter your Username and Password";
                this.loginError = false;
            }, 5000);
        }
    }
});

function login() {

    let username = document.getElementsByName('Username')[0].value;
    let password = document.getElementsByName('Password')[0].value;

    let login_form = { username: username, password: password};

    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Login Successful");
            vueinst.selected = "home";


        } else if (this.readyState == 4 && this.status == 401) {
            vueinst.loginPageStatus = "Incorrect Username or Password"
            vueinst.loginErrorFormat();

        } else if (this.readyState == 4 && this.status == 400){
            vueinst.loginPageStatus = "Bad Request"
            vueinst.loginErrorFormat();
        }
    };

    xhttp.open("POST", "users/login", true);
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(login_form));
}

function signup() {
    let username = document.getElementsByName('newUsername')[0].value;
    let password = document.getElementsByName('newPassword')[0].value;

    let signup_form = { username: username, password: password};

    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Signup Successful");
            
            vueinst.selected = "login";
            vueinst.loginErrorFormat();

        } else if (this.readyState == 4 && this.status == 403) {
            vueinst.loginPageStatus = "Username Taken"
            vueinst.loginErrorFormat();

        } else if (this.readyState == 4 && this.status == 400){
            vueinst.loginPageStatus = "Bad Request"
            vueinst.loginErrorFormat();
        }
    };

    xhttp.open("POST", "users/signup", true);
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(signup_form));
}