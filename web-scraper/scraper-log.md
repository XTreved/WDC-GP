
## todo
- [ ] copy page dropdown into html front end to get form values
- [ ] use pupeeteer form.submit('value') to navigate to page
- [ ] withing that page navigate to the selected course (find a way to navigate to selected link)

- html url path scrape courseCode -> window.location.href // pull query string out of page
given <option value="my-value"> 
we can navigate into a form using
await page.select('#itemname', 'my-value');

## meeting notes 30/5/22
    form submit() method that
    document.querySelector('#subject').value = 'matching value of form'
    use await to processs asyncronous functions one by one
    declare await on the fucntions one by one  
    use .then() function to call other functions after this

## scraper implementation
- could use .data to query the table data and then format data from this point onwards