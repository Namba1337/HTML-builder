const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Hello, enter text: ', (answer) => {
    fs.appendFile('02-write-file/text.txt', answer + '\n', (err) => {
        if (err) throw err;
    });
    console.log('The text has been added to the file!');
    rl.close();
});

rl.on('SIGINT', () => {
    console.log('\nGoodbye!');
    process.exit();
});