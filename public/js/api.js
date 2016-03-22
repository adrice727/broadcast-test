/*eslint-env es6 */

const api = (() => {

    let _config = new Map();

    const setConfig = (config) => {
        _config.set('apiKey', config.apiKey);
        _config.set('apiSecret', config.apiSecret);
    };

    const createBroadcastRequest = () => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-TB-PARTNER-AUTH', `${_config.apiKey}:${_config.apiSecret}`);

        let sessionId = '2_MX40NTIzMjY3Mn5-MTQ1ODU5MTk4MTI3MH5LWnN0YXhRdHFJRm5lRTZ0ZGwxaG9JVkF-fg';
        let url = `https://api.opentok.com/v2/partner/${_config.apiKey}/broadcast`;

        return new Request(url, {
            headers
        });

    };

    const getConfig = () => {

        return new Promise((resolve, reject) => {

            fetch('/config')
                .then(response => {
                    return response.json();
                })
                .then(config => {
                    setConfig(config);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });



    };

    const getBroadcastUrl = (apiKey) => {

        return new Promise((resolve, reject) => {

            let getUrl = () => {
                
                let request = createBroadcastRequest();
                
                fetch(request).then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log('data from broadcast api', data);
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err);
                });
                
            };
            
            // Get api config variables from server
            getConfig().then(response => {
                getUrl();
            });



        });

    };

    return {
        getBroadcastUrl
    };

})();