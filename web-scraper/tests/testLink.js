linkarr = [
    'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+1+4210+1',
    'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108960+2+4210+1',
    'https://access.adelaide.edu.au/courses/details.asp?year=2022&course=108959+1+4210+1'
]

classarr = [
    [
        'Semester 1',
        'COMP SCI 2207',
        'Web & Database Computing',
        '3',
        'Undergraduate',
        'North Terrace',
        'Add'
    ],
    [
    'Semester 1',
    'COMP SCI 2207MELB',
    'Web & Database Computing',
    '3',
    'Undergraduate',
    'Melbourne',
    'Add'
    ],
    [
    'Semester 1',
    'COMP SCI 7207',
    'Web and Database Computing',
    '3',
    'Postgraduate Coursework',
    'North Terrace',
    'Add'
    ]
]

// jsonData_ = {
// };


function partitionData(classarr, linkarr) {
    let jsonData = {};
    let linkIndex = 0;
    for(row of classarr) {
        let courseName = row[1];
        let semester  = row[0];
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

console.log(partitionData(classarr, linkarr));









// formats array in form [semester, subject, name];
function formatArray(arr, links) {
    let link = 0;
    let formatted = [];
    for (let i = 0; i < arr.length - 7; i += 7) {
        let row = [arr[i], arr[i + 1], arr[i + 2], links[link]];
        link += 1;
        formatted.push(row);
    }
    console.log(formatted);
    return formatted;
}
// remove every second link
function ProcessLinks(array) {
    let i = array.length;
    let n = 2; // The "nth" element to remove
    while (i--) (i + 1) % n === 0 && (array.splice(i, 1));
    return array;
}

// formatArray(classarr, linkarr);