/*eslint-env es6 */
'use strict';

const axios = require('axios');
const H = require('hanuman-js');

/** OT Config */
const apiConfig = require('../config.json');
const apiKey = apiConfig.apiKey;
const apiSecret = apiConfig.apiSecret;


/** Constants */
const url = `https://api.opentok.com/v2/partner/${apiKey}/broadcast`;
const sessionId = '2_MX40NTIzMjY3Mn5-MTQ1ODY4MDM0MDQyOH5odUJyd0gwWlVrMHlLY1g0TXNQSTVVVWJ-fg';

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
        url,
        data: { sessionId }
    };

    console.log(requestConfig);

    axios(requestConfig)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
};

exports.endBroadcast = (req, res, next) => {

};