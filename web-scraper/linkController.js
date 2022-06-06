const puppeteer = require("puppeteer");
const fs = require("fs"); // used to write contents to json file
// const { ConsoleMessage } = require("puppeteer");

masterLink = 'https://access.adelaide.edu.au/courses/search.asp?year=2022.org'; // master link may be subject to change

courseChoices = [ // this data was an can be scraped if new courses are added to university
    'ABORIG', 'ACCTFIN', 'ACCTING', 'ACUCARE', 'AGRIBUS', 'AGRIC',
    'AGRONOMY', 'AN BEHAV', 'ANAT SC', 'ANIML SC', 'ANTH', 'APP BIOL',
    'APP DATA', 'APP MTH', 'ARCH', 'ARTH', 'ARTS', 'ARTSEXP',
    'ASIA', 'AUST', 'BIOCHEM', 'BIOINF', 'BIOLOGY', 'BIOMED',
    'BIOMET', 'BIOSTATS', 'BIOTECH', 'BUSANA', 'C&ENVENG', 'CEME',
    'CHEM', 'CHEM ENG', 'CHIN', 'CLAS', 'COMMERCE', 'COMMGMT',
    'COMMLAW', 'COMP SCI', 'CONMGNT', 'CORPFIN', 'CRARTS', 'CRIM',
    'CRWR', 'CULTST', 'CYBER', 'DATA', 'DENT', 'DESST',
    'DEVT', 'ECON', 'ECOTOUR', 'EDUC', 'ELEC ENG', 'ENG',
    'ENGL', 'ENTREP', 'ENV BIOL', 'EXCHANGE', 'FILM', 'FOOD SC',
    'FREN', 'GEN PRAC', 'GEND', 'GENETICS', 'GEOG', 'GEOLOGY',
    'GERM', 'GSSA', 'HEALTH', 'HIST', 'HLTH SC', 'HONECMS',
    'HORTICUL', 'INDO', 'INTBUS', 'ITAL', 'JAPN', 'LARCH',
    'LAW', 'LING', 'MANAGEMT', 'MARKETNG', 'MATHS', 'MDIA',
    'MECH ENG', 'MEDIC ST', 'MEDICINE', 'MGRE', 'MICRO', 'MINING',
    'MUSCLASS', 'MUSCOMP', 'MUSEP', 'MUSEUM', 'MUSGEN', 'MUSHONS',
    'MUSICOL', 'MUSJAZZ', 'MUSONIC', 'MUSPERF', 'MUSPOP', 'MUSSUPST',
    'MUSTHEAT', 'NURSING', 'OB&GYNAE', 'OCCTH', 'ODONT', 'OENOLOGY',
    'OPHTHAL', 'ORALHLTH', 'ORT&TRAU', 'PAEDIAT', 'PALAEO', 'PATHOL',
    'PEACE', 'PETROENG', 'PETROGEO', 'PHARM', 'PHIL',  'PHYSICS',
    'PHYSIOL', 'PHYSIOTH', 'PLANNING', 'PLANT SC', 'POLICY', 'POLIS',
    'PROF', 'PROJMGNT', 'PROP', 'PSYCHIAT', 'PSYCHOL', 'PUB HLTH',
    'PURE MTH', 'RUR HLTH', 'SCIENCE', 'SOCI', 'SOIL&WAT', 'SPAN',
    'SPATIAL', 'SPEECH', 'STATS', 'SURGERY', 'TECH', 'TESOL',
    'TRADE', 'UAC', 'UACOL', 'VET SC', 'VET TECH', 'VITICULT',
    'WINE'
]

var formValue = courseChoices[37]; // front end uses this data to pass select course to this file
console.log(`navigating to the course: ${formValue}`);

const promiseA = (async () => {
    const browser = await puppeteer.launch({
        headless: true,
        // slowMo: 250, 
        defaultViewport: {
            width: 1100,
            height: 600
        }
    });
    const page = await browser.newPage();

    await page.goto(masterLink, { waitUntil: 'networkidle2' }); // master link 
    await page.waitForSelector('select[name=subject]');
    await page.select('select[name=subject]', formValue);
    await page.click('input[name=action]');

    const sublink = await page.url();
    console.log("current page url is: " + sublink); // await page.goto(sublink, { waitUntil: 'networkidle2' }); 
    await page.goto(sublink, { waitUntil: 'networkidle2' });

    /*
    ==== MANUAL LINK SELECTION ====
    let sublink = 'https://access.adelaide.edu.au/courses/search.asp?year=2022&m=r&title=&subject=COMP+SCI&catalogue=&action=Search&term=&career=&campus=&class=&sort=';
    await page.goto(sublink, { waitUntil: 'networkidle2' }); 
    */

    const classes = await page.evaluate(() => {
        const subjectArray = document.querySelectorAll('div.content > p > table tr');
        let res = [];
        for (let i = 1; i < subjectArray.length; i++) {
            let row = (subjectArray[i]).querySelectorAll('td');
            let rowArr = [];
            for (col of row) {
                rowArr.push(col.innerText);
            }
            res.push(rowArr);
        }
        return res;
    });

    const links = await page.evaluate(() => {
        const linkArray = document.querySelectorAll('div.content > p > table tr');
        let res = []
        for (let i = 1; i < linkArray.length; i++) {
            res.push(linkArray[i].querySelector('a').href);
        }
        return res;
    });

    obj = partitionData(classes, links)
    transferJSON(obj);
    await browser.close();
})();

function partitionData(classarr, linkarr) {
    let jsonData = {};
    let linkIndex = 0;
    for (row of classarr) {
        let courseName = row[1];
        let semester = row[0];
        jsonData[courseName] = {};
        jsonData[courseName][semester] = {
            link: linkarr[linkIndex],
            courseName: row[2],
            units: row[2],
            career: row[3],
            campus: row[4],
        }
        linkIndex++;
    }
    return jsonData;
}

// WARNING constantly reading and writing to json file may burn disk, export data directly to needed file
function transferJSON(jsonObject) {
    try {
        let jsonString = JSON.stringify(jsonObject, null, 4); // third parameter = spaces for formatting
        console.log(jsonString);
        fs.writeFileSync("courseSelection.json", jsonString);
        console.log("JSON data is saved to courseSelection.json"); // console.log(jsonString);
    } catch (err) {
        console.error(err);
    }
}

// module.exports.promiseA = promiseA;

/*

  ==== APPENDIX ==== 
  - scraping course choices

  const courseChoices = await page.evaluate(() => {
      const selection = document.querySelectorAll('table tbody > tr select#subject > option');
      res = [];
      for (let i = 1; i < selection.length; i++) {
          res.push(selection[i].value);
      }
      return res;
  });
  console.dir(courseChoices, {'maxArrayLength': null});

  */