/*eslint-env es6 */
'use strict';

/** Imports */
const axios = require('axios');
const H = require('hanuman-js');

/** OT Config */
const apiConfig = require('../config.json');
const apiKey = apiConfig.apiKey;
const apiSecret = apiConfig.apiSecret;
const sessionId = apiConfig.sessionId;

/** Constants */
const broadcastURL = `https://api.opentok.com/v2/partner/${apiKey}/broadcast`;
const stopBroadcastURL = (id) => `${broadcastURL}/${id}/stop`;

const headers = {
    'Content-Type': 'application/json',
    'X-TB-PARTNER-AUTH': `${apiKey}:${apiSecret}`,
    'Access-Control-Allow-Origin': 'http://localhost:8000'
};

/** Helpers */

/** Handlers */
exports.getBroadcastUrl = (req, res, next) => {

    let requestConfig = {
        method: 'post',
        headers,
        url: broadcastURL,
        data: { sessionId }
    };

    axios(requestConfig)
        .then(response => {

            let broadcastData = {
                broadcastUrl: H.get(['data', 'broadcastUrls', 'hls'], response),
                broadcastId: H.get(['data', 'id'], response)
            };

            res.json(broadcastData);
        })
        .catch(error => { res.status(500).json({ error }); });
};

exports.endBroadcast = (req, res, next) => {

    let broadcastId = req.body.broadcastId;

    let requestConfig = {
        method: 'post',
        headers,
        url: stopBroadcastURL(broadcastId)
    };

    console.log(requestConfig);

    axios(requestConfig)
        .then(response => { res.json(H.pick(['broadcastUrls'], response.data)); })
        .catch(error => { res.status(500).json({ error }); });

};