// sqlite3 docs
// https://github.com/TryGhost/node-sqlite3/wiki/API
// https://www.npmjs.com/package/sqlite3

// npm install sqlite3



/*
//JSON Object from webscraper
Data = {
  Subject_Area: "Comp Sci", 
  Course_Title: "Puzzle Based Learning",
  Term: "Semester 1",
  Subject_Id: "1010",              //could be 1010UAC so needs to be a string not int
  Units: 3,
  Career: "Undergraduate",
  Campus: "North Terrace",
  Scrape_Timestamp: 1234,           // must be in int format, Sql cannot store date/time data
  Class_Details: {
    Lecture: [                      // this is an array of objects, eg make a new object for each of the classes
      {
        Class_Number: 1234,
        Section: "LE01",
        Size: 250,
        Available: 50,              // On course planner if a class is full itll say "FULL", may want to store this as 0 if the class if full so we can keep it of type int;
        Class_Times: [
          {                         // have one of these objects for each class time then append it to this list
            Start_Date: 1,          // having the day and month separanted helps so that we can comvert it into a date time later
            Start_Month: "Mar",
            End_Date: 5,
            End_Month: "Apr",
            Days: "Tuesday",
            Start_Time: "11am",     // may want to use 24 hour time is it is easier, although couse planner uses 12 hour time
            End_Time: "12pm",
            Location: "Darling West, G14, Darling West Lecture Theatre",      // can just use the whole location as one string no need to separate it more 
            Note: "Blah Blah Blah"                                            // put the note at the bottom here
          }
        ]
      }
    ],
    Workshop: [                     // same data here as in the lecture object, can leave any of these empty is there is not data to fill in there                   

    ],

    Practical: [                    // same data here as in the lecture object, can leave any of these empty is there is not data to fill in there
      
    ]           

    // if there are ano other types of classes other than lecture, workshop, practical add them here, but let James know so i have to same format of the JSON as the web scraper so i dont ignore some data
  }
}

*/



// import sqlite3 and load the database, or else it will create one it it doesnt exist
const sqlite3 = require('sqlite3');
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) 
  {
    console.log("Error occured: " + err.message);
  }
  else
  {
    console.log("Database connected");
  }
});

/* Test Code
db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info);
    });
});
*/

// create or load in the tables
db.serialize(() => {
    let sqlString = "";
    
    // if it is new then i will also need to add all of the tables for the first time
    
    // Login_Data (needed first as it is referenced)
    sqlString = "CREATE TABLE if not exists Login_Data ( \
                    Username TEXT PRIMARY KEY, \
                    Password TEXT);";
    // now run the command
    db.run(sqlString);
    
    
    // Class_Times
    sqlString = "CREATE TABLE if not exists Class_Times ( \
                    ID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    Beginning_Date INTEGER, \
                    Ending_Date INTEGER, \
                    Day TEXT, \
                    Beginning_Time INTEGER, \
                    Ending_Time INTEGER, \
                    Location TEXT);";
    db.run(sqlString);
    
    
    // Class_Data
    sqlString = "CREATE TABLE if not exists Class_Data ( \
                    Class_Number INTEGER PRIMARY KEY, \
                    Section TEXT, \
                    Size INTEGER, \
                    Available INTEGER, \
                    Notes TEXT, \
                    ID INTEGER, \
                    FOREIGN KEY (ID) \
                        REFERENCES Class_Times (ID) \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE);";
    db.run(sqlString);
    
    
    // Class_Details
    sqlString = "CREATE TABLE if not exists Class_Details ( \
                    Class_Type TEXT PRIMARY KEY, \
                    Class_Number INTEGER, \
                    FOREIGN KEY (Class_Number) \
                        REFERENCES Class_Data (Class_Number) \
                            ON UPDATE CASCADE \
                            ON DELETE CASCADE);";
    db.run(sqlString);
    
    
    // Scrape_Tiestamps
    sqlString = "CREATE TABLE if not exists Scrape_Timestamps ( \
                    Scrape_Timestamps INTEGER PRIMARY KEY, \
                    Class_Type TEXT, \
                    FOREIGN KEY (Class_Type) \
                        REFERENCES Class_Details (Class_Type) \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE);";
    db.run(sqlString);
    
    
    // may need commas after the end of the foreign keys
    // Users_Subjects
    sqlString = "CREATE TABLE if not exists Users_Subjects ( \
                    Subject_Area TEXT, \
                    Term TEXT, \
                    Course_Title TEXT, \
                    Timestamp INTEGER, \
                    Username INTEGER, \
                    PRIMARY KEY (Subject_Area, Term, Course_title), \
                    FOREIGN KEY (Username) \
                        REFERENCES Login_Data (Username) \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE, \
                    FOREIGN KEY (Timestamp) \
                        REFERENCES Timestamps (Scrape_Timestamps) \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE);";
    // now run the command
    db.run(sqlString);
});



