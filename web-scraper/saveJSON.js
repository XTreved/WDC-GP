// imports
const fs = require("fs"); // used to write contents to json file
const courseData = require("./scrapeData.js");

data = {}; // global data to be exported

// await asyncronous calls
courseData.promiseA
  .then((value) => formatJSON(value))
  .then(courseData.promiseB.then((value) => formatJSON_0(value)))
  .then((value) => transferJSON(value));

function formatJSON_0(arg) {
  data["course_details"] = arg;
}

function formatJSON(arg) {
  data["class_details"] = arg;
}

function transferJSON(jsonObject) {
  try {
    let jsonString = JSON.stringify(data, null, 4); // third parameter = spaces for formatting
    fs.writeFileSync("data.json", jsonString);
    console.log(jsonString);
    console.log("JSON data is saved to data.json");
  } catch (error) {
    console.error(err);
  }
}
