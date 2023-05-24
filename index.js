#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import * as path from 'path';

const yarg = yargs(hideBin(process.argv));
const usage = "\nUsage: where-is <file> [directory]";
const options = yarg.usage(usage).options({
    '-v': {
        alias: 'Version',
        describe: 'Show Version Number',
        type: 'string',
    },
    '-h': {
        alias: 'Help',
        describe: 'Show Help',
        type: 'string',
    }
}).argv;

// Display Welcome Message
if (yarg.argv._[0] == null || yarg.argv._[0] == "-h") {  
    console.log(usage);
    process.exit(0);
}

// Handle Action
function main() {
    const fileToFind = yarg.argv._[0];
    let dir = yarg.argv._[1];
    if (yarg.argv._[1] == null) {
        dir = path.parse(process.cwd()).root;
    }

    console.log(`Searching for ${fileToFind} in ${dir}`);
    const paths = findFiles(dir, fileToFind);
    if (paths.length > 0) {
        console.log(`Found ${paths.length} file(s) named ${fileToFind} in ${dir}`);
        for (let i = 0; i < paths.length; i++) {
            console.log(`${i + 1}: ${paths[i]}`);
        }
        process.exit(0);
    }

    console.log(`No file named ${fileToFind} found in ${dir}`);
    process.exit(0);
}

function findFiles(dir, fileName) {
    const files = fs.readdirSync(dir);
    let paths = [];
    for (const file of files) {
        const cPath = path.join(dir, file);
        if (fs.statSync(cPath).isDirectory() && files.length < 100) {
            try {
                fs.accessSync(cPath, fs.constants.R_OK)
                const subPaths = findFiles(cPath, fileName);
                paths = paths.concat(subPaths);
            } catch (err) {
                continue;
            }
        } else if (file === fileName) {
            paths.push(cPath);
        }
    }

    return paths;
}

await main();