const fs = require('fs').promises;
const path = require('path');

async function printFileInfo() {
    const folderPath = '03-files-in-folder/secret-folder';
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(folderPath, file.name);
            const stats = await fs.stat(filePath);
            const ext = path.extname(file.name);
            const name = path.basename(file.name, ext);
            const size = stats.size / 1024; // size in KB

            console.log(`${name}-${ext.slice(1)}-${size.toFixed(3)}kb`);
        }
    }
}

printFileInfo().catch(console.error);