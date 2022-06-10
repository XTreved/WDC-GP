// sqlite3 docs
// https://github.com/TryGhost/node-sqlite3/wiki/API
// https://www.npmjs.com/package/sqlite3

// npm install sqlite3

const hashes = require('jshashes');
var currentUser = "";

// import sqlite3 and load the database, or else it will create one it it doesnt exist
const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('savedDatabase', (err) => {
  if (err) 
  {
    console.log("Error occured: " + err.message);
  }
  else
  {
    console.log("Database connected");
  }
});


// create or load in the tables
db.serialize(() => {
    let sqlString = "";
    
    // if it is new then i will also need to add all of the tables for the first time
    
    // Login_Data (needed first as it is referenced)
    sqlString = "CREATE TABLE if not exists Login_Data ( \
                    Username TEXT PRIMARY KEY UNIQUE, \
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
                    Username TEXT, \
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


function Hash(password) {

  // make the instance
  var sha256 = new hashes.SHA256;

  // salt the password
  var salt = sha256.hex(32); // random number for the salt
  var hashedP = sha256.hex(password + salt);

return hashedP;
}


// this will take in a users names and id and create a spot in out database to save there data, 
// login like username and password should be delt with using some form of secure login 
async function CreateNewUser(username, password) {

  return new Promise((resolve, reject) => {
    var sqlPrepare = "INSERT INTO Login_Data (Username, Password) VALUES (?, ?);";

    // check that the username isnt already in the database
    uniqueUsername = true;

    sqlString = "SELECT Username \
                    FROM Login_Data;";
    db.all(sqlString, async (err, rows) => {
      if(err){
        console.log(err);
      }
      for (row of rows) {
        if (row.Username == username) {
          uniqueUsername = false;
          console.log("Unique Username: " + uniqueUsername + " Create User Aborted");
          return resolve(false);
        }
      }
      console.log("Unique Username: " + uniqueUsername);
      // hash the password here
      var hashedPassword = Hash(password);

      db.run(sqlPrepare, [username, hashedPassword]);
      return resolve(true);
    });

  });


  // will returns void
};

function CheckPassword(username, password) {

    return new Promise((resolve, reject) => {
      var hashedPassword = Hash(password);

      sqlString = "SELECT Password \
                      FROM Login_Data \
                      WHERE Username = ?;";
        db.get(sqlString, [username] , async (err, rows) => {
        if(err){
          console.log(err);
          resolve(false);
        }

        if (rows == null) {
          console.log("resolving False");
          return resolve(false);
        }
        
        if (Object.keys(rows).length > 1){
            reject("Multiple Users found");
        }
  
        
        if (rows.Password == hashedPassword) {
          // console.log(rows.Password)
          // console.log(hashedPassword);
          currentUser = username;
          return resolve(true);
        }
        return resolve(false);
        
    });
    /*
    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
      console.log(row.id + ": " + row.info);
    });
    */

    });
};

// may need to do something with user login here so i know which user probably just ID will do as it is unique
// here i will get all if the data from the current timestamp and put it into a form that can be accessed buy our front end to be used
function GetAllData(timestamp, subject, term, course) {
  sqlString = "SELECT Scrape_Timestamps, \
                  FROM Users_Subjects, \
                  WHERE Users_Subjects.Subject_Area = ?, \
                  AND Users_Subjects.Term = ?, \
                  AND Users_Subjects.Course_Title = ?;"
  var result = db.all(sqlString, [subject, term, course], (err, rows) => {
    if(err){
      console.log(err);
    }
    for (row of rows) {
      if (row.Password == hashedPassword) {
        console.log(row.Password)
        console.log(hashedPassword);
        correctPass = true;
      }
    }
    console.log(correctPass);
    return correctPass;
  });
}

// this will get all of the timestamps for this specific subject so that the user can choose which one to use to do other things with
function GetTimestamps(subject, term, course) {
  var timestampsArr = [];
  sqlString = "SELECT Scrape_Timestamps, \
                  FROM Users_Subjects, \
                  WHERE Users_Subjects.Subject_Area = ?, \
                  AND Users_Subjects.Term = ?, \
                  AND Users_Subjects.Course_Title = ?;"
  var result = db.all(sqlString, [subject, term, course], (err, rows) => {
    if(err){
      console.log(err);
    }
    for (row of rows) {
      timestampsArr.push(row.Timestamp);
    }
    return timestampsArr;
  });
}

// this wil get all of the subjects the the user has previously scraped, this is to be able to show them on out front end
function GetUsersSubjects(username) {
  var subjectsArr = [];
  sqlString = "SELECT Subject_Area, Term, Course_Title, \
                  FROM Users_Subjects, \
                  WHERE Users_Subjects.Username = ?;";
  var result = db.all(sqlString, [username], (err, rows) => {
    if(err){
      console.log(err);
    }
    for (row of rows) {
      var obj = {};
      obj['Subject_Area'] = row.Subject_Area;
      obj['Term'] = row.Term;
      obj['Course_Title'] = row.Course_Title;

      subjectsArr.push(obj)
    }
    return subjectsArr;
  });
}

// this will take json which will come from the webscraper and ill unpack it here and add the new data to out database of the recent scrape
function AddNewData(scrapeData) {

  username = currentUser;
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


  // get tbe keys as the types, eg, Lecturem prac, workshop
  classTypes = scrapeData['class_details'].keys();
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
                          WHERE Class_Times.Beginning_Date = ? \
                          AND Class_Times.Ending_Date = ? \
                          AND Class_Times.Day = ? \
                          AND Class_Times.Beginning_Time = ? \
                          AND Class_Times.Ending_Time = ? \
                          AND Class_Times.Location = ?;";
          
          var ID;
          var result = db.all(sqlString, [startDate, endDate, day, startTime, endTime, location], (err, rows) => {
            if(err){
              console.log(err);
            }
            for (row of rows) {
              ID = row.ID;
            }
          });
    
          // Class_Data
          var sqlPrepare = "INSERT INTO Class_Data (Class_Number, Section, Size, Available, Notes, ID) VALUES (?, ?, ?, ?, ?, ?);";
          db.run(sqlPrepare, [classNum, section, size, available, notes, ID]);
        });
      }
    }
  }
  // will return void
}


