const { readFileSync } = require('node:fs');

module.exports = function errorPage(message) {
    const html = readFileSync('./dist/error.html', 'utf-8');
    return html.replaceAll('{{ERR-MESSAGE}}', message);
}