// const { findProp } = require("@vue/compiler-core");
const puppeteer = require("puppeteer");
// const linkController = require("linkController");

// var link = "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1"; // wdc
var link = 'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=107592+1+4210+1' // adds

const promiseA = (async () => { // handles workshops, lectures, practicals
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  var ClassDetails = await page.evaluate(() => {
    headings_elements = document.querySelectorAll(".trheader, .even, .odd");
    headings_array = Array.from(headings_elements);
    return headings_array.map((heading) => heading.textContent);
  });

  let lectureIndex = 0; // getting indexes to format array slice
  let workshopIndex = 0;

  for (let i = 0; i < ClassDetails.length; i++) {
    ClassDetails[i] = ClassDetails[i].replace(/^\s+|\s+$/gm, ""); // trim whitespace in array
    match = "Class Nbr"; // match class number
    if (Boolean(ClassDetails[i].match(match))) {
      lectureIndex == 0 ? (lectureIndex = i) : (workshopIndex = i);
    }
  }
  console.log(lectureIndex,workshopIndexm)
  
  let data = {};
  lectureArray = ClassDetails.slice(lectureIndex, workshopIndex);
  lectureArray = processArray(lectureArray);
  data = UpdateObj("Lecture", lectureArray, data);

  workshopArray = ClassDetails.slice(workshopIndex, ClassDetails.length);
  workshopArray = processArray(workshopArray);
  data = UpdateObj("Workshop", workshopArray, data);


  console.log(lectureArray)
  console.log(workshopArray)

  await browser.close();
  return data;
})();

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
  let len = array.length;
  let newArray = [];
  for (lines of array) {
    temp = lines.split("\n");
    newArray = newArray.concat(temp);
  }
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
        let obj = init; // console.log(`range ${i} to ${i + 4}`)
        obj = UpdateObj("Dates", arr[i], obj);
        obj = UpdateObj("Days", arr[i + 1], obj);
        obj = UpdateObj("Time", arr[i + 2], obj);
        obj = UpdateObj("Location", arr[i + 3], obj);
        // console.log(obj);
        classData.push(JSON.stringify(obj));
      }
    }
    return classData;
  } catch (err) {
    console.log(err);
    return [];
  }
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
      let obj = init;
      obj = UpdateObj("Dates", arr[i], obj);
      obj = UpdateObj("Days", arr[i + 1], obj);
      obj = UpdateObj("Time", arr[i + 2], obj);
      obj = UpdateObj("Location", arr[i + 3], obj);
      classData.push(JSON.stringify(obj));
    }
    return classData;
  } catch (err) {
    console.log(err);
    return [];
  }
}

function UpdateObj(key, value, LectureObj) {
  try {
    LectureObj[key] = value;
  } catch (e) {
    console.log(`value not added to json ${e}`);
  }
  return LectureObj;
}

module.exports.promiseA = promiseA;
module.exports.promiseB = promiseB;

