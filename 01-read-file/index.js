const fs = require('fs');

let readStream = fs.createReadStream('01-read-file/text.txt', 'utf8');

readStream.on('data', function(chunk) {
    console.log(chunk);
}).on('error', function(err) {
    console.error("File reading error:: ", err);
});