// this returns a list of objects, each object has all of the data for a single class time
// the objects are in the form of:
/*
{
  classTimesObj["Beginning_Date"]
  classTimesObj["Ending_Date"]
  classTimesObj["Day"]
  classTimesObj["Beginning_Time"]
  classTimesObj["Ending_Time"]
  classTimesObj["Location"]
  classTimesObj["Class_Type"]
  classTimesObj["Class_Number"]
  classTimesObj["Section"]
  classTimesObj["Size"]
  classTimesObj["Available"]
  classTimesObj["Notes"]
}
*/
function GetClassTimes(Username, Subject, Course, Term, Timestamp) {
  return new Promise((resolve, reject) => {
    var hashedPassword = Hash(password);

    sqlString = "SELECT Class_Times.Beginning_Date, Class_Times.Ending_Date, Class_Times.Day, Class_Times.Beginning_Time, \
                    Class_Times.Ending_Time, Class_Times.Location, Scrape_Timestamps.Class_Type, Class_Details.Class_Number, \
                    Class_Data.Section, Class_Data.Size, Class_Data.Available, Class_Data.Notes, \
                    FROM Class_Time, \
                    INNER JOIN Class_Times.ID = Class_Data.ID, \
                    INNER JOIN Class_Data.Class_Number = Class_Details.Class_Number, \
                    INNER JOIN Class_Details.Class_Type = Scrape_Timestamps.Class_Type, \
                    INNER JOIN Users_Subjects.Timestamp = Scrape_Timestamps.Scrape_Timestamps, \
                    WHERE Users_Subjects.Username = ?, \
                    AND Users_Subjects.Subject_Area = ?, \
                    AND Users_Subjects.Course_Title = ?, \
                    AND Users_Subjects.Term = ?, \
                    AND Users_Subjects.Timestamp = ?;";


      db.get(sqlString, [Username, Subject, Course, Term, Timestamp] , async (err, rows) => {
      if(err){
        console.log(err);
        resolve(false);
      }

      if (rows == null) {
        console.log("resolving False");
        return resolve(false);
      }
      
      var listOfTimes = []
      // go through each of the rows and get all of the data and put it into an object to be returned
      // not all data will be needed by its is all here anyway
      for (row of rows) {
        var classTimesObj = {};
        classTimesObj["Beginning_Date"] = row.Beginning_Date;
        classTimesObj["Ending_Date"] = row.Ending_Date;
        classTimesObj["Day"] = row.Day;
        classTimesObj["Beginning_Time"] = row.Beginning_Time;
        classTimesObj["Ending_Time"] = row.Ending_Time;
        classTimesObj["Location"] = row.Location;
        classTimesObj["Class_Type"] = row.Class_Type;
        classTimesObj["Class_Number"] = row.Class_Number;
        classTimesObj["Section"] = row.Section;
        classTimesObj["Size"] = row.Size;
        classTimesObj["Available"] = row.Available;
        classTimesObj["Notes"] = row.Notes;

        // add the object to the list of times
        listOfTimes.push(classTimesObj);
      }

      // now that all of the data is in the list i can return the list
      return resolve(listOfTimes);
      
    });
  });

}


