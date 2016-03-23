/*eslint-env es6 */

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

    const endBroadcast = (id) => {


    };

    return {
        getBroadcastUrl,
        endBroadcast
    };

})();