// this will take in a users names and id and create a spot in out database to save there data, 
// login like username and password should be delt with using some form of secure login 
function CreateNewUser(username, password) {
  var sqlPrepare = "INSERT INTO Login_Data (Username, Password) VALUES (?, ?);";

  db.run(sqlPrepare, [username, password]);

  return "Successful creation";
  
  // will returns void
}

function CheckPassword(username, password) {
    /*
    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
      console.log(row.id + ": " + row.info);
    });
    */
    sqlString = "SELECT Password \
                    FROM Login_Data \
                    WHERE Username = ?";
    var result = db.all(sqlString, [username], (err, rows) => {
      if(err){
        console.log(err);
      }
      for (row of rows) {
        console.log(row)
        var grabPass = row.Password;
        console.log(row.Password);
      }
    });
    
    //console.log(row.password);
    
    console.log("Given Username: " + username);
    console.log("Given Password: " + password);
    console.log("Grabbed Password: " + grabPass);
    console.log("Done");
  
}

// may need to do something with user login here so i know which user probably just ID will do as it is unique
// here i will get all if the data from the current timestamp and put it into a form that can be accessed buy our front end to be used
function GetAllData(timestamp, subject, term, subjectID, course) {
  sqlString = "SELECT Scrape_Timestamps, \
                  FROM Users_Subjects, \
                  WHERE Users_Subjects.Subject_Area = " + subject + ", \
                  AND Users_Subjects.Term = " + term + ", \
                  AND Users_Subjects.Subject_ID = " + subjectID + ", \
                  AND Users_Subjects.Course_Title = " + course + ";"
  var returnVal = db.run(sqlString);
  
  // will return a list of the timestamps saved, (in the form of int's)
  return returnVal;
  // will return json with all the data
}

// this will get all of the timestamps for this specific subject so that the user can choose which one to use to do other things with
function GetTimestamps(subject, term, subjectID, course) {
  sqlString = "SELECT Scrape_Timestamps, \
                  FROM Users_Subjects, \
                  WHERE Users_Subjects.Subject_Area = " + subject + ", \
                  AND Users_Subjects.Term = " + term + ", \
                  AND Users_Subjects.Subject_ID = " + subjectID + ", \
                  AND Users_Subjects.Course_Title = " + course + ";"
  var returnVal = db.run(sqlString);
  
  // will return a list of the timestamps saved, (in the form of int's)
  return returnVal;
}

// this wil get all of the subjects the the user has previously scraped, this is to be able to show them on out front end
function GetUsersSubjects(userID) {
  sqlString = "SELECT Subject_Area, Term, Subject_ID, Course_Title, \
                  FROM Users_Subjects, \
                  WHERE Users_Subjects.User_ID = " + userID + ";";
  var returnVal = db.run(sqlString);

  // need to format the return type but need data to see what it would output.

// will return a list of the subjects saved, each element in the list will be a object with: Subject, Term, Course, SubjectID
return returnVal;
}

