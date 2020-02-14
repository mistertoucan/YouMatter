require('dotenv').config();
require('./db');

const express = require('express');
const { urlencoded } = require('body-parser');

const app = express();

app.use(urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.type('text/xml');
    next();
});

app.post("*", (req, res) => {
    console.log("REQUEST RECEIVED");
    console.log(req, res);
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`> Info: The server has started listening on port ${port}!`);
});