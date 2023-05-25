const { readFileSync } = require('node:fs');

function readFileOrUndefined(filepath, codec) {
    try {
        return readFileSync(filepath, codec);
    } catch(e) {
        console.log(`Something went wrong while reading the ${filepath} file`);
        return undefined;
    }
}

module.exports = { readFileOrUndefined };