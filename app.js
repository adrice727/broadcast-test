'use strict';
/*
 * Express Dependencies
 */
var express = require('express');
var app = express();
var port = 8000;
var bodyParser = require('body-parser');
var axios = require('axios');

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
var apiKey = '';
var apiSecret = '';
app.get('/config', (req, res, next) => {
    res.json({
        apiKey,
        apiSecret
    });
});

app.get('/broadcast', (req, res, next) => {
    
    let url = `https://api.opentok.com/v2/partner/${apiKey}/broadcast`;
    let sessionId = '2_MX40NTIzMjY3Mn5-MTQ1ODU5MTk4MTI3MH5LWnN0YXhRdHFJRm5lRTZ0ZGwxaG9JVkF-fg';

    let requestConfig = {
        method: 'post',
        url: url,
        data: {
            sessionId
        },
        headers: {
            'Content-Type': 'application/json',
            'X-TB-PARTNER-AUTH': `${apiKey}:${apiSecret}`,
            'Access-Control-Allow-Origin': 'http://localhost:8000'
        }
    };
    
    axios(requestConfig)
    .then(response => {
        res.json(response);
    })
    .catch(error => {
        let message = error.data.message;
        res.status(500);
        res.send({error:message});
    })

});



/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);