const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

async function copyDir(src, dest) {
    // Создаем папку назначения, если она еще не существует
    await fsPromises.mkdir(dest, { recursive: true });

    // Читаем содержимое исходной папки
    const entries = await fsPromises.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Если элемент является папкой, рекурсивно копируем его содержимое
            await copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
            // Если элемент является файлом, копируем его
            await fsPromises.copyFile(srcPath, destPath);
        }
    }
}

async function buildPage() {
    const srcDir = '06-build-page';
    const destDir = path.join(srcDir, 'project-dist');
    const templateFile = path.join(srcDir, 'template.html');
    const componentsDir = path.join(srcDir, 'components');
    const stylesDir = path.join(srcDir, 'styles');
    const assetsDir = path.join(srcDir, 'assets');

    // Создаем папку назначения, если она еще не существует
    await fsPromises.mkdir(destDir, { recursive: true });

    // Читаем шаблон
    let template = await fsPromises.readFile(templateFile, 'utf8');

    // Заменяем теги шаблона на содержимое компонентов
    const componentFiles = await fsPromises.readdir(componentsDir);
    for (let file of componentFiles) {
        const name = path.basename(file, '.html');
        const regex = new RegExp(`{{${name}}}`, 'g');
        if (regex.test(template)) {
            const componentContent = await fsPromises.readFile(path.join(componentsDir, file), 'utf8');
            template = template.replace(regex, componentContent);
        }
    }

    // Сохраняем результат в файле index.html
    await fsPromises.writeFile(path.join(destDir, 'index.html'), template);

    // Компилируем стили в один файл
    const styleFiles = await fsPromises.readdir(stylesDir);
    let styles = '';
    for (let file of styleFiles) {
        if (path.extname(file) === '.css') {
            const styleContent = await fsPromises.readFile(path.join(stylesDir, file), 'utf8');
            styles += styleContent + '\n';
        }
    }
    await fsPromises.writeFile(path.join(destDir, 'style.css'), styles);

    // Копируем папку assets
    await copyDir(assetsDir, path.join(destDir, 'assets'));
}

buildPage().catch(console.error);