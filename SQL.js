// https://www.npmjs.com/package/sql.js


var Sqljs = require('sql.js');

// needed to work asynchronously???
var SQL = await initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    locateFile: file => `https://sql.js.org/dist/${file}`
  });


// either make a new DB or load one
prevDB = false;
if (prevDB == false) {
  const db = new SQL.Database();
} 
else {
  // prevDBData is an Unit8Array that represents an SQLite DB file
  const db = new SQL.Database(prevDBData);
}


// to add to the database, write the command you want as a string then db.run(string) it


