/*eslint-env es6 */
'use strict';

/*
 * General Dependencies
 */
const axios = require('axios');
const H = require('hanuman-js');

/*
 * Express Dependencies
 */
const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

/*
 * Routes
 */
app.get('/', (req, res, next) => {
    res.send('index.html');
});

/*
 * API
 */
const apiConfig = require('./config.json');
const apiKey = apiConfig.apiKey;
const apiSecret = apiConfig.apiSecret;
const broadcast = require('./api_handlers/broadcast');

app.get('/broadcast', broadcast.getBroadcastUrl);
app.post('/endBroadcast', broadcast.endBroadcast);


/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);