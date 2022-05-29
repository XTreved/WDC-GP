/*
Exports data to data.json
refrence: https://oxylabs.io/blog/puppeteer-tutorial
const JSONdata = require('./data.js');
console.log(JSONdata.data);
*/

// imports
const puppeteer = require("puppeteer");
const fs = require('fs'); // used to write contents to json file

// global variables
scrapeComplete = false; 
data = {};

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1");

	parts = await page.evaluate(() => {
		return document.querySelector("h1").textContent.trim().split("-");
	});
	let Subject_Area = parts[0];
	let Course_Title = parts[1];
	updateJSON("Subject_Area", Subject_Area); // add elements to json object
	updateJSON("Course_Title", Course_Title);

	// extracting CourseDetails from table
	CourseDetails = await page.evaluate(() => {
		headings_elements = document.querySelectorAll(".lightblue, td.odd, td.even");
		headings_array = Array.from(headings_elements);
		return headings_array.map(heading => heading.textContent).splice(0, 20);
	});
	for (let i = 0; i < CourseDetails.length - 1; i += 2) {
		updateJSON(CourseDetails[i], CourseDetails[i + 1]);
	}
	transferJSON(this.data); // export it to another file
	this.scrapeComplete = true;
	// console.log(this.data);
	await browser.close();
})();

function updateJSON(key, value) {
	try {
		console.log("data" + key + " added to json: " + value);
		this.data[key] = value;
	}
	catch (e) {
		console.log(`value not added to json ${e}`);
	}
}

function transferJSON(jsonObject) {
	
	try {
		let jsonString = JSON.stringify(data, null, 4); // third parameter = spaces for formatting
		fs.writeFileSync('data.json', jsonString);
		console.log(jsonString);
		console.log("JSON data is saved.");
	} catch (error) {
		console.error(err);
	}
}


async function startBrowser() { // starts browser and returns an instance of it
	let browser;
	try {
		console.log("Opening chrome browser via non-headless chrome");
		console.log("browser pop-up is for testing");
		browser = await puppeteer.launch({ // launch browser instance
			headless: false, // runs with an interface so we can watch script
			// change headless: true after testing complete
			args: ["--disable-setuid-sandbox"],
			'ignoreHTTPSErrors': true
		});
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}


