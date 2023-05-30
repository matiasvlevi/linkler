require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const fs = require('node:fs');
const { readFileOrUndefined } = require('./server/readFileOrUndefined');

const https = require('node:https');
const path = require('node:path');

const app = express();

/**
 * Static host the ./dist directory
 */
app.use(express.static(path.join(__dirname, './dist')));

app.get('/', async (req, res) => {
    let html = '';

    const response = await fetch(`http://${process.env.STRAPI_HOST}:${process.env.PORT}/api/meta`);
    const { data } = await response.json();

    // If no meta data found, send html
    if (data === null) {
        html = fs.readFileSync('./dist/error.html', 'utf-8');
        const HELP = 'https://github.com/matiasvlevi/linkler/README.md';

        html = html.replaceAll('{{ERR-MESSAGE}}',`
            <p>Failed to fetch Name Data from strapi.<p>
            <p>Make sure the "Meta" Single Type is published</p>
            <p>More help at: <a href="${HELP}">${HELP}</a></p>
        `);
        res.send(html);
        return;
    }

    // If meta data found, add it to the html
    if (data.attributes.Name) {
        html = fs.readFileSync('./dist/page.html', 'utf-8');
        html = html.replaceAll('{{META-NAME}}', data.attributes.Name || '');
        html = html.replaceAll('{{META-TYPEWRITER}}', data.attributes.Typewriter_Effect ?? false);
    }

    // Send html
    res.send(html);
});

/**
 * All Strapi routes
 */
const strapiRoutes = [
    '/admin',
    '/_next',
    '/api',
    '/auth',
    '/content-manager',
    '/uploads',
    '/upload',
    '/content-type-builder',
    '/content-manager',
    '/email',
    '/favicon.ico',
    '/i18n',
    '/users-permissions'
];

/**
 * Create proxies for each strapi route
 */
strapiRoutes.forEach(route => {
    app.use(
        route,
        createProxyMiddleware({
            target: `http://${process.env.STRAPI_HOST}:${process.env.PORT}`,
            changeOrigin: true,
            followRedirects: true,
            pathRewrite: {
                [`^${route}`]: route,
            },
        })
    );
});

/**
 * Start the HTTP or HTTPS server
 */
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


