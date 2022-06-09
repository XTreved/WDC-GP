const puppeteer = require("puppeteer");

/*

const { findProp } = require("@vue/compiler-core");
const linkController = require("linkController");
 ==== TEMPORARY LINKS ====
var link = 'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=107592+1+4210+1' // adds
var link = 'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108277+1+4210+1' // analogue electronics
*/

var link = "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1"; // wdc

const promiseA = (async () => { // handles workshops, lectures, practicals
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  var ClassDetails = await page.evaluate(() => {
    headings = document.querySelectorAll('div#hidedata04_1 > table tr');

    classes = [];
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].querySelector('th.course') !== null) {
        let value = headings[i].querySelector('th.course').innerText;
        if (value == 'Class Nbr') continue;
        try {
          value = value.split(': ')[1]; // match what is after :
          value = value.split(' ').join(""); // also split any spaces
        } catch (err) {
          console.log(err);
        }
        classes.push([value, i]);
      }
    }
    return classes;
  }); // console.log(ClassDetails);

  var ClassData = await page.evaluate((ClassDetails) => {
    headings = document.querySelectorAll('div#hidedata04_1 > table tr');
    let data = {};
    let high = 0;
    for (let i = 0; i < ClassDetails.length - 1; i++) {
      let low = ClassDetails[i][1];
      high = ClassDetails[i + 1][1];
      let temp = [];
      for (let j = low; j < high; j++) {
        temp.push(headings[j].textContent);
      }
      data[ClassDetails[i][0]] = temp;
    }

    try {
      let temp = [];
      for (let i = high; i < headings.length; i++) {
        temp.push(headings[i].textContent);
      }
      data[ClassDetails[ClassDetails.length - 1][0]] = temp;
    } catch (e) { }
    return data;
  }, ClassDetails); // console.log(ClassData);

  // console.log(processObject(ClassData));
  return processObject(ClassData)

  await browser.close();
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
  const CourseDetails = scrapedData.splice(0, 10); // get the first 10 data entries
  for (let i = 0; i < CourseDetails.length - 1; i += 2) {
    title = CourseDetails[i].replace(':', '');
    data = UpdateObj(title, CourseDetails[i + 1], data);
    if (title == 'Campus') break; // stop updating after campus label
  }
  await browser.close();
  return data;
})();

function processObject(data) {
  let res = {};
  for (var key of Object.keys(data)) {
    data[key] = processArray(data[key]);
    len = data[key].length;
    // console.log(len, data[key])
    if (len <= 14) {
      res[key] = formatArray_14(data[key]);
    }
    else if (len <= 21) { // should check for edge cases for two or three day a week classes 
      res[key] = formatArray_21(data[key]);
    }
    // === ERROR : program can't differentiate whether course has two or three courses a week ===
    else { // format big array on whether class has 2 sessions a week or 3 sessions a week (this might not be fool proof)
      res[key] = FormatBigArrayTwoDay(data[key]); // assume 2 sessions per week (for now);
      // res[key] = (len % 2 == 0) ? FormatBigArrayTwoDay(data[key]) : formatBigArrayThreeDay(data[key]);
    }
  }
  return res;
};

function processArray(array) {
  let len = array.length;
  let newArray = [];
  for (lines of array) {
    temp = lines.replace(/^\s+|\s+$/gm, "").split("\n"); // trim whitespace in array;
    newArray = newArray.concat(temp);
  }
  return newArray;
}

function formatArray_14(arr) {
  var classData = []; // contains lecture objects
  try {
    let init = {};
    init = UpdateObj("Class Nbr", arr[9], init);
    init = UpdateObj("Section", arr[10], init);
    init = UpdateObj("Size", arr[11], init);
    init = UpdateObj("Available", arr[12], init);
    return init;
  } catch (err) {
    console.log(err);
    return [];
  }
}

function formatArray_21(arr) {
  var classData = []; // contains lecture objects
  try {
    let init = {};
    init = UpdateObj("Class Nbr", arr[9], init);
    init = UpdateObj("Section", arr[10], init);
    init = UpdateObj("Size", arr[11], init);
    init = UpdateObj("Available", arr[12], init);

    for (let i = 13; i < arr.length - 4; i += 4) {
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

function FormatBigArrayTwoDay(arr) { // occurrs two days a week
  console.log(arr[0] + " has two sessions a week");
  var classData = []; // contains lecture objects
  try {
      for (let c = 9; c < arr.length - 13; c += 13) {
          let init = {};
          init = UpdateObj("Class Nbr", arr[c], init);
          init = UpdateObj("Section", arr[c + 1], init);
          init = UpdateObj("Size", arr[c + 2], init);
          init = UpdateObj("Available", arr[c + 3], init);

          for (let i = c + 4; i < c + 13 - 4; i += 4) {
              let obj = init; // console.log(`range ${i} to ${i + 4}`)
              obj = UpdateObj("Dates", arr[i], obj);
              obj = UpdateObj("Days", arr[i + 1], obj);
              obj = UpdateObj("Time", arr[i + 2], obj);
              obj = UpdateObj("Location", arr[i + 3], obj);
              classData.push(JSON.stringify(obj));
          }
      }
      console.log(classData);
      return classData;
  } catch (err) {
      console.log(err);
      return [];
  }
}

function formatBigArrayThreeDay(arr) { // occurrs three days a week
  console.log(arr[0] + " has three sessions a week");
  try {
    let classData = [];
    for (let c = 9; c < arr.length - 16; c += 17) {
      let init = {};
      init = UpdateObj("Class Nbr", arr[c], init);
      init = UpdateObj("Section", arr[c + 1], init);
      init = UpdateObj("Size", arr[c + 2], init);
      init = UpdateObj("Available", arr[c + 3], init);

      for (let i = c + 4; i < c + 13 - 4; i += 4) { //  console.log(`range ${i} to ${i + 4}`)
        let obj = init;
        obj = UpdateObj("Dates", arr[i], obj);
        obj = UpdateObj("Days", arr[i + 1], obj);
        obj = UpdateObj("Time", arr[i + 2], obj);
        obj = UpdateObj("Location", arr[i + 3], obj);
        classData.push(JSON.stringify(obj));
      }
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

