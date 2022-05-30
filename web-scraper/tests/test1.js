var course = "COMP SCI 2207 - Web & Database Computing";
var parts = course.split("-");
console.log(parts[0],parts[1]);
var data = {};


function updateJSON(key, value) {
	console.log("data" + key + " added to json: " + value);
	
}

// updateJSON("hello world",1);
// updateJSON("Subject_Area", "he")
// console.log(data);

var string = `Class Nbr
Section
Size
Available
Dates
Days
Time
Location`;

console.log("is it a match?")
match = "Class Nbr";
console.log(Boolean(string.match(match)))