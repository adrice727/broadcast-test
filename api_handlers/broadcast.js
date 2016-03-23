/*eslint-env es6 */
'use strict';

/** Imports */
const axios = require('axios');
const H = require('hanuman-js');
const bluebird = require('bluebird');

/** OT Config */
const apiConfig = require('../config.json');
const apiKey = apiConfig.apiKey;
const apiSecret = apiConfig.apiSecret;
const sessionId = apiConfig.sessionId;

/** Redis Config */
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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

            client.hmset('broadcast', {
                'url': broadcastData.broadcastUrl,
                'id': broadcastData.broadcastId
            });

            res.json(broadcastData);
        })
        .catch(error => { res.status(500).json({ error }); });
};

exports.endBroadcast = (req, res, next) => {

    let broadcastId = H.get(['body', 'broadcastId'], req);

    let requestConfig = {
        method: 'post',
        headers,
        url: stopBroadcastURL(broadcastId)
    };

    let sendEndRequest = () => {
        axios(requestConfig)
            .then(response => { res.json(H.pick(['broadcastUrls'], response.data)); })
            .catch(error => { res.status(500).json({ error }); });
    };

    // If the client doesn't send the id, retrieve it from redis
    if (!broadcastId) {
        client.hgetall('broadcast')
            .then(broadcastData => {
                broadcastId = broadcastData.broadcastId;
                sendEndRequest();
            });
    } else {
        sendEndRequest();
    }

};