// node test 
// prints off some scraped data
// use this file to test querySelections

const { findProp } = require("@vue/compiler-core");
const puppeteer = require("puppeteer");

classDetails = {}; // classDetails object
LectureArray = []; // contains lecture objects

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1");
    var ClassDetails = await page.evaluate(() => {
        // headings_elements = document.querySelectorAll(".trheader, .data, .even, .odd");
        headings_elements = document.querySelectorAll(".trheader, .even, .odd");
        headings_array = Array.from(headings_elements);
        return headings_array.map(heading => heading.textContent);
    });
    let lectureIndex = 0;
    let workshopIndex = 0;
    for (let i = 0; i < ClassDetails.length; i++) {
        // trim whitespace in array
        ClassDetails[i] = ClassDetails[i].replace(/^\s+|\s+$/gm, '');
        // match class number
        match = "Class Nbr";
        if (Boolean(ClassDetails[i].match(match))) {
            // console.log("index " + i);
            lectureIndex == 0 ? lectureIndex = i : workshopIndex = i
        }
        // console.log(i + " " + ClassDetails[i]);
    }
    // getting indexes to format array slice
    console.log("ws " + lectureIndex);
    console.log("li " + workshopIndex);

    lectureArray = ClassDetails.slice(lectureIndex, workshopIndex);
    workshopArray = ClassDetails.slice(workshopIndex, ClassDetails.length);
    console.log(lectureArray);
    // console.log(workshopArray);
    processArray(lectureArray);
    await browser.close();
    // try calling exports here or using a boolean flag to mark async function end
})();

// dummy = [
//     'Class Nbr\nSection\nSize\nAvailable\nDates\nDays\nTime\nLocation',
//     '11571',
//     'LE01',
//     '520',
//     '57',
//     '1 Mar -  5 Apr',
//     'Tuesday',
//     '2pm - 4pm',
//     'MyUni, OL, Online Class',
//     '26 Apr -  31 May',
//     'Tuesday',
//     '2pm - 4pm',
//     'MyUni, OL, Online Class',
//     'Note: This lecture is live-streamed and recorded.  You have the option of participating during the live-streaming session, or viewing any time after publication in MyUni.  Please check MyUni for details once enrolled.'
// ];
// processArray(dummy);

function processArray(array) { // calls required functions and formats data to lectureobj
    var newArray = [];
    for (lines of array) {
        temp = lines.split('\n');
        newArray = newArray.concat(temp);
    }
    for (let i = 0; i < newArray.length; i++) {
        console.log(i + " " + newArray[i]);
    }
    formatLectureArray(newArray);
}

function formatLectureArray(arr) {
    let updated = false;
    try {
        var init = {};
        init = UpdateLectureObj('Class Nbr', arr[8], init);
        init = UpdateLectureObj('Section', arr[9], init);
        init = UpdateLectureObj('Size', arr[10], init);
        init = UpdateLectureObj('Available', arr[11], init);
        for (let i = 12; i < arr.length - 4; i += 4) { // caution could access outside of range
            //updated = true;
            obj = init;
            obj = UpdateLectureObj('Dates', arr[i], obj);
            obj = UpdateLectureObj('Days', arr[i + 1], obj);
            obj = UpdateLectureObj('Time', arr[i + 2], obj);
            obj = UpdateLectureObj('Location', arr[i + 3], obj);
            // console.log(obj);
            // console.log("mark " + i + " " + arr[i+4]);
            this.LectureArray.push(obj);
        }
        console.log("finished updating LectureArray")
        console.log(this.LectureArray);
    } catch (err) {
        console.log(err);
    }
    // could export lecture array here after it has been processed 
}

function UpdateLectureObj(key, value, LectureObj) { // index corresponds to repeat classes
    try {
        LectureObj[key] = value;
    }
    catch (e) {
        console.log(`value not added to json ${e}`);
    }
    return LectureObj;
}

// exports
// module.exports = LectureArray;

/*

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