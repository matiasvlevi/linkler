require('dotenv').config();

const express = require('express');

const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const app = express();

// Static host the ./dist directory
app.use(express.static(path.join(__dirname, './dist')));

function readFileOrUndefined(filepath, codec) {
    try {
        return fs.readFileSync(filepath, codec);
    } catch(e) {
        console.log(`Something went wrong while reading the ${filepath} file`);
        return undefined;
    }
}

if (fs.existsSync('./ssl')) {
    // If SSL credentials were added host HTTPS server
    
    const credentials = {
        key: readFileOrUndefined('./ssl/key.pem', 'utf-8'),
        cert: readFileOrUndefined('./ssl/cert.pem', 'utf-8'),
        ca: readFileOrUndefined('./ssl/ca.pem', 'utf-8')
    }

    const server = https.createServer(credentials, app);

    server.listen(process.env.WEB_PORT || 443, () => {
        console.log(
            `Server is listening on port ${process.env.WEB_PORT}\n`+
            `https://localhost:${process.env.WEB_PORT}`
        );
    })

} else {
    // If no SSL host HTTP server

    app.listen(process.env.WEB_PORT || 80, () => {
        console.log(
            `Server is listening on port ${process.env.WEB_PORT}\n`+
            `http://localhost:${process.env.WEB_PORT}`
        );
    })

}


