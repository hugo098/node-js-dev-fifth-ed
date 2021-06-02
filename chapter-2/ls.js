const fs = require('fs').promises;

async function listFiles() {
    try {
        const files = await fs.readdir('.');
        for (const file of files) {
            console.log(file);
        }
    }
    catch (err) {
        console.error(err);
    }
}

listFiles();