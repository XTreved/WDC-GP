const puppeteer = require('puppeteer');
var browser     = null;
var page        = null;


/*
 * Init system
 */

begin();

function init_error(error){
    console.log("Unable to initialise/run tests:\n"+error);
    process.exit();
}

function begin(){
    puppeteer.launch({args:['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-threaded-compositing',
                            '--max_old_space_size=10', '--max-new-space-size=10', '--disable-dev-shm-usage', '--user-data-dir=./chrome/',
                            '--memory-model=low', '--num-raster-threads=1'
                           ]}).then(initPage).catch(init_error);
                           //'--single-process', 
}

function initPage(browser_instance){
    browser = browser_instance;
    return browser.newPage().then(ready).then(finish).catch(init_error);
}

async function ready(page_instance){
    page = page_instance;
    await task1_1();
    // await task2_1();
    // await task2_2();
}






// Task 1.1
async function task1_1(){
    try {
        await page.goto('file://'+process.env.PWD+'/task1.html');
        
        await page.addScriptTag({path: "client_helper.js"});
        
        var res = await page.$eval('body', (selected) => {
            
            var result = {pass:false, errors:''};
            var score = 0;
            
            if (document.querySelector('#current_time') !== null &&
                document.querySelector('#current_time').innerText == 'THIS TEXT HERE'){
                score++;
            } else {
                result.errors = result.errors + "Current time text modified before button pressed\n";
            }
        
        }

    } catch (error) {

    }
}