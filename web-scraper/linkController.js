// inclusions
// const { ConsoleMessage } = require("puppeteer");
const puppeteer = require("puppeteer");
var formValue = "COMP SCI";
var subjectValue = "";
var sublink = "https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1"; // i am in proces of automating this 



(async () => {
    const browser = await puppeteer.launch({
        headless: false, // we can see the changes live if headless = true
        slowMo: 250, // slow down by 250ms
        defaultViewport: {
            width: 1100,
            height: 600
        }
    });
    const page = await browser.newPage();
    await page.goto('https://access.adelaide.edu.au/courses/search.asp?year=2022.org', { waitUntil: 'networkidle2' });
    await page.waitForSelector('select[name=subject]');
    await page.select('select[name=subject]', formValue);
    await page.click('input[name=action]');
    // next page go to subject

    await page.goto('https://access.adelaide.edu.au/courses/search.asp?year=2022&m=r&title=&subject=COMP+SCI&catalogue=&action=Search&term=&career=&campus=&class=&sort=', { waitUntil: 'networkidle2' });
    // scraping clases to match up with scraped links, we can then navigate to the according page based on the class which aligns with the link
    /*
    const classes = await page.evaluate(() => {
        const subjectArray = document.querySelectorAll('tbody > .odd, .even');
        let array = [];
        for (let i = 0; i < subjectArray.length; i++) {
            array.push(subjectArray[i].innerText);
        }
        return array;
    });
    // console.log(classes);

    // scraping all the links to subpages to then be directed to 
    const links = await page.evaluate(() => {
        const linkArray = document.querySelectorAll('tbody > tr > td .odd a, td .even a');
        let array = [];
        for (let i = 0; i < linkArray.length; i++) {
            array.push(linkArray[i].href);
        }
        return array;
    }); 
    */
    // console.log(links);
    // LinkArr = ProcessLinks(links);
    // lookup = formatArray(classes, LinkArr);

    await page.goto(sublink);
    const url = await page.url();
    console.log("current page url is: " + url);
    await browser.close();
})();


// supporting functions to synthesize data
// formats array in form [semester, subject, name];
function formatArray(arr, links) {
    // formatting is not calibrated for some annoying reason
    let link = 0;
    let formatted = [];
    for (let i = 0; i < arr.length - 7; i += 7) {
        let row = [arr[i], arr[i + 1], arr[i + 2], links[link]];
        console.log("adding: " + arr[i + 1] + " " + links[link]);
        link += 1;
        formatted.push(row);
    }
    return formatted;
}
// remove every second link
function ProcessLinks(array) {
    let i = array.length;
    let n = 2; // The "nth" element to remove
    while (i--) (i + 1) % n === 0 && (array.splice(i, 1));
    return array;
}

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://en.wikipedia.org', { waitUntil: 'networkidle2' });

//     await page.waitForSelector('input[name=search]');

//     // await page.type('input[name=search]', 'Adenosine triphosphate');
//     await page.$eval('input[name=search]', el => el.value = 'Adenosine triphosphate');

//     await page.click('input[type="submit"]');
//     await page.waitForSelector('#mw-content-text');
//     const text = await page.evaluate(() => {
//         const anchor = document.querySelector('#mw-content-text');
//         return anchor.textContent;
//     });
//     console.log(text);
//     await browser.close();
// })();

// (async () => {
//     const browser = await puppeteer.launch({
//         headless: true, // we can see the changes live if headless = true
//         slowMo: 250, // slow down by 250ms
//         defaultViewport: {
//             width: 1100,
//             height: 600
//         }
//     });
//     const page = await browser.newPage();
//     let url = "https://access.adelaide.edu.au/courses/search.asp";
//     console.log(`Fetching page data for : ${url}...`);
//     await page.goto(url);

//     // Array.from(document.querySelectorAll(selector) ==  page.$$('#subject');
//     courses = await page.evaluate(() => {
//         let array = document.querySelector("#subject");
//         headings_array = Array.from(array);
//         return headings_array;
//     });

//     console.log(courses);
//     await browser.close();
// })();


/*
    Main page:
    https://access.adelaide.edu.au/courses/search.asp?year=2022

    Subject Selection
    https://access.adelaide.edu.au/courses/search.asp?year=2022&m=r&title=&subject=COMP+SCI&catalogue=&action=Search&term=&career=&campus=&class=&sort=https://access.adelaide
    
    COMP SCI 2207 - Web & Database Computing
    https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1
    
*/