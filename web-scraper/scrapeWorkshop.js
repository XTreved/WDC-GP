
// could either do this as a seperate file or combine with scrapeLecture
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