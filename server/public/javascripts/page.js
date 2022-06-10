var vueinst = new Vue({
    el: '#app',
    data: {
        
        // Show or hide each section
        selected:           "home",        // login, signup, home, calendar, scraper
        miniWindow:         "",             // This will be for the calendar/scraper screen

        // Login page login status
        loginPageStatus:    "Please enter your Username and Password",
        loginError:         false,

        // Home page testing
        tracked_subjects:   [],

        // Scraper page testing
        sample_subjects:    [],
        courseArea:         [],
        courseTitle:        [],
        courseAvailability: [],
        courseData:         []
    
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
            this.miniWindow = "";
        },
    }
});

function changeBackgroundColor(color){
    document.body.style.backgroundColor = color;
}




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
    let subjectArea = document.getElementById('subjectArea').value;
    console.log(subjectArea);
    // let subjectId = document.getElementById('subjectId')[0].value;
    let subjectTitle = document.getElementById('subjectTitle').value;
    let subjectAvailability = document.getElementById('subjectAvailability').value;

    let subjectForm = { subjectArea: subjectArea , subjectTitle: subjectTitle, subjectAvailability: subjectAvailability}; // Called subject Area but meant to be subject Id
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
function removeCourse(id){

    var testing = {courseName: id}

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            showCourses();
        }
    };

    xhttp.open("POST", "/removeCourse");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(testing));
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

/* Get the data for course area, used in scraper page */
function getCourseArea() {
    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        if (this.readyState == 4 && this.status == 200) {
            vueinst.courseArea = JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", "/getCourseArea", true);
    xhttp.send();
}

/* Get the course Title */
function getCourseTitle() {
    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        if (this.readyState == 4 && this.status == 200) {
            vueinst.courseTitle = JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", "/getCourseTitle", true);
    xhttp.send();
}

/* Get the course Title */
function getCourseAvailability() {
    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        if (this.readyState == 4 && this.status == 200) {
            vueinst.courseAvailability = JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", "/getCourseAvailability", true);
    xhttp.send();
}

function getCourseData(){
    let xhttp = new XMLHttpRequest();

    xhttp.onload = function() {

        if (this.readyState == 4 && this.status == 200) {
            vueinst.courseData = JSON.parse(this.responseText);
        }
    };

    xhttp.open("GET", "/getCourseData", true);
    xhttp.send();
}