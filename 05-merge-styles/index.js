const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

async function mergeStyles(srcDir, destFile) {
    // Создаем папку назначения, если она еще не существует
    const destDir = path.dirname(destFile);
    await fsPromises.mkdir(destDir, { recursive: true });

    // Читаем содержимое исходной папки
    const entries = await fsPromises.readdir(srcDir, { withFileTypes: true });

    // Открываем файл назначения для записи
    const writeStream = fs.createWriteStream(destFile);

    for (let entry of entries) {
        if (entry.isFile() && path.extname(entry.name) === '.css') {
            const srcFile = path.join(srcDir, entry.name);

            // Читаем содержимое файла стилей и записываем его в файл назначения
            const data = await fsPromises.readFile(srcFile, 'utf8');
            writeStream.write(data + '\n');
        }
    }

    writeStream.end();
}

mergeStyles('05-merge-styles/styles', '05-merge-styles/project-dist/bundle.css')
    .catch(console.error);