require('dotenv').config();

const express = require('express');

const fs = require('node:fs');
const { readFileOrUndefined } = require('./server/readFileOrUndefined');

const https = require('node:https');
const path = require('node:path');
const { strapi } = require('./server/strapi');

const app = express();

app.use(express.json());

// Static host the ./dist directory
app.use(express.static(path.join(__dirname, './dist')));

/**
 * Static host the ./dist directory
 */
app.use(express.static(path.join(__dirname, './dist')));

app.get('/', async (req, res) => {
    let html = fs.readFileSync('./dist/page.html', 'utf-8');

    const response = await fetch(`http://${process.env.STRAPI_HOST}:${process.env.PORT}/api/meta`);
    const { data } = await response.json();

    // If no meta data found, send html
    if (data === null) {
        res.send(html);
        return;
    }

    // If meta data found, add it to the html
    if (data.attributes.Name) {
        html = html.replaceAll('{{META-NAME}}', data.attributes.Name || '');
        html = html.replaceAll('{{META-TYPEWRITER}}', data.attributes.Typewriter_Effect ?? false);
    }

    // Send html
    res.send(html);
});

/**
 * Bind uploads strapi endpoints 
 */
app.get('/uploads/*', async (req, res) => {
    const url = strapi(req.originalUrl);

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set('Content-Type', response.headers.get('Content-Type'));
    res.send(buffer);
});

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
            `https://localhost:${process.env.WEB_PORT || 443}`
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


