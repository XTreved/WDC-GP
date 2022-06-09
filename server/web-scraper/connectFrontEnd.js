myJson = require('./courseSelection.json')
console.log(myJson);

name = "COMP SCI 1014UAC";
subjectArea = "COMSCI"
subjectID = "1014UAC"
subjectTitle = ""
subjectAvailability = "Semester 1"



// for (var key in myJson) {
//     if (myJson.hasOwnProperty(key)) {
//         console.log(key)
//         //+ " -> " + p[key]);
//     }
// }

function processName(name) {
    arr = name.split(" ");
    console.log(arr[0]);
    console.log(arr[arr.length - 1]);
}


function getCourseKeys(myJson) {
    let result = [];
    for (var key in myJson) {
        if (myJson.hasOwnProperty(key)) {
            result.push(key)
        }
    }
    return result;
}


console.log(getCourseKeys(myJson));
