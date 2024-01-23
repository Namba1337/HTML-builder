const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
    // Создаем папку назначения, если она еще не существует
    await fs.mkdir(dest, { recursive: true });

    // Читаем содержимое исходной и целевой папок
    const srcEntries = await fs.readdir(src, { withFileTypes: true });
    const destEntries = await fs.readdir(dest, { withFileTypes: true });

    // Удаляем файлы из целевой папки, которых нет в исходной папке
    for (let destEntry of destEntries) {
        if (!srcEntries.find(srcEntry => srcEntry.name === destEntry.name)) {
            await fs.rm(path.join(dest, destEntry.name), { recursive: true, force: true });
        }
    }

    // Копируем файлы из исходной папки в целевую
    for (let srcEntry of srcEntries) {
        const srcPath = path.join(src, srcEntry.name);
        const destPath = path.join(dest, srcEntry.name);

        if (srcEntry.isDirectory()) {
            // Если элемент является папкой, рекурсивно копируем его содержимое
            await copyDir(srcPath, destPath);
        } else if (srcEntry.isFile()) {
            // Если элемент является файлом, копируем его
            await fs.copyFile(srcPath, destPath);
        }
    }
}

copyDir('04-copy-directory/files', '04-copy-directory/files-copy')
    .catch(console.error);