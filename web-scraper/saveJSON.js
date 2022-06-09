// imports
const fs = require("fs"); // used to write contents to json file
const courseData = require("./scrapeData.js");
const { AddNewData } = require('../sqlite.js');

data = {Time: getTime()}; // global data to be exported

courseData.promiseA // await asyncronous calls
  .then((value) => formatJSON(value))
  .then(courseData.promiseB.then((value) => formatJSON_0(value)))
  .then((value) => transferJSON(value));

function getTime() {
  return new Date()
}

function formatJSON_0(arg) {
  data["course_details"] = arg;
}

function formatJSON(arg) {
  data["class_details"] = arg;
}

/*
==== NOTE ====
reading and writing data to JSON file is not favourable as it can burn the disk if done in bulk, instead export json object to frontend interface without saving every time
*/

function geTime() {
  let today = new Date();
  date = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log(date);
}

function transferJSON(jsonObject) {
  try {
    AddNewData(jsonObject);
    
    let jsonString = JSON.stringify(data, null, 4); // third parameter = spaces for formatting
    fs.writeFileSync("data.json", jsonString);
    console.log("JSON data is saved to data.json"); // console.log(jsonString);
  } catch (error) {
    console.error(err);
  }
}
