// myJson = require("./courseSelection.json");
LinkData = require("./linkController.js");

module.exports.subjectTitles = LinkData.promiseA
  .then((value) => getsubjectTitle(value))
  .then(console.log("subject titles exported")).then(value => {return value});

//.then((value) => (module.exports.subjectTitles = value))
// .then((value) => console.log(value));
//   .then(courseData.promiseB.then((value) => formatJSON_0(value)))
//   .then((value) => transferJSON(value));

function getsubjectTitle(myJson) {
  arr = [];
  for (n in myJson) {
    // console.log(name);
    for (sem in myJson[n]) {
      arr.push(myJson[n][sem]["subjectTitle"]);
    }
  }
  res = new Set(arr);
  // console.log(res);
  return res;
}

function getJsonLink(JsonObj) {}

function processName(name) {
  arr = name.split(" ");
  console.log(arr[0]);
  console.log(arr[arr.length - 1]);
}

function getCourseKeys(myJson) {
  let result = [];
  for (var key in myJson) {
    if (myJson.hasOwnProperty(key)) {
      result.push(key);
    }
  }
  return result;
}

/*
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
subjectTitle = "";
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
