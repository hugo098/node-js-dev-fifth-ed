import { promises as fs } from 'fs';

const listFiles = async () => {
    let dir = '.';
    if (process.argv[2]) {
        dir = process.argv[2];
    }
    const files = await fs.readdir(dir);

    for (let fn of files) {
        console.log(fn);
    }
}

listFiles().catch(err => console.error(err));