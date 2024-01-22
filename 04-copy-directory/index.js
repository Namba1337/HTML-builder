const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
    // Создаем папку назначения, если она еще не существует
    await fs.mkdir(dest, { recursive: true });

    // Читаем содержимое исходной папки
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Если элемент является папкой, рекурсивно копируем его содержимое
            await copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
            // Если элемент является файлом, копируем его
            await fs.copyFile(srcPath, destPath);
        }
    }
}

copyDir('04-copy-directory/files', '04-copy-directory/files-copy')
    .catch(console.error);