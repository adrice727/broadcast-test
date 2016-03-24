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
// Enable 'Async' methods
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

            console.log('Broadcast data from OT: ', broadcastData);

            /** We'll need to associate a broadcast with a specific session.  For now, jsut
             *  storing the most recent broadcast. */
            client.hmsetAsync('broadcast', {
                'broadcastId': broadcastData.broadcastId,
                'broadcastUrl': broadcastData.broadcastUrl
            }).then(res => {
                console.log('Broadcast data saved to redis.', res);
            }).catch(error => {
                console.log('Ruh roh', error);
            });

            res.json(broadcastData);
        })
        .catch(error => {

            /** Need to check the error to see if the broadcast has already started
             * If so, retrieve the broadcast info from redis.
             */
            console.log('error fetching url', error);
            if (error.status === 409) {
                console.log('Broadcast already started.  Fetching data from redis . . .');
                client.hgetallAsync('broadcast')
                    .then(broadcastData => {
                        res.json(broadcastData);
                    })
                    .catch(error => {
                        console.log('Ruh roh', error);
                    });

            } else {
                res.status(500).json({ error });
            }
        });
};

exports.endBroadcast = (req, res, next) => {

    let broadcastId = H.get(['body', 'broadcastId'], req);

    let requestConfig = () => {
        return {
            method: 'post',
            headers,
            url: stopBroadcastURL(broadcastId)
        };
    };

    let sendEndRequest = () => {
        axios(requestConfig())
            .then(response => {
                client.del('broadcast');
                res.json(H.pick(['broadcastUrls'], response.data));
            })
            .catch(error => { res.status(500).json({ error }); });
    };

    // If the client doesn't send the id, retrieve it from redis
    if (!broadcastId) {
        client.hgetallAsync('broadcast')
            .then(broadcastData => {
                broadcastId = H.get('broadcastId', broadcastData);
                /** If we don't get anything back from redis, the broadcast has 
                 * already ended. 
                 * */
                !!broadcastId ? sendEndRequest() : res.json({ broadcastUrls: null });
            });
    } else {
        sendEndRequest();
    }

};