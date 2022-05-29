// node test 
// prints off some scraped data
// use this file to test querySelections

const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1");

    data = await page.evaluate(() => {
		// headings_elements = document.querySelectorAll(".lightblue, td.odd, td.even");
        headings_elements = document.querySelectorAll(".even, .odd");
		headings_array = Array.from(headings_elements);
		return headings_array.map(heading => heading.textContent);
	});
    // data = data.slice(20);
    console.log(data);


    data = await page.evaluate(() => {
        document.querySelectorAll("p tr > .odd")[0].innerText
	});

    await browser.close();
})();

/*





 // scraping units
	units = await page.evaluate(() => {
        document.querySelectorAll("p tr > .odd")[0].innerText
	});
	updateJSON('Units',units);
document.querySelectorAll(".lightblue, td.odd, td.even")  
 document.querySelectorAll("div > #hidedata01_1 .lightblue, td.odd, td.even")  
document.querySelectorAll(".lightblue")  
*/