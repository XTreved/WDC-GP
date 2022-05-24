// https://www.npmjs.com/package/sql.js


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
                  Password TEXT);"
  // now run the command
  db.run(sqlString);


  // Users_Subjects
  sqlString = "CREATE TABLE Users_Subjects ( \
                  Subject_Area TEXT, \
                  Term TEXT, \
                  Subject_ID INTEGER, \
                  Course_title TEXT, \
                  Timestamp INTEGER, \
                  User_ID INTEGER \
                  Scrape_Timestamps, \
                  PRIMARY KEY (Subject_Area, Term, Subject_ID, Course_title), \
                  FOREIGN KEY (User_ID) \
                    REFERENCES Login_Data (User_ID), \
                      ON UPDATE CASCADE \
                      ON DELETE CASCADE \
                  FOREIGN KEY (Scrape_Timestamps) \
                    REFERENCES Timestamps (Scrape_Timestamps) \
                      ON UPDATE CASCADE \
                      ON DELETE CASCADE);"
  // now run the command
  db.run(sqlString);
} 
else {
  // prevDBData is an Unit8Array that represents an SQLite DB file
  const db = new SQL.Database(prevDBData);
}


// to add to the database, write the command you want as a string then db.run(string) it
/* There example
let sqlstr = "CREATE TABLE hello (a int, b char); \
INSERT INTO hello VALUES (0, 'hello'); \
INSERT INTO hello VALUES (1, 'world');";
db.run(sqlstr);
*/