// this will take json which will come from the webscraper and ill unpack it here and add the new data to out database of the recent scrape
function AddNewData(scrapeData, username) {

  //console.log(scrapeData);

  courseInfo = scrapeData['course_details'];

  var subjectArea = courseInfo['Subject_Area'];
  var courseTitle = courseInfo['Course_Title'];
  var career = courseInfo['Career'];
  var term = courseInfo['Term'];
  var campus = courseInfo['Campus'];
  var timestamp = scrapeData["Time"];

  // add the values to the DB

  // NEEDS TO BE PREPARED
  var sqlPrepare = "INSERT INTO Users_Subjects (Subject_Area, Term, Course_Title, Timestamp, Username) VALUES (?, ?, ?, ?, ?);";
  db.run(sqlPrepare, [subjectArea, term, courseTitle, timestamp, username])


  classTypes = ["Lecture", "Practical"]
  for (var type in classTypes) {
    if (scrapeData['class_details'][classTypes[type]] != null) {
      var dataString = scrapeData['class_details'][classTypes[type]];
      for (var row in dataString) {
        var data = JSON.stringify(dataString[row]);
  
        var classNum = data['Class Nbr'];
        var section = data['Section'];
        var size = data['Size'];
        var available = data['Available'];
        var dates = data['Dates'];
        var day = data['Days'];
        var notes = data['Notes'];
        var location = data['Location']
        var times = data['Time'];
  
        // may be more things i cant see
  
        // format dates into start and end
        dates = "28 Feb -  6 Apr";
        var datesArr = dates.split(" ");
        var startDate = datesArr[0] + " " + datesArr[1];
        var endDate = datesArr[4] + " " + datesArr[5];
        
        times = "1pm - 3pm";
        var timesArr = times.split(" ");
        var startTime = timesArr[0];
        var endTime = timesArr[2];
  
  
        // add the lecture data to the DB
        
        // Scrape_Timestamps
        db.serialize(function() {
          var sqlPrepare = "INSERT INTO Scrape_Timestamps (Scrape_Timestamps, Class_Type) VALUES (?, ?);";
          db.run(sqlPrepare, [timestamp, classTypes[type]]);
          
    
          // Class_Details
          var sqlPrepare = "INSERT INTO Class_Details (Class_Type, Class_Number) VALUES (?, ?);";
          db.run(sqlPrepare, [classTypes[type], classNum]);
    
    
          // Class_Times
          var sqlPrepare = "INSERT INTO Class_Times (Beginning_Date, Ending_Date, Day, Beginning_Time, Ending_Time, Location) VALUES (?, ?, ?, ?, ?, ?);";
          db.run(sqlPrepare, [startDate, endDate, day, startTime, endTime, location]);
    
          // now i need to get the id to insert into the class data table
          sqlString = "SELECT ID, \
                          FROM Class_Times \
                          Where Class_Times.Beginning_Date = " + startDate + " \
                          AND Class_Times.Ending_Date = " + endDate + " \
                          AND Class_Times.Day = " + day + " \
                          AND Class_TImes.Beginning_Time = " + startTime + " \
                          AND Class_TImes.Ending_Time = " + endTime + " \
                          AND Class_TImes.Location = " + location + ";";
          var ID = db.run(sqlString);
    
          // Class_Data
          var sqlPrepare = "INSERT INTO Class_Data (Class_Number, Section, Size, Available, Notes, ID) VALUES (?, ?, ?, ?, ?, ?);";
          db.run(sqlPrepare, [classNum, section, size, available, notes, ID]);
        });
      }
    }
  }
  // will return void
}


