'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

/*
 * Routes
 */
app.get('/', (req, res, next) => {
    res.send('index.html');
});

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);