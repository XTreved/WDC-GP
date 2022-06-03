// imports
const puppeteer = require("puppeteer");

// global variables
data = {};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1"
  );
  parts = await page.evaluate(() => {
    return document.querySelector("h1").textContent.trim().split("-");
  });
  let Subject_Area = parts[0];
  let Course_Title = parts[1];
  updateJSON("Subject_Area", Subject_Area); // add elements to json object
  updateJSON("Course_Title", Course_Title);

  // extracting CourseDetails from table
  data = await page.evaluate(() => {
    headings_elements = document.querySelectorAll(
      ".lightblue, td.odd, td.even"
    );
    headings_array = Array.from(headings_elements);
    return headings_array.map((heading) => heading.textContent);
  });
  const CourseDetails = data.splice(0, 20);
  for (let i = 0; i < CourseDetails.length - 1; i += 2) {
    updateJSON(CourseDetails[i], CourseDetails[i + 1]);
  }

  // transferJSON(this.data); // export it to another file
  this.scrapeComplete = true;
  // console.log(this.data);
  await browser.close();
})();

function updateJSON(key, value, obj) {
  try {
    // console.log("data" + key + " added to json: " + value);
    obj[key] = value;
  } catch (e) {
    console.log(`value not added to json ${e}`);
  }
  return obj;
}
