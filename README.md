<h1>To run the website</h1>

1. Go into the server directory `cd WDC-GP/server`
2. Install the node modules     `npm install`
3. Start the website            `npm start`
4. Type the following in your webpage url <a>http://localhost:3000</a>

<h1>Brief Summary of our sql server</h1>

All of the sql functions can be found in the sqlite.js file in the server directory. When the server starts, it will load the sqlite.js file and create a database file called "savedDatabase" if one doesn't exist already. Furthermore it will also create all of the tables if they dont already exist.

<h2>Functions</h2>

<h3>Hash(password)</h3>
This is used to hash a password for login/signup

<br>

<h3>CreateNewUser(username, password)</h3>
This function will create a new user and add there username and hashed password to the database, run this just by calling the function with a username or password, or through the signup page on the front end

<br>

<h3>CheckPassword(username, password)</h3>
This function is used for the login page, it'll take the username and password and after hashing the password will compare the passwords and either return true or false to allow the user to login to the website
call this through the login page on the front end

<br>

<h3>GetTimestamps(subject, term, course)</h3>
this will go through the database and return a list of timestamps for the specified course

<br>

<h3>GetUsersSubjects(username)</h3>
this is used to get the subjects that a user has previously scraped to be able to show this on out front end, this returns a list of subjects

<br>


<h3>AddNewData(scrapeData)</h3>
this is the main function that will add all of the data that has been scraped into the database,
this is called through the saveJSON.js file in the webscraper through the TransferJSON function

<br>

<h3>GetClassTimes(Username, Subject, Course, Term, Timestamp)</h3>
this is used to get all of the data for each class time corresponding to the paramaters given to be able to give to the teams api so that it can add the classes into teams.

<br>

<h3>Test()</h3> 
This function at the bottom of the file has test input data from a scrape that can be used to test any of the functions

<br>

note: since sqlite is used its database is automatically stored into a file, therefore the data in the database will persist between server restarts. 

<h1>Interface with Teams</h1>
The Teams interface uses the Microsoft Graph API accessed through Microsoft Azure Active Directory. A multitenant application registration was made for this to work in testing.

<br>

Users must define paramters relevant to the Azure AD setup to run the server. An application registration must be made in an Azure AD tenancy with User.Read, TeamSettings.ReadWrite.All and Schedule.ReadWrite.All permissions allowed. Access and ID tokens must also be activated during the registration process for the server's automatic management to function.

The server's management of tokens is based on a Microsoft library with custom implementation where applicable to suit.

<br>
Our server manages OAuth, refresh, access and permission tokens (API endpoint dependent) to allow interactions with Teams Shifts on behalf of the user.

<h1>How to run the scraper</h1>

linkcontroller.js will get the details about the course, eg the semester it is running, the subject title, location etc..

scrapeData.js will get the course lecture and workshop time

<br>

To test either scrapeData.js or linkController.js from the server directory type `node web-scraper/scrapeData.js` or `node web-scraper/linkController.js`

<h1>Extras</h1>

<h2>How access the sqlite3 database</h2>

From the server directory type `sqlite3 ./savedDatabase` in the commands line this will start the sqlite server.

Refer to, <a>https://www.sitepoint.com/getting-started-sqlite3-basic-commands/</a> for additional details.