function Test() {
  console.log("Starting Test");

  var data = {
    "Time": "2022-06-09T06:00:37.762Z",
    "course_details": {
        "Subject_Area": "COMP SCI 2207 ",
        "Course_Title": " Web & Database Computing",
        "Career": "Undergraduate",
        "Units": "3",
        "Term": "Semester 1",
        "Campus": "North Terrace"
    },
    "class_details": {
        "Lecture": [
            "{\"Class Nbr\":\"11571\",\"Section\":\"LE01\",\"Size\":\"520\",\"Available\":\"57\",\"Dates\":\"1 Mar -  5 Apr\",\"Days\":\"Tuesday\",\"Time\":\"2pm - 4pm\",\"Location\":\"MyUni, OL, Online Class\"}",
            "{\"Class Nbr\":\"11571\",\"Section\":\"LE01\",\"Size\":\"520\",\"Available\":\"57\",\"Dates\":\"26 Apr -  31 May\",\"Days\":\"Tuesday\",\"Time\":\"2pm - 4pm\",\"Location\":\"MyUni, OL, Online Class\"}"
        ],
        "Workshop": [
            "{\"Class Nbr\":\"11564\",\"Section\":\"WR07\",\"Size\":\"80\",\"Available\":\"FULL\",\"Dates\":\"9 Mar -  6 Apr\",\"Days\":\"Wednesday\",\"Time\":\"1pm - 2pm\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11564\",\"Section\":\"WR07\",\"Size\":\"80\",\"Available\":\"FULL\",\"Dates\":\"27 Apr -  8 Jun\",\"Days\":\"Wednesday\",\"Time\":\"1pm - 2pm\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11566\",\"Section\":\"WR05\",\"Size\":\"80\",\"Available\":\"4\",\"Dates\":\"10 Mar -  7 Apr\",\"Days\":\"Thursday\",\"Time\":\"10am - 11am\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11566\",\"Section\":\"WR05\",\"Size\":\"80\",\"Available\":\"4\",\"Dates\":\"28 Apr -  9 Jun\",\"Days\":\"Thursday\",\"Time\":\"10am - 11am\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11567\",\"Section\":\"WR04\",\"Size\":\"80\",\"Available\":\"4\",\"Dates\":\"11 Mar -  8 Apr\",\"Days\":\"Friday\",\"Time\":\"2pm - 3pm\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11567\",\"Section\":\"WR04\",\"Size\":\"80\",\"Available\":\"4\",\"Dates\":\"29 Apr -  10 Jun\",\"Days\":\"Friday\",\"Time\":\"2pm - 3pm\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11568\",\"Section\":\"WR03\",\"Size\":\"80\",\"Available\":\"63\",\"Dates\":\"10 Mar -  7 Apr\",\"Days\":\"Thursday\",\"Time\":\"9am - 10am\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11568\",\"Section\":\"WR03\",\"Size\":\"80\",\"Available\":\"63\",\"Dates\":\"28 Apr -  9 Jun\",\"Days\":\"Thursday\",\"Time\":\"9am - 10am\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11569\",\"Section\":\"WR02\",\"Size\":\"80\",\"Available\":\"5\",\"Dates\":\"9 Mar -  6 Apr\",\"Days\":\"Wednesday\",\"Time\":\"12pm - 1pm\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11569\",\"Section\":\"WR02\",\"Size\":\"80\",\"Available\":\"5\",\"Dates\":\"27 Apr -  8 Jun\",\"Days\":\"Wednesday\",\"Time\":\"12pm - 1pm\",\"Location\":\"Ingkarni Wardli, 218, Teaching Room\"}",
            "{\"Class Nbr\":\"11570\",\"Section\":\"WR01\",\"Size\":\"80\",\"Available\":\"59\",\"Dates\":\"11 Mar -  8 Apr\",\"Days\":\"Friday\",\"Time\":\"12pm - 1pm\",\"Location\":\"Ingkarni Wardli, B18, Teaching Room\"}",
            "{\"Class Nbr\":\"11570\",\"Section\":\"WR01\",\"Size\":\"80\",\"Available\":\"59\",\"Dates\":\"29 Apr -  10 Jun\",\"Days\":\"Friday\",\"Time\":\"12pm - 1pm\",\"Location\":\"Ingkarni Wardli, B18, Teaching Room\"}",
            "{\"Class Nbr\":\"19529\",\"Section\":\"WR08\",\"Size\":\"80\",\"Available\":\"5\",\"Dates\":\"10 Mar -  7 Apr\",\"Days\":\"Thursday\",\"Time\":\"3pm - 4pm\",\"Location\":\"MyUni, OL, Online Class\"}",
            "{\"Class Nbr\":\"19529\",\"Section\":\"WR08\",\"Size\":\"80\",\"Available\":\"5\",\"Dates\":\"28 Apr -  9 Jun\",\"Days\":\"Thursday\",\"Time\":\"3pm - 4pm\",\"Location\":\"MyUni, OL, Online Class\"}"
        ]
    }
  };

  AddNewData(data, "username");
}

module.exports = { CreateNewUser, CheckPassword, GetClassTimes, AddNewData };
