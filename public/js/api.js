/*eslint-env es6 */

const api = (() => {

    // let _config = new Map();

    // const setConfig = (config) => {
    //     _config.set('apiKey', config.apiKey);
    //     _config.set('apiSecret', config.apiSecret);
    // };

    // const getConfig = () => {

    //     return new Promise((resolve, reject) => {

    //         fetch('/config')
    //             .then(response => {
    //                 return response.json();
    //             })
    //             .then(config => {
    //                 setConfig(config);
    //                 resolve();
    //             })
    //             .catch(err => {
    //                 reject(err);
    //             });
    //     });



    // };

    const getBroadcastUrl = (apiKey) => {

        return new Promise((resolve, reject) => {

            fetch('/broadcast')
                .then(response => response.json())
                .then(broadcastUrl => {
                    resolve(broadcastUrl);
                })
                .catch(function(err) {
                    console.error(err);
                    reject(err);
                });
        });

    };

    return {
        getBroadcastUrl
    };

})();