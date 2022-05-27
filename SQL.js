// https://www.sqlitetutorial.net/sqlite-foreign-key/


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





var Sqljs = require('sql.js');

// needed to work asynchronously???
var SQL = await initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    locateFile: file => `https://sql.js.org/dist/${file}`
  });


// do a check to see if i can load the prevDB file. if i cant then it doesnt exist and it is the first time so i should create it
/* there code
const xhr = new XMLHttpRequest();
// For example: https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
xhr.open('GET', '/path/to/database.sqlite', true);
xhr.responseType = 'arraybuffer';

xhr.onload = e => {
  const uInt8Array = new Uint8Array(xhr.response);
  const db = new SQL.Database(uInt8Array);
  const contents = db.exec("SELECT * FROM my_table");
  // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
};
xhr.send();
*/
prevDB = false;


// either make a new DB or load one
if (prevDB == false) {
  const db = new SQL.Database();

  let sqlString = "";

  // if it is new then i will also need to add all of the tables for the first time

  // Login_Data (needed first as it is referenced)
  sqlString = "CREATE TABLE Login_Data ( \
                  User_ID INTEGER PRIMARY KEY, \
                  Given_Name TEXT, \
                  Family_Name TEXT, \
                  Username TEXT, \
                  Password TEXT);";
  // now run the command
  db.run(sqlString);
  console.log("Created Loging_Data table\n");


  // Class_Times
  sqlString = "CREATE TABLE Class_Times ( \
                  ID INTEGER PRIMARY KEY, \
                  Beginning_Date INTEGER, \
                  Ending_Date INTEGER, \
                  Day TEXT, \
                  Beginning_Time INTEGER, \
                  Ending_Time INTEGER, \
                  Location TEXT);";
  db.run(sqlString);
  console.log("Created Class_Times table\n");


  // Class_Data
  sqlString = "CREATE TABLE Class_Data ( \
                  Class_Number INTEGER PRIMARY KEY, \
                  Section TEXT, \
                  Size INTEGER, \
                  Available INTEGER, \
                  Notes TEXT, \
                  FOREIGN KEY (ID) \
                    REFERENCES Class_Times (ID), \
                      ON UPDATE CASCADE \
                      ON DELETE CASCADE);";
  db.run(sqlString);
  console.log("Created Class_Data table\n");


  // Class_Details
  sqlString = "CREATE TABLE Class_Details ( \
                  Class_Type TEXT PRIMARY KEY, \
                  FOREIGN KEY (Class_Number) \
                      REFERENCES Class_Data (Class_Number), \
                        ON UPDATE CASCADE \
                        ON DELETE CASCADE);";
  db.run(sqlString);
  console.log("Created Class_Details table\n");


  // Scrape_Tiestamps
  sqlString = "CREATE TABLE Scrape_Timestamps ( \
                  Scrape_Timestamps PRIMARY KEY, \
                  FOREIGN KEY (Class_Type) \
                    REFERENCES Class_Details (Class-Type) \
                      ON UPDATE CASCADE \
                      ON DELETE CASCADE);";
  db.run(sqlString);
  console.log("Created Scrape_Timestamps table\n");


  // may need commas after the end of the foreign keys
  // Users_Subjects
  sqlString = "CREATE TABLE Users_Subjects ( \
                  Subject_Area TEXT, \
                  Term TEXT, \
                  Subject_ID INTEGER, \
                  Course_Title TEXT, \
                  Timestamp INTEGER, \
                  User_ID INTEGER, \
                  PRIMARY KEY (Subject_Area, Term, Subject_ID, Course_title), \
                  FOREIGN KEY (User_ID) \
                    REFERENCES Login_Data (User_ID), \
                      ON UPDATE CASCADE \
                      ON DELETE CASCADE, \
                  FOREIGN KEY (Scrape_Timestamps) \
                    REFERENCES Timestamps (Scrape_Timestamps) \
                      ON UPDATE CASCADE \
                      ON DELETE CASCADE);";
  // now run the command
  db.run(sqlString);
  console.log("Created Users_Subjects table\n");

  
} 
else {
  // prevDBData is an Unit8Array that represents an SQLite DB file
  const db = new SQL.Database(prevDBData);
}


// this will take in a users names and id and create a spot in out database to save there data, 
// login like username and password should be delt with using some form of secure login 
function CreateNewUser(givenName, familyName, ID) {

  // will returns void
}


// this may not be needed but is here to be able to grab a users ID to use to search their specific classes
function GetUserID(givenName, familyName) {

  // will return users ID (int)
}


// may need to do something with user login here so i know which user probably just ID will do as it is unique
// here i will get all if the data from the current timestamp and put it into a form that can be accessed buy our front end to be used
function GetAllData(timestamp, subject, term, subjectID, course) {
  
  // will return json with all the data
}


// this will get all of the timestamps for this specific subject so that the user can choose which one to use to do other things with
function GetTimestamps(subject, term, subjectID, course) {
  
  // will return a list of the timestamps saved, (in the form of int's)
}


// this will take json which will come from the webscraper and ill unpack it here and add the new data to out database of the recent scrape
function AddNewData(scrapeData) {

  // will return void
}








// to add to the database, write the command you want as a string then db.run(string) it
/* There example
let sqlstr = "CREATE TABLE hello (a int, b char); \
INSERT INTO hello VALUES (0, 'hello'); \
INSERT INTO hello VALUES (1, 'world');";
db.run(sqlstr);
*/

