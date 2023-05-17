require('dotenv').config();

const express = require('express');
const path = require('node:path');

const server = express();

server.use(express.static(path.join(__dirname, './public')));

server.listen(process.env.WEB_PORT, () => {
    console.log(
        `Server is listening on port ${process.env.WEB_PORT}`
    );
});
