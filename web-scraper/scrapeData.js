const puppeteer = require("puppeteer");

/*
// const { findProp } = require("@vue/compiler-core");
const linkController = require("linkController");
 ==== TEMPORARY LINKS ====
var link = "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1"; // wdc
var link = 'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108277+1+4210+1' // analogue electronics
*/

var link = 'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=107592+1+4210+1' // adds

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
    for (let i = 0; i < ClassDetails.length - 1; i++) {
      let low = ClassDetails[i][1];
      let high = ClassDetails[i + 1][1];
      let temp = [];
      for (let j = low; j < high; j++) {
        temp.push(headings[j].textContent);
      }
      data[ClassDetails[i][0]] = temp;
    }
    return data;
  }, ClassDetails); // console.log(ClassData);

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
  const CourseDetails = scrapedData.splice(0, 20);
  for (let i = 0; i < CourseDetails.length - 1; i += 2) {
    data = UpdateObj(CourseDetails[i], CourseDetails[i + 1], data);
  }
  await browser.close();
  return data;
})();

function processObject(data) {
    let res = {};
    for (var key of Object.keys(data)) {
        data[key] = processArray(data[key]);
        len = data[key].length;
        
        if(len <= 20) {
            res[key] = formatArray(data[key]);
        }
        else {
            res[key] = formatBigArray(data[key]);
        }
    }
    return res;
};

function processArray(array) {
    let len = array.length;
    let newArray = [];
    for (lines of array) {
        temp = lines.replace(/^\s+|\s+$/gm, "").split("\n"); // trim whitespace in array;
        // temp = lines
        newArray = newArray.concat(temp);
    }
    return newArray;
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
          classData.push(JSON.stringify(obj));
        }
      } // console.log(classData);
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

