myJson = require("./courseSelection.json");
// LinkData = require("./linkController.js");


/*
NOTE: this callback sequence connecting promiseA to the web-scraping functions may take some time and is not functional as an immediate transfer of data
We should instead either save this data temporarily (I've made a helper function to do this) or update this data to our server so we do not have to scrape data again
*/

/*
// value exported is myJson (alternative to saving it)
module.exports.subjectTitles = LinkData.promiseA
  .then((value) => getSubjectTitle(value))
  .then(console.log("subject titles exported")).then(value => { return value });
*/



/*
== RUNNING FUNCTIONS ==
*/

res = mapSubjectTitleToID(myJson)

obj = getObjMap(res);

courseCodes = getcouseCodesFromName('Web and Database Computing', obj); // gets course codes

courseCode = courseCodes[0]; // get a selection 

link = getLink(courseCode, "Semester 1", myJson);

console.log(link);

function getcouseCodesFromName(name, jsonObj) {
  if (obj.hasOwnProperty(name))
    return jsonObj[name];
  return "Error: name not found"
}

function getLink(course, semester, JSONobj) {
  let semesters = new Set(['Semester 1', 'Semester 2', 'Trimester 1', 'Trimester 2', 'Term 4', 'Online Teaching Period 5']);
  try {
    if (!JSONobj.hasOwnProperty(course)) {
      console.log(course, " is not found");
      return "";
    }
    else if (!semesters.has(semester)) {
      console.log(semesters, "is not an option");
      return "";
    }

    if(JSONobj[course].hasOwnProperty(semester))
      return JSONobj[course][semester].link;
    
    console.log(`${course} -> ${semester} does not exist`)
    return "";
  }

  catch(err) {
    console.log(err);
    return "";
  }
}

function mapSubjectTitleToID(jsonObj) {
  arr = [];
  for (n in jsonObj) {
    for (sem in jsonObj[n]) {
      let row = [n, jsonObj[n][sem]["subjectTitle"]]
      arr.push(row);
    }
  }
  return arr;
}

function getObjMap(arr) {
  jsonObj = {}

  for (row of arr) {
    jsonObj[row[1]] = [];
  }

  for (row of arr) {
    jsonObj[row[1]].push(row[0]);
  }

  return jsonObj
}

function getUniqueObj(arr) {
  var uniques = [];
  var itemsFound = {};
  for (var i = 0, l = arr.length; i < l; i++) {
    var stringified = JSON.stringify(arr[i]);
    if (itemsFound[stringified]) { continue; }
    uniques.push(arr[i]);
    itemsFound[stringified] = true;
  }

  jsonObj = {} // format unique to json
  for (let i = 0; i < uniques.length; i++) {
    jsonObj[uniques[i][1]] = uniques[i][0]
  }
  return jsonObj;
}

function processName(name) { // breaks course ID into name and course code
  arr = name.split(" ");
  console.log(arr[0]);
  console.log(arr[arr.length - 1]);
}

function getUniqueSubjectTitles(jsonObj) {
  arr = [];
  for (n in jsonObj) {
    for (sem in jsonObj[n]) {
      arr.push(jsonObj[n][sem]["subjectTitle"]);
    }
  }
  res = new Set(arr); // console.log(res);
  return Array.from(res);
}

function getUniqueCourseIDs(jsonObj) {
  let arr = [];
  for (var key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
      arr.push(key);
    }
  }
  res = new Set(arr); // console.log(res);
  return Array.from(res);
}

/*
== MOCK DATA ==

mock = {
    "Semester 1": {
      semester: "Semester 1",
      link: "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=001956+2+4210+1",
      subjectTitle: "Computer Systems",
      units: "3",
      career: "Undergraduate",
      location: "North Terrace",
    },
    "Semester 2": {
      semester: "Semester 2",
      link: "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=001956+2+4220+1",
      subjectTitle: "Computer Systems",
      units: "3",
      career: "Undergraduate",
      location: "North Terrace",
    },
  };
  
name = "COMP SCI 1014UAC";
subjectArea = "COMSCI";
subjectID = "1014UAC";
subjectTitle = "simple name";
subjectAvailability = "Semester 1";

FrontEndObj1 = {
  subjectArea: "COMSCI",
  subjectID: "1014UAC",
  subjectTitle: "Information Technology Project",
  subjectAvailability: "Semester 1",
};
FrontEndObj2 = {
  subjectArea: "COMSCI",
  subjectID: ["1014UAC", "1014M", "2203"],
  subjectTitle: ["Information Technology Project", "name2"],
};

*/

/*
// CALLBACK NIGHTMARE
.then((value) => (module.exports.subjectTitles = value))
.then((value) => console.log(value));
.then(courseData.promiseB.then((value) => formatJSON_0(value)))
.then((value) => transferJSON(value));

// subjectTitles = getSubjectTitle(myJson)
// courseIDs = getCourseIDs(myJson)
// console.log(courseIDs.length, subjectTitles.length)
// mapSubjectTitleToID(subjectTitles, courseIDs)
// console.log(res.length, res[res.length - 1][0], res[res.length - 1][1]);
// console.log(res.length, res);

== GARBAGE FUNCTIONS ==
function mapSubjectTitleToID(subjectTitle, courseID) {
  let arr = []
  for (let i = 0; i < subjectTitle.length; i++) {
    let row = [subjectTitle[i], courseID[i]]
    // sconsole.log(row);
    arr.push(row);
  }
  console.log(arr)
}
*/
