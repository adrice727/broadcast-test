/*eslint-env es6 */
'use strict';

if (Hls.isSupported()) {

    var start = () => {

        const play = (videoData) => {

            let { broadcastId, broadcastUrl } = videoData;

            let video = document.getElementById('video');
            video.setAttribute('broadcast-id', videoData.broadcastId);
            let hls = new Hls();
            hls.loadSource(videoData.broadcastUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });

        };


        /** URL should not be accessed until 50 seconds later, after the 
         * initiation of the HLS broadcast, due to the delay between the 
         * HLS broadcast and the live broadcast from the OpenTok session.
         */
        const delay = 1000 * 55;

        api.getBroadcastUrl()
            .then(videoData => {
                console.log('waiting to start', videoData);
                setTimeout(() => { play(videoData); }, delay);
            });
    };

    var end = (broadcastId) => {

        broadcastId = broadcastId || document.getElementById('video').getAttribute('broadcast-id');
        api.endBroadcast(broadcastId)
            .then((response) => {
                let video = document.getElementById('video');
                video.stop();
            });

    };
}