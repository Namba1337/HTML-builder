const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let firstQuestion = true;

const askQuestion = () => {
    const question = firstQuestion ? 'Hello, enter text: ' : 'Enter text: ';
    firstQuestion = false;

    rl.question(question, (answer) => {
        fs.appendFile('02-write-file/text.txt', answer + '\n', (err) => {
            if (err) throw err;
            console.log('The text has been added to the file!');
            askQuestion(); // Задаем вопрос снова после записи в файл
        });
    });
};

askQuestion(); // Запускаем цикл вопросов

rl.on('SIGINT', () => {
    console.log('\nGoodbye!');
    process.exit();
});