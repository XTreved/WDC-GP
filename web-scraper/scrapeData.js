// const { findProp } = require("@vue/compiler-core");
const puppeteer = require("puppeteer");
var link =
  "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1";
// const linkController = require("linkController");

const promiseA = (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  var ClassDetails = await page.evaluate(() => {
    // headings_elements = document.querySelectorAll(".trheader, .data, .even, .odd");
    headings_elements = document.querySelectorAll(".trheader, .even, .odd");
    headings_array = Array.from(headings_elements);
    return headings_array.map((heading) => heading.textContent);
  });
  let lectureIndex = 0;
  let workshopIndex = 0;
  for (let i = 0; i < ClassDetails.length; i++) {
    // trim whitespace in array
    ClassDetails[i] = ClassDetails[i].replace(/^\s+|\s+$/gm, "");
    // match class number
    match = "Class Nbr";
    if (Boolean(ClassDetails[i].match(match))) {
      // console.log("index " + i);
      lectureIndex == 0 ? (lectureIndex = i) : (workshopIndex = i);
    }
    // console.log(i + " " + ClassDetails[i]);
  }
  // getting indexes to format array slice
  // console.log("ws " + lectureIndex);
  // console.log("li " + workshopIndex);
  let data = {};
  lectureArray = ClassDetails.slice(lectureIndex, workshopIndex);
  lectureArray = processArray(lectureArray);
  data = UpdateObj("Lecture", lectureArray, data);

  workshopArray = ClassDetails.slice(workshopIndex, ClassDetails.length);
  workshopArray = processArray(workshopArray);
  data = UpdateObj("Workshop", workshopArray, data);

  //   console.log(data); // updated data object
  await browser.close();
  return data;
  // try calling exports here or using a boolean flag to mark async function end
})();

// could integrate it into above function
const promiseB = (async () => {
  let data = {};
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  parts = await page.evaluate(() => {
    return document.querySelector("h1").textContent.trim().split("-");
  });
  let Subject_Area = parts[0];
  let Course_Title = parts[1];

  data = UpdateObj("Subject_Area", Subject_Area, data); // add elements to json object
  data = UpdateObj("Course_Title", Course_Title, data);

  // extracting CourseDetails from table
  let scrapedData = await page.evaluate(() => {
    headings_elements = document.querySelectorAll(
      ".lightblue, td.odd, td.even"
    );
    headings_array = Array.from(headings_elements);
    return headings_array.map((heading) => heading.textContent);
  });
  const CourseDetails = scrapedData.splice(0, 20);
  for (let i = 0; i < CourseDetails.length - 1; i += 2) {
    data = UpdateObj(CourseDetails[i], CourseDetails[i + 1], data);
  }
  await browser.close();
  return data;
})();

function processArray(array) {
  // calls required functions and formats data to lectureobj
  let len = array.length;
  let newArray = [];
  for (lines of array) {
    temp = lines.split("\n");
    newArray = newArray.concat(temp);
  }
  //   for (let i = 0; i < newArray.length; i++) {
  //     console.log(i + " " + newArray[i]);
  //   }
  if (len <= 20) return formatArray(newArray);

  return formatBigArray(newArray);
}

function formatBigArray(arr) {
  var classData = []; // contains lecture objects
  try {
    for (let j = 8; j < arr.length - 13; j += 13) {
      let init = {};
      init = UpdateObj("Class Nbr", arr[j], init);
      init = UpdateObj("Section", arr[j + 1], init);
      init = UpdateObj("Size", arr[j + 2], init);
      init = UpdateObj("Available", arr[j + 3], init);

      for (let i = j + 4; i < j + 13 - 4; i += 4) {
        // caution could access outside of range
        // console.log(`Dates: ${arr[i]}  at index: ${i}`);
        // console.log(`range ${i} to ${i + 4}`)
        let obj = init;
        obj = UpdateObj("Dates", arr[i], obj);
        obj = UpdateObj("Days", arr[i + 1], obj);
        obj = UpdateObj("Time", arr[i + 2], obj);
        obj = UpdateObj("Location", arr[i + 3], obj);
        // console.log(obj);
        classData.push(JSON.stringify(obj));
      }
    }
    //   console.log("Finished updating Array:");
    //   console.log(classData);
    return classData;
  } catch (err) {
    console.log(err);
    return [];
  }
  // could export lecture array here after it has been processed
}

function formatArray(arr) {
  var classData = []; // contains lecture objects
  try {
    let init = {};
    init = UpdateObj("Class Nbr", arr[8], init);
    init = UpdateObj("Section", arr[9], init);
    init = UpdateObj("Size", arr[10], init);
    init = UpdateObj("Available", arr[11], init);

    for (let i = 12; i < arr.length - 4; i += 4) {
      // caution could access outside of range
      // console.log(`Dates: ${arr[i]}  at index: ${i}`);
      let obj = init;
      obj = UpdateObj("Dates", arr[i], obj);
      obj = UpdateObj("Days", arr[i + 1], obj);
      obj = UpdateObj("Time", arr[i + 2], obj);
      obj = UpdateObj("Location", arr[i + 3], obj);
      classData.push(JSON.stringify(obj));
    }
    // console.log("Finished updating Array:");
    // console.log(classData);
    return classData;
  } catch (err) {
    console.log(err);
    return [];
  }
  // could export lecture array here after it has been processed
}

function formatArray(arr) {
  var classData = []; // contains lecture objects
  let updated = false;
  try {
    let init = {};
    init = UpdateObj("Class Nbr", arr[8], init);
    init = UpdateObj("Section", arr[9], init);
    init = UpdateObj("Size", arr[10], init);
    init = UpdateObj("Available", arr[11], init);

    for (let i = 12; i < arr.length - 4; i += 4) {
      // caution could access outside of range
      // console.log(`Dates: ${arr[i]}  at index: ${i}`);
      let obj = init;
      obj = UpdateObj("Dates", arr[i], obj);
      obj = UpdateObj("Days", arr[i + 1], obj);
      obj = UpdateObj("Time", arr[i + 2], obj);
      obj = UpdateObj("Location", arr[i + 3], obj);
      classData.push(JSON.stringify(obj));
    }
    // console.log("Finished updating Array:");
    // console.log(classData);
    return classData;
  } catch (err) {
    console.log(err);
    return [];
  }
  // could export lecture array here after it has been processed
}

function UpdateObj(key, value, LectureObj) {
  // index corresponds to repeat classes
  try {
    LectureObj[key] = value;
  } catch (e) {
    console.log(`value not added to json ${e}`);
  }
  return LectureObj;
}

// exporting promise which is asycn function call
module.exports.promiseA = promiseA;
module.exports.promiseB = promiseB;

// exports
// module.exports = LectureArray;

/*
Supporting code:
dummy = [
    'Class Nbr\nSection\nSize\nAvailable\nDates\nDays\nTime\nLocation',
    '11571',
    'LE01',
    '520',
    '57',
    '1 Mar -  5 Apr',
    'Tuesday',
    '2pm - 4pm',
    'MyUni, OL, Online Class',
    '26 Apr -  31 May',
    'Tuesday',
    '2pm - 4pm',
    'MyUni, OL, Online Class',
    'Note: This lecture is live-streamed and recorded.  You have the option of participating during the live-streaming session, or viewing any time after publication in MyUni.  Please check MyUni for details once enrolled.'
];
processArray(dummy);

tempArray = [
    'Class Nbr\nSection\nSize\nAvailable\nDates\nDays\nTime\nLocation',
    '11571\nLE01\n520\n57\n1 Mar -  5 Apr\nTuesday\n2pm - 4pm\nMyUni, OL, Online Class',
    '11571',
    'LE01',
    '520',
    '57',
    '1 Mar -  5 Apr',
    'Tuesday',
    '2pm - 4pm',
    'MyUni, OL, Online Class',
    'Note: This lecture is live-streamed and recorded.  You have the option of participating during the live-streaming session, or viewing any time after publication in MyUni.  Please check MyUni for details once enrolled.'
  ]
document.querySelectorAll("#hidedata04_1 > tbody > .trheader, .data, .odd");
document.querySelectorAll("tbody > tr")
document.querySelectorAll(".trheader, .data, .odd")

*/

// dummyWorkshopArray = [
//   "Class Nbr\nSection\nSize\nAvailable\nDates\nDays\nTime\nLocation",
//   "11564",
//   "WR07",
//   "80",
//   "FULL",
//   "9 Mar -  6 Apr",
//   "Wednesday",
//   "1pm - 2pm",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "27 Apr -  8 Jun",
//   "Wednesday",
//   "1pm - 2pm",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "Note: This class is only available for face-to-face (on-campus) students.",
//   "11566",
//   "WR05",
//   "80",
//   "4",
//   "10 Mar -  7 Apr",
//   "Thursday",
//   "10am - 11am",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "28 Apr -  9 Jun",
//   "Thursday",
//   "10am - 11am",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "Note: This class is only available for face-to-face (on-campus) students.",
//   "11567",
//   "WR04",
//   "80",
//   "4",
//   "11 Mar -  8 Apr",
//   "Friday",
//   "2pm - 3pm",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "29 Apr -  10 Jun",
//   "Friday",
//   "2pm - 3pm",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "Note: This class is only available for face-to-face (on-campus) students.",
//   "11568",
//   "WR03",
//   "80",
//   "63",
//   "10 Mar -  7 Apr",
//   "Thursday",
//   "9am - 10am",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "28 Apr -  9 Jun",
//   "Thursday",
//   "9am - 10am",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "Note: This class is only available for face-to-face (on-campus) students.",
//   "11569",
//   "WR02",
//   "80",
//   "5",
//   "9 Mar -  6 Apr",
//   "Wednesday",
//   "12pm - 1pm",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "27 Apr -  8 Jun",
//   "Wednesday",
//   "12pm - 1pm",
//   "Ingkarni Wardli, 218, Teaching Room",
//   "Note: This class is only available for face-to-face (on-campus) students.",
//   "11570",
//   "WR01",
//   "80",
//   "59",
//   "11 Mar -  8 Apr",
//   "Friday",
//   "12pm - 1pm",
//   "Ingkarni Wardli, B18, Teaching Room",
//   "29 Apr -  10 Jun",
//   "Friday",
//   "12pm - 1pm",
//   "Ingkarni Wardli, B18, Teaching Room",
//   "Note: This class is only available for face-to-face (on-campus) students.",
//   "19529",
//   "WR08",
//   "80",
//   "5",
//   "10 Mar -  7 Apr",
//   "Thursday",
//   "3pm - 4pm",
//   "MyUni, OL, Online Class",
//   "28 Apr -  9 Jun",
//   "Thursday",
//   "3pm - 4pm",
//   "MyUni, OL, Online Class",
//   "Note: This class is for offshore/interstate students only.  Please refer to MyUni for details once enrolled.",
//   "20399",
//   "WR09",
//   "80",
//   "37",
//   "9 Mar -  6 Apr",
//   "Wednesday",
//   "5pm - 6pm",
//   "MyUni, OL, Online Class",
//   "Note: This class is for offshore/interstate students only.  Please refer to MyUni for details once enrolled.",
// ];
// processArray(dummyWorkshopArray);