function Test() {
  console.log("Starting Test");

  data = {
    "Time": "2022-06-06T12:32:49.857Z",
    "course_details": {
        "Subject_Area": "COMP SCI 2103 ",
        "Course_Title": " Algorithm Design & Data Structures",
        "Career": "Undergraduate",
        "Units": "3",
        "Term": "Semester 1",
        "Campus": "North Terrace",
        "Contact": "Up to 6 hours per week",
        "Restriction": "Not available to B. Information Technology students",
        "Available for Study Abroad and Exchange": "Yes",
        "Available for Non-Award Study": "No",
        "Pre-Requisite": "COMP SCI 1102 or COMP SCI 1202",
        "Incompatible": "COMP SCI 1103, COMP SCI 1203, COMP SCI 2004, COMP SCI 2202, COMP SCI 2202B"
    },
    "class_details": {
        "Lecture": [
            "{\"Class Nbr\":\"Location\",\"Section\":\"15519\",\"Size\":\"LE01\",\"Available\":\"410\",\"Dates\":\"37\",\"Days\":\"28 Feb -  6 Apr\",\"Time\":\"Monday, Wednesday\",\"Location\":\"3pm - 4pm\"}",
            "{\"Class Nbr\":\"Location\",\"Section\":\"15519\",\"Size\":\"LE01\",\"Available\":\"410\",\"Dates\":\"The Braggs, G60, Bragg Lecture Theatre\",\"Days\":\"1 Mar -  5 Apr\",\"Time\":\"Tuesday\",\"Location\":\"10am - 11am\"}"
        ],
        "Practical": [
            "{\"Class Nbr\":\"Location\",\"Section\":\"15520\",\"Size\":\"PR10\",\"Available\":\"40\",\"Dates\":\"2\",\"Days\":\"4 Mar -  8 Apr\",\"Time\":\"Friday\",\"Location\":\"1pm - 3pm\"}",
            "{\"Class Nbr\":\"Location\",\"Section\":\"15520\",\"Size\":\"PR10\",\"Available\":\"40\",\"Dates\":\"Ingkarni Wardli, B15, CAT Suite\",\"Days\":\"29 Apr -  3 Jun\",\"Time\":\"Friday\",\"Location\":\"1pm - 3pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15521\",\"Size\":\"PR09\",\"Available\":\"40\",\"Dates\":\"1\",\"Days\":\"3 Mar -  7 Apr\",\"Time\":\"Thursday\",\"Location\":\"3pm - 5pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15521\",\"Size\":\"PR09\",\"Available\":\"40\",\"Dates\":\"Engineering & Mathematics, EM105, CAT Suite\",\"Days\":\"28 Apr -  2 Jun\",\"Time\":\"Thursday\",\"Location\":\"3pm - 5pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15522\",\"Size\":\"PR08\",\"Available\":\"40\",\"Dates\":\"4\",\"Days\":\"2 Mar -  6 Apr\",\"Time\":\"Wednesday\",\"Location\":\"9am - 11am\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15522\",\"Size\":\"PR08\",\"Available\":\"40\",\"Dates\":\"Ingkarni Wardli, B15, CAT Suite\",\"Days\":\"27 Apr -  1 Jun\",\"Time\":\"Wednesday\",\"Location\":\"9am - 11am\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15523\",\"Size\":\"PR07\",\"Available\":\"40\",\"Dates\":\"4\",\"Days\":\"4 Mar -  8 Apr\",\"Time\":\"Friday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15523\",\"Size\":\"PR07\",\"Available\":\"40\",\"Dates\":\"Engineering & Mathematics, EM105, CAT Suite\",\"Days\":\"29 Apr -  3 Jun\",\"Time\":\"Friday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15524\",\"Size\":\"PR06\",\"Available\":\"40\",\"Dates\":\"5\",\"Days\":\"4 Mar -  8 Apr\",\"Time\":\"Friday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15524\",\"Size\":\"PR06\",\"Available\":\"40\",\"Dates\":\"Ingkarni Wardli, B16, CAT Suite\",\"Days\":\"29 Apr -  3 Jun\",\"Time\":\"Friday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15525\",\"Size\":\"PR05\",\"Available\":\"40\",\"Dates\":\"3\",\"Days\":\"4 Mar -  8 Apr\",\"Time\":\"Friday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15525\",\"Size\":\"PR05\",\"Available\":\"40\",\"Dates\":\"Ingkarni Wardli, B15, CAT Suite\",\"Days\":\"29 Apr -  3 Jun\",\"Time\":\"Friday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15526\",\"Size\":\"PR04\",\"Available\":\"40\",\"Dates\":\"2\",\"Days\":\"2 Mar -  6 Apr\",\"Time\":\"Wednesday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15526\",\"Size\":\"PR04\",\"Available\":\"40\",\"Dates\":\"Ingkarni Wardli, B16, CAT Suite\",\"Days\":\"27 Apr -  1 Jun\",\"Time\":\"Wednesday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15528\",\"Size\":\"PR02\",\"Available\":\"40\",\"Dates\":\"1\",\"Days\":\"2 Mar -  6 Apr\",\"Time\":\"Wednesday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15528\",\"Size\":\"PR02\",\"Available\":\"40\",\"Dates\":\"Ingkarni Wardli, B15, CAT Suite\",\"Days\":\"27 Apr -  1 Jun\",\"Time\":\"Wednesday\",\"Location\":\"11am - 1pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15529\",\"Size\":\"PR01\",\"Available\":\"39\",\"Dates\":\"5\",\"Days\":\"3 Mar -  7 Apr\",\"Time\":\"Thursday\",\"Location\":\"9am - 11am\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"15529\",\"Size\":\"PR01\",\"Available\":\"39\",\"Dates\":\"Engineering & Mathematics, EM105, CAT Suite\",\"Days\":\"28 Apr -  2 Jun\",\"Time\":\"Thursday\",\"Location\":\"9am - 11am\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"19524\",\"Size\":\"PR11\",\"Available\":\"35\",\"Dates\":\"FULL\",\"Days\":\"3 Mar -  7 Apr\",\"Time\":\"Thursday\",\"Location\":\"12pm - 2pm\"}",
            "{\"Class Nbr\":\"Note: This class is only available for face-to-face (on-campus) students.\",\"Section\":\"19524\",\"Size\":\"PR11\",\"Available\":\"35\",\"Dates\":\"MyUni, OL, Online Class\",\"Days\":\"28 Apr -  2 Jun\",\"Time\":\"Thursday\",\"Location\":\"12pm - 2pm\"}"
      ]
    }
  };

  AddNewData(data, "username");
}


function RouteTest(anything) {
  return "This Worked YAYAYAYAYA" + anything;
}


//Test();



/*
Need a timestamp from web-scraper in the form of a long int easier to sort
local storage 
session storage


ask ian about sql being on server so it needs routes from the client to be able to access the database

does the password get incripted on the client side before being sent to the server, or does the plain text password get sent to the server and then encripted on ther server side

sql has encription methods doesnt it
*/

function Testing(blah) {
  console.log('testing');
  console.log(blah);
}


module.exports.Testing = Testing;
module.exports.CreateNewUser = CreateNewUser;
module.exports.CheckPassword = CheckPassword