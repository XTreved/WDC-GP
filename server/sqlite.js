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
const db = new sqlite3.Database('SavedDatabase');

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
                    Username INTEGER PRIMARY KEY, \
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
                    Subject_ID INTEGER, \
                    Course_Title TEXT, \
                    Timestamp INTEGER, \
                    Username INTEGER, \
                    Scrape_Timestamps INTEGER, \
                    PRIMARY KEY (Subject_Area, Term, Subject_ID, Course_title), \
                    FOREIGN KEY (User_ID) \
                        REFERENCES Login_Data (User_ID) \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE, \
                    FOREIGN KEY (Scrape_Timestamps) \
                        REFERENCES Timestamps (Scrape_Timestamps) \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE);";
    // now run the command
    db.run(sqlString);
});
console.log("Created/Loaded all Tables");
db.close();



// this will take in a users names and id and create a spot in out database to save there data, 
// login like username and password should be delt with using some form of secure login 
function CreateNewUser(username, password) {
  
  // will returns void
}


// NOT NEEDED
// this may not be needed but is here to be able to grab a users ID to use to search their specific classes
function GetUserID(username) {
  sqlString = "SELECT Username, \
                  FROM Login_Data, \
                  WHERE Given_Name = " + givenName + ", \
                  AND Family_Name = " + familyName + ", \
                  ;";
  var returnVal = db.run(sqlString);
  console.log(returnVal);
  // will return users ID (int)
  return returnVal;
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
function AddNewData(scrapeData) {

  // will return void
}


function Test() {
  console.log("Test blah blah\n");
}

  // to add to the database, write the command you want as a string then db.run(string) it
/* There example
let sqlstr = "CREATE TABLE hello (a int, b char); \
INSERT INTO hello VALUES (0, 'hello'); \
INSERT INTO hello VALUES (1, 'world');";
db.run(sqlstr);
*/