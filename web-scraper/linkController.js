/*
    this file uses puppeteer to choose the link to the given SUBJECT and then choose the given COURSE
    Example: https://github.com/puppeteer/puppeteer/issues/3535
*/

// inclusions
const { ConsoleMessage } = require("puppeteer");
const puppeteer = require("puppeteer");


(async () => {
    const browser = await puppeteer.launch({
        headless: true, // we can see the changes live if headless = true
        slowMo: 250, // slow down by 250ms
        defaultViewport: {
            width: 1100,
            height: 600
        }
    });
    const page = await browser.newPage();
    let url = "https://access.adelaide.edu.au/courses/search.asp";
    console.log(`Fetching page data for : ${url}...`);
    await page.goto(url);

    // works on website console but not here?
    //document.querySelector("#subject") 

    // Array.from(document.querySelectorAll(selector) ==  page.$$('#subject');
    courses = await page.evaluate(() => {
        let array = document.querySelector("#subject");
        headings_array = Array.from(array);
        return headings_array;
    });
    
    console.log(courses);
    await browser.close();
})();

function getLink(course, subject) {
    let default_link = "https://access.adelaide.edu.au/courses/search.asp";

}

var subject = "COMP SCI";
var course = ""
getLink(subject);

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



/*
subject link samples
https://access.adelaide.edu.au/courses/search.asp?year=2022&m=r&title=&subject=COMP+SCI&catalogue=&action=Search&term=&career=&campus=&class=&sort=https://access.adelaide
    COMP SCI 2207 - Web & Database Computing
    https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1
    
*/