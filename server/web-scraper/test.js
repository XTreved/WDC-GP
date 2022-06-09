Twoclasses =  [
    'Related Class: Workshop',
    'Class Nbr',
    'Section',
    'Size',
    'Available',
    'Dates',
    'Days',
    'Time',
    'Location',
    '19782',
    'WR03',
    '30',
    '21',
    '28 Feb -  4 Apr',
    'Monday',
    '3pm - 5pm',
    'MyUni, OL, Online Class',
    '25 Apr -  6 Jun',
    'Monday',
    '3pm - 5pm',
    'MyUni, OL, Online Class',
    'Note: This class is for offshore/interstate students only.  Please refer to MyUni for details once enrolled.',
    '19783',
    'WR02',
    '60',
    '25',
    '4 Mar -  8 Apr',
    'Friday',
    '12pm - 2pm',
    'Helen Mayo Sth, SG20, Teaching Room',
    '29 Apr -  10 Jun',
    'Friday',
    '12pm - 2pm',
    'Helen Mayo Sth, SG20, Teaching Room',
    'Note: This class is only available for face-to-face (on-campus) students.',
    '19784',
    'WR01',
    '90',
    '8',
    '1 Mar -  5 Apr',
    'Tuesday',
    '9am - 11am',
    'Engineering & Mathematics, EM205, Teaching Room',
    '26 Apr -  31 May',
    'Tuesday',
    '9am - 11am',
    'Engineering & Mathematics, EM205, Teaching Room',
    'Note: This class is only available for face-to-face (on-campus) students.'
  ]

// for (let i = 0; i < Twoclasses.length; i++) {
//     console.log(i, Twoclasses[i]);
// }

FormatBigArrayTwoDay(Twoclasses)

function FormatBigArrayTwoDay(arr) {
    var classData = []; // contains lecture objects
    try {
        for (let c = 9; c < arr.length - 13; c += 13) {
            let init = {};
            init = UpdateObj("Class Nbr", arr[c], init);
            init = UpdateObj("Section", arr[c + 1], init);
            init = UpdateObj("Size", arr[c + 2], init);
            init = UpdateObj("Available", arr[c + 3], init);

            for (let i = c + 4; i < c + 13 - 4; i += 4) {
                let obj = init; // console.log(`range ${i} to ${i + 4}`)
                obj = UpdateObj("Dates", arr[i], obj);
                obj = UpdateObj("Days", arr[i + 1], obj);
                obj = UpdateObj("Time", arr[i + 2], obj);
                obj = UpdateObj("Location", arr[i + 3], obj);
                classData.push(JSON.stringify(obj));
            }
        }
        console.log(classData);
        return classData;
    } catch (err) {
        console.log(err);
        return [];
    }
}


function UpdateObj(key, value, LectureObj) {
    try {
        LectureObj[key] = value;
    } catch (e) {
        console.log(`value not added to json ${e}`);
    }
    return LectureObj;
}

// function formatBigArray(arr) {
//     var classData = []; // contains lecture objects
//     try {
//         for (let j = 9; j < arr.length - 13; j += 13) {
//             let init = {};
//             init = UpdateObj("Class Nbr", arr[j], init);
//             init = UpdateObj("Section", arr[j + 1], init);
//             init = UpdateObj("Size", arr[j + 2], init);
//             init = UpdateObj("Available", arr[j + 3], init);

//             for (let i = j + 4; i < j + 13 - 4; i += 4) {
//                 let obj = init; // console.log(`range ${i} to ${i + 4}`)
//                 obj = UpdateObj("Dates", arr[i], obj);
//                 obj = UpdateObj("Days", arr[i + 1], obj);
//                 obj = UpdateObj("Time", arr[i + 2], obj);
//                 obj = UpdateObj("Location", arr[i + 3], obj);
//                 classData.push(JSON.stringify(obj));
//             }
//         }
//         return classData;
//     } catch (err) {
//         console.log(err);
//         return [];
//     }
// }