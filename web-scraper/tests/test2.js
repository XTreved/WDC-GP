// a second test file for 

var course = "COMP SCI 2207 - Web & Database Computing";
var parts = course.split("-");
console.log(parts[0],parts[1]);
data = {};


function updateJSON(key, value) {
	console.log("data" + key + " added to json: " + value);
	this.data.key = value;
}

updateJSON("hello world",1);
updateJSON("Subject_Area", "he")
console.log(data);


var jsonObj = {
    members: 
           {
            host: "hostName",
            viewers: 
            {
                user1: "value1",
                user2: "value2",
                user3: "value3"
            }
        }
}

var i;

for(i=4; i<=8; i++){
    var newUser = "user" + i;
    var newValue = "value" + i;
    // jsonObj.members.viewers[newUser] = newValue ;
	jsonObj[newUser] = newValue;

}

console.log(jsonObj);