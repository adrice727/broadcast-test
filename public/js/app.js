/*eslint-env es6 */
'use strict';

if (Hls.isSupported()) {

    let hls;

    var start = () => {

        const play = (videoData) => {

            let { broadcastId, broadcastUrl } = videoData;

            let video = document.getElementById('video');
            video.setAttribute('broadcast-id', videoData.broadcastId);
            hls = new Hls();
            hls.loadSource(videoData.broadcastUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });

        };


        /** URL should not be accessed until 50 seconds later, after the 
         * initiation of the HLS broadcast, due to the delay between the 
         * HLS broadcast and the live broadcast from the OpenTok session.
         * Eventually we'll want to add a timestamp to the broadcast, so 
         * we know whether or not the delay is necessary.
         */
        const delay = 1000 * 55;

        api.getBroadcastUrl()
            .then(videoData => {
                console.log(`Broadcast will begin in ${delay/1000} seconds`, videoData);
                setTimeout(() => { play(videoData); }, delay);
            });
    };

    var end = () => {

        let broadcastId = document.getElementById('video').getAttribute('broadcast-id');
        api.endBroadcast(broadcastId)
            .then(response => {
                console.log('Broadcast ended.', response);
                let video = document.getElementById('video');
                video.pause();
                video.removeAttribute('src');
                video.removeAttribute('broadcast-id');
                hls.destroy();
            });

    };
}