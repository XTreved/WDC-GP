const fs = require('fs');

let rawdata = fs.readFileSync('courseSelection.json');
let object = JSON.parse(rawdata); 

console.log(object["COMP SCI 1010"])

