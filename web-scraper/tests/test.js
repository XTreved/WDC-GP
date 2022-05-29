// node test 
// prints off some scraped data
// use this file to test querySelections

const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1");

    headings = await page.evaluate(() => {
        headings_elements = document.querySelectorAll(".lightblue, td.odd, td.even");
        headings_array = Array.from(headings_elements);
        return headings_array.map(heading => heading.textContent).splice(0,20);
    });
    console.log(headings);
    await browser.close();
})();


// document.querySelectorAll(".lightblue, td.odd, td.even")  
//  document.querySelectorAll("div > #hidedata01_1 .lightblue, td.odd, td.even")  
// document.querySelectorAll(".lightblue")  