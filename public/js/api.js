/*eslint-env es6 */
'use strict';

const api = (() => {

    const getBroadcastUrl = (apiKey) => {

        return new Promise((resolve, reject) => {

            fetch('/broadcast')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    !!data.error ? reject(data.error.data.message) : resolve(data);
                })
                .catch(function(err) {
                    reject(err);
                });
        });

    };

    const endBroadcast = (broadcastId) => {

        return new Promise((resolve, reject) => {

            let request = new Request('/endBroadcast', {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ broadcastId })
            });

            fetch(request)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let broadcastEnded = { broadcastEnded: data.broadcastUrls === null };
                    !!data.error ? reject(data.error.data.message) : resolve(broadcastEnded);
                })
                .catch(function(err) { reject(err); });
        });

    };

    return {
        getBroadcastUrl,
        endBroadcast
    };